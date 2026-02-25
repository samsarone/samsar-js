#!/usr/bin/env bash
set -euo pipefail

# Always run from the script directory so paths resolve correctly.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Where the tarball will live in S3. Override these env vars if the bucket/region changes.
S3_BUCKET_URI="${S3_BUCKET_URI:-s3://samsar-resources}"
S3_HTTP_BASE="${S3_HTTP_BASE:-https://samsar-resources.s3.us-west-2.amazonaws.com}"

BUMP_LEVEL="${1:-minor}"
if [[ "$BUMP_LEVEL" != "minor" && "$BUMP_LEVEL" != "major" ]]; then
  echo "Usage: $0 [minor|major]" >&2
  exit 1
fi

npm version "$BUMP_LEVEL" --no-git-tag-version --force

PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
TARBALL="${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz"
TARBALL_S3_URI="${S3_BUCKET_URI%/}/${TARBALL}"
TARBALL_HTTP_URL="${S3_HTTP_BASE%/}/${TARBALL}"
export TARBALL_HTTP_URL

sudo npm run build
npm run pack

if [ ! -f "$TARBALL" ]; then
  echo "Pack output not found at ${TARBALL}" >&2
  exit 1
fi

TARBALL_PATH="${ROOT_DIR}/${TARBALL}"
TARBALL_INTEGRITY=$(node -e "const fs=require('fs');const crypto=require('crypto');const data=fs.readFileSync(process.argv[1]);const integrity='sha512-'+crypto.createHash('sha512').update(data).digest('base64');console.log(integrity);" "$TARBALL_PATH") || {
  echo "Failed to compute integrity for ${TARBALL}" >&2
  exit 1
}

if [ -z "${TARBALL_INTEGRITY:-}" ]; then
  echo "Integrity hash for ${TARBALL} is empty" >&2
  exit 1
fi

export PACKAGE_VERSION
export TARBALL_INTEGRITY

update_external_package_json() {
  local package_json="$1"
  local package_dir
  package_dir="$(dirname "$package_json")"
  local package_lock="${package_dir}/package-lock.json"
  local npm_shrinkwrap="${package_dir}/npm-shrinkwrap.json"

  if [ ! -f "$package_json" ]; then
    echo "Skipping update: ${package_json} not found"
    return
  fi

  if ! node - "$package_json" "$package_lock" "$npm_shrinkwrap" <<'NODE'
const [,, packagePath, lockPath, shrinkwrapPath] = process.argv;
const fs = require('fs');
const tarballUrl = process.env.TARBALL_HTTP_URL;
const version = process.env.PACKAGE_VERSION;
const integrity = process.env.TARBALL_INTEGRITY;

if (!tarballUrl || !version) {
  console.error('TARBALL_HTTP_URL or PACKAGE_VERSION is not set');
  process.exit(1);
}

const depSections = ['dependencies', 'devDependencies', 'optionalDependencies'];

const applySpecUpdate = (container, sections) => {
  if (!container) return false;
  let changed = false;

  sections.forEach((section) => {
    if (!container[section]) {
      container[section] = {};
    }

    if (container[section]['samsar-js'] !== tarballUrl) {
      container[section]['samsar-js'] = tarballUrl;
      changed = true;
    }
  });

  return changed;
};

const applyVersionedFields = (entry, meta) => {
  if (!entry) return false;
  let changed = false;

  if (entry.version !== version) {
    entry.version = version;
    changed = true;
  }

  if (entry.resolved !== tarballUrl) {
    entry.resolved = tarballUrl;
    changed = true;
  }

  if (integrity && entry.integrity !== integrity) {
    entry.integrity = integrity;
    changed = true;
  }

  if (typeof meta.dev === 'boolean' && (meta.dev || typeof entry.dev !== 'undefined') && entry.dev !== meta.dev) {
    entry.dev = meta.dev;
    changed = true;
  }

  if (typeof meta.optional === 'boolean' && (meta.optional || typeof entry.optional !== 'undefined') && entry.optional !== meta.optional) {
    entry.optional = meta.optional;
    changed = true;
  }

  return changed;
};

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (err) {
  console.error(`Failed to read ${packagePath}: ${err.message}`);
  process.exit(1);
}

const sectionsWithSamsar = depSections.filter(
  (section) => pkg[section] && Object.prototype.hasOwnProperty.call(pkg[section], 'samsar-js'),
);

if (sectionsWithSamsar.length === 0) {
  console.error(`samsar-js not listed in ${packagePath}`);
  process.exit(0);
}

const desiredMeta = {
  dev: !sectionsWithSamsar.includes('dependencies') && sectionsWithSamsar.includes('devDependencies'),
  optional: sectionsWithSamsar.includes('optionalDependencies'),
};

const packageUpdated = applySpecUpdate(pkg, sectionsWithSamsar);

if (packageUpdated) {
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  console.log(`Updated samsar-js to ${tarballUrl} in ${packagePath}`);
}

const updateLockFile = (lockFilePath) => {
  if (!lockFilePath || lockFilePath === 'undefined' || !fs.existsSync(lockFilePath)) {
    console.log(`Skipping update: ${lockFilePath} not found`);
    return false;
  }

  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(lockFilePath, 'utf8'));
  } catch (err) {
    console.error(`Failed to update ${lockFilePath}: ${err.message}`);
    return false;
  }

  let touched = false;
  const hasPackagesObject = lock.lockfileVersion && lock.lockfileVersion >= 2;

  if (hasPackagesObject) {
    if (!lock.packages) {
      lock.packages = {};
    }

    if (!lock.packages['']) {
      lock.packages[''] = {};
    }

    touched = applySpecUpdate(lock.packages[''], sectionsWithSamsar) || touched;

    if (!lock.packages['node_modules/samsar-js']) {
      lock.packages['node_modules/samsar-js'] = {};
    }

    touched = applyVersionedFields(lock.packages['node_modules/samsar-js'], desiredMeta) || touched;
  }

  if (!lock.dependencies) {
    lock.dependencies = {};
  }

  if (!lock.dependencies['samsar-js']) {
    lock.dependencies['samsar-js'] = {};
  }
  touched = applyVersionedFields(lock.dependencies['samsar-js'], desiredMeta) || touched;

  if (!touched) {
    console.error(`samsar-js not found in ${lockFilePath}`);
    return false;
  }

  fs.writeFileSync(lockFilePath, JSON.stringify(lock, null, 2));
  console.log(`Updated samsar-js to ${tarballUrl} in ${lockFilePath}`);
  return true;
};

const lockUpdated = updateLockFile(lockPath);
const shrinkwrapUpdated = updateLockFile(shrinkwrapPath);

if (!packageUpdated && !lockUpdated && !shrinkwrapUpdated) {
  console.error('No samsar-js references updated');
}

process.exit(0);
NODE
  then
    echo "Warning: failed to update ${package_json}" >&2
  fi
}

update_external_package_json "${ROOT_DIR}/../../Guidestination/Provider-Portal/package.json"
update_external_package_json "${ROOT_DIR}/../../Guidestination/Admin-Portal/package.json"
update_external_package_json "${ROOT_DIR}/../../Guidestination/guidestination/package.json"

aws s3 cp "$TARBALL" "$TARBALL_S3_URI"
echo "Uploaded ${TARBALL} to ${TARBALL_S3_URI}"
