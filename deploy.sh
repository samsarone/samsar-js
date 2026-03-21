#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

TMP_FILES=()
cleanup_tmp_files() {
  local tmp_file
  for tmp_file in "${TMP_FILES[@]-}"; do
    [[ -n "$tmp_file" ]] && rm -f "$tmp_file"
  done
}
trap cleanup_tmp_files EXIT

contains_element() {
  local needle="$1"
  shift
  local element
  for element in "$@"; do
    if [[ "$element" == "$needle" ]]; then
      return 0
    fi
  done
  return 1
}

is_exact_version_spec() {
  local spec="$1"
  [[ "${spec}" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]]
}

# Load env vars from .env when present (used for NPM_TOKEN and deploy options).
if [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
fi

BUMP_LEVEL="${1:-none}"
case "$BUMP_LEVEL" in
  none|patch|minor|major) ;;
  *)
    echo "Usage: $0 [none|patch|minor|major]" >&2
    exit 1
    ;;
esac

AUTO_BUMP_ON_PUBLISHED="${AUTO_BUMP_ON_PUBLISHED:-1}"
ALLOW_PUBLISHED_VERSION="${ALLOW_PUBLISHED_VERSION:-0}"
GIT_PUSH="${GIT_PUSH:-1}"
GIT_PUSH_GUIDESTINATION="${GIT_PUSH_GUIDESTINATION:-1}"

if [[ "$BUMP_LEVEL" != "none" ]]; then
  npm version "$BUMP_LEVEL" --no-git-tag-version
fi

PACKAGE_NAME="$(node -p "require('./package.json').name")"
PACKAGE_VERSION="$(node -p "require('./package.json').version")"

REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org/}"
REGISTRY_AUTH_HOST="${REGISTRY#http://}"
REGISTRY_AUTH_HOST="${REGISTRY_AUTH_HOST#https://}"
REGISTRY_AUTH_HOST="${REGISTRY_AUTH_HOST%/}"
REGISTRY_AUTH_PREFIX="//${REGISTRY_AUTH_HOST}/"

version_is_published() {
  npm view "${PACKAGE_NAME}@${PACKAGE_VERSION}" version --registry="${REGISTRY}" >/dev/null 2>&1
}

wait_for_registry_version() {
  local version="$1"
  local max_wait_seconds="${NPM_PUBLISH_MAX_WAIT_SECONDS:-180}"
  local poll_seconds="${NPM_PUBLISH_POLL_SECONDS:-5}"
  local elapsed=0

  while ! npm view "${PACKAGE_NAME}@${version}" version --registry="${REGISTRY}" >/dev/null 2>&1; do
    if [[ "${elapsed}" -ge "${max_wait_seconds}" ]]; then
      echo "Timed out waiting for ${PACKAGE_NAME}@${version} to appear on ${REGISTRY}." >&2
      return 1
    fi

    echo "Waiting for ${PACKAGE_NAME}@${version} to be available on ${REGISTRY} (${elapsed}s elapsed)..."
    sleep "${poll_seconds}"
    elapsed=$((elapsed + poll_seconds))
  done

  return 0
}

if version_is_published; then
  if [[ "$BUMP_LEVEL" == "none" && "$AUTO_BUMP_ON_PUBLISHED" == "1" ]]; then
    attempts=0
    while version_is_published; do
      attempts=$((attempts + 1))
      if [[ "$attempts" -gt 20 ]]; then
        echo "Unable to find an unpublished patch version after 20 attempts." >&2
        exit 1
      fi
      npm version patch --no-git-tag-version >/dev/null
      PACKAGE_VERSION="$(node -p "require('./package.json').version")"
    done
    echo "Auto-bumped version to ${PACKAGE_VERSION} because the previous version was already published."
  elif [[ "$ALLOW_PUBLISHED_VERSION" != "1" ]]; then
    echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is already published on ${REGISTRY}." >&2
    echo "Re-run with patch/minor/major, or set AUTO_BUMP_ON_PUBLISHED=1." >&2
    exit 1
  fi
fi

npm ci
npm run build

already_published="false"
publish_message="Published ${PACKAGE_NAME}@${PACKAGE_VERSION} to ${REGISTRY}"
if version_is_published; then
  already_published="true"
  publish_message="Using existing ${PACKAGE_NAME}@${PACKAGE_VERSION} from ${REGISTRY}"
fi

if [[ "${already_published}" != "true" ]]; then
  TOKEN="${NPM_TOKEN:-${NODE_AUTH_TOKEN:-}}"
  if [[ -z "${TOKEN}" ]]; then
    echo "NPM_TOKEN (or NODE_AUTH_TOKEN) is required in env/.env" >&2
    exit 1
  fi

  TMP_NPMRC="$(mktemp)"
  TMP_FILES+=("$TMP_NPMRC")

  printf "%s:_authToken=%s\nregistry=%s\nalways-auth=true\n" "$REGISTRY_AUTH_PREFIX" "$TOKEN" "$REGISTRY" > "$TMP_NPMRC"

  NPM_CONFIG_USERCONFIG="$TMP_NPMRC" npm whoami --registry="${REGISTRY}" >/dev/null
  if [[ -n "${NPM_OTP:-}" ]]; then
    NPM_CONFIG_USERCONFIG="$TMP_NPMRC" npm publish --access public --registry="${REGISTRY}" --otp "${NPM_OTP}"
  else
    NPM_CONFIG_USERCONFIG="$TMP_NPMRC" npm publish --access public --registry="${REGISTRY}"
  fi
else
  if [[ "$ALLOW_PUBLISHED_VERSION" != "1" ]]; then
    echo "Refusing to continue without publishing a new version." >&2
    exit 1
  fi
fi

wait_for_registry_version "${PACKAGE_VERSION}"

GUIDESTINATION_SYNCED_FILES=()
GUIDESTINATION_REPO_ROOTS=()
GUIDESTINATION_DEP_SPEC=""
GUIDESTINATION_MANIFEST_FILES=()

update_guidestination_manifests() {
  local dependency_spec="${GUIDESTINATION_SAMSAR_JS_SPEC:-${PACKAGE_VERSION}}"
  local -a candidate_roots=()
  local -a candidate_files=()
  local -a default_relative_files=(
    "Provider-Portal/package.json"
    "provider-portal/package.json"
    "Admin-Portal/package.json"
    "admin-portal/package.json"
    "guidestination/package.json"
    "Guidestination/package.json"
  )

  GUIDESTINATION_DEP_SPEC="${dependency_spec}"

  if [[ -n "${GUIDESTINATION_ROOT:-}" ]]; then
    candidate_roots+=("${GUIDESTINATION_ROOT}")
  else
    candidate_roots+=("${ROOT_DIR}/../../Guidestination")
    candidate_roots+=("${ROOT_DIR}/../../Guiddestination")
  fi

  local root relative_file
  for root in "${candidate_roots[@]}"; do
    for relative_file in "${default_relative_files[@]}"; do
      if [[ -f "${root}/${relative_file}" ]]; then
        candidate_files+=("${root}/${relative_file}")
      fi
    done
  done

  if [[ -n "${GUIDESTINATION_PACKAGE_FILES:-}" ]]; then
    local trimmed_file
    IFS=',' read -r -a extra_files <<< "${GUIDESTINATION_PACKAGE_FILES}"
    for file in "${extra_files[@]}"; do
      trimmed_file="${file#"${file%%[![:space:]]*}"}"
      trimmed_file="${trimmed_file%"${trimmed_file##*[![:space:]]}"}"
      if [[ -n "${trimmed_file}" ]]; then
        candidate_files+=("${trimmed_file}")
      fi
    done
  fi

  if [[ "${#candidate_files[@]}" -eq 0 ]]; then
    echo "No Guidestination package.json files found to update; skipping dependency sync."
    return
  fi

  GUIDESTINATION_MANIFEST_FILES=("${candidate_files[@]}")

  node - "${PACKAGE_NAME}" "${dependency_spec}" "${candidate_files[@]}" <<'NODE'
const fs = require('fs');

const [,, packageName, dependencySpec, ...manifestPaths] = process.argv;
const uniqueManifestPaths = [...new Set(manifestPaths)];
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
let updatedCount = 0;

for (const manifestPath of uniqueManifestPaths) {
  let fileContent;
  try {
    fileContent = fs.readFileSync(manifestPath, 'utf8');
  } catch (error) {
    console.error(`Skipping ${manifestPath}: ${error.message}`);
    continue;
  }

  let packageJson;
  try {
    packageJson = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Skipping ${manifestPath}: invalid JSON (${error.message})`);
    continue;
  }

  let changed = false;
  let foundDependency = false;
  for (const section of sections) {
    if (
      packageJson[section] &&
      Object.prototype.hasOwnProperty.call(packageJson[section], packageName)
    ) {
      foundDependency = true;
      if (packageJson[section][packageName] !== dependencySpec) {
        packageJson[section][packageName] = dependencySpec;
        changed = true;
      }
    }
  }

  if (!foundDependency) {
    console.log(`No ${packageName} dependency in ${manifestPath}; leaving unchanged.`);
    continue;
  }

  if (!changed) {
    console.log(`Already up to date: ${manifestPath}`);
    continue;
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(`Updated ${manifestPath} -> ${packageName}@${dependencySpec}`);
  updatedCount += 1;
}

console.log(
  `Guidestination dependency sync complete (${updatedCount} updated file(s)).`
);
NODE

  local manifest_list_file
  manifest_list_file="$(mktemp)"
  TMP_FILES+=("$manifest_list_file")

  node - "${PACKAGE_NAME}" "${candidate_files[@]}" <<'NODE' > "$manifest_list_file"
const fs = require('fs');

const [,, packageName, ...manifestPaths] = process.argv;
const uniqueManifestPaths = [...new Set(manifestPaths)];
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

for (const manifestPath of uniqueManifestPaths) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const hasDependency = sections.some(
      (section) =>
        packageJson[section] &&
        Object.prototype.hasOwnProperty.call(packageJson[section], packageName)
    );
    if (hasDependency) {
      console.log(manifestPath);
    }
  } catch {
    // Ignore unreadable or invalid package manifests.
  }
}
NODE

  local manifest_path project_dir lock_file repo_root
  local install_attempt install_max_attempts install_retry_delay
  local -a npm_install_args
  install_max_attempts="${GUIDESTINATION_INSTALL_RETRIES:-8}"
  install_retry_delay="${GUIDESTINATION_INSTALL_RETRY_DELAY_SECONDS:-5}"

  while IFS= read -r manifest_path; do
    if [[ -z "${manifest_path}" ]]; then
      continue
    fi

    GUIDESTINATION_SYNCED_FILES+=("${manifest_path}")
    project_dir="$(dirname "${manifest_path}")"

    if [[ -f "${project_dir}/package-lock.json" ]]; then
      npm_install_args=(
        --prefix "${project_dir}"
        --ignore-scripts
        --registry "${REGISTRY}"
      )
      if is_exact_version_spec "${dependency_spec}"; then
        npm_install_args+=(--save-exact)
      fi

      install_attempt=1
      while true; do
        if npm install \
          "${npm_install_args[@]}" \
          "${PACKAGE_NAME}@${dependency_spec}"; then
          break
        fi

        if [[ "${install_attempt}" -ge "${install_max_attempts}" ]]; then
          echo "Failed to install ${PACKAGE_NAME}@${dependency_spec} in ${project_dir} after ${install_max_attempts} attempts." >&2
          return 1
        fi

        echo "Retrying dependency install for ${project_dir} in ${install_retry_delay}s (attempt ${install_attempt}/${install_max_attempts})..."
        sleep "${install_retry_delay}"
        install_attempt=$((install_attempt + 1))
      done

      lock_file="${project_dir}/package-lock.json"
      GUIDESTINATION_SYNCED_FILES+=("${lock_file}")
      echo "Updated dependency install and lockfile for ${manifest_path}"
    else
      echo "No package-lock.json found for ${manifest_path}; skipping lockfile update."
    fi

    repo_root="$(git -C "${project_dir}" rev-parse --show-toplevel 2>/dev/null || true)"
    if [[ -n "${repo_root}" ]] && ! contains_element "${repo_root}" "${GUIDESTINATION_REPO_ROOTS[@]-}"; then
      GUIDESTINATION_REPO_ROOTS+=("${repo_root}")
    fi
  done < "${manifest_list_file}"
}

validate_guidestination_dependency_sync() {
  if [[ "${#GUIDESTINATION_MANIFEST_FILES[@]}" -eq 0 ]]; then
    return
  fi

  node - "${PACKAGE_NAME}" "${GUIDESTINATION_DEP_SPEC}" "${GUIDESTINATION_MANIFEST_FILES[@]}" <<'NODE'
const fs = require('fs');
const path = require('path');

const [,, packageName, expectedSpec, ...manifestPaths] = process.argv;
const uniqueManifestPaths = [...new Set(manifestPaths)];
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const mismatches = [];

for (const manifestPath of uniqueManifestPaths) {
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    mismatches.push(`${manifestPath}: unreadable package.json (${error.message})`);
    continue;
  }

  let declaredSpec = null;
  for (const section of sections) {
    if (
      packageJson[section] &&
      Object.prototype.hasOwnProperty.call(packageJson[section], packageName)
    ) {
      declaredSpec = packageJson[section][packageName];
      break;
    }
  }

  if (declaredSpec === null) {
    continue;
  }

  if (declaredSpec !== expectedSpec) {
    mismatches.push(
      `${manifestPath}: package.json has ${packageName}@${declaredSpec} (expected ${expectedSpec})`
    );
  }

  const lockPath = path.join(path.dirname(manifestPath), 'package-lock.json');
  if (!fs.existsSync(lockPath)) {
    continue;
  }

  let lockJson;
  try {
    lockJson = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch (error) {
    mismatches.push(`${lockPath}: unreadable package-lock.json (${error.message})`);
    continue;
  }

  const lockVersion =
    lockJson?.packages?.['node_modules/samsar-js']?.version ??
    lockJson?.dependencies?.['samsar-js']?.version ??
    null;

  const expectedVersion = expectedSpec.replace(/^[~^]/, '');
  if (typeof lockVersion === 'string' && lockVersion.length > 0) {
    if (lockVersion !== expectedVersion) {
      mismatches.push(
        `${lockPath}: lockfile has ${packageName}@${lockVersion} (expected ${expectedVersion})`
      );
    }
  } else {
    mismatches.push(`${lockPath}: missing node_modules/${packageName} entry`);
  }
}

if (mismatches.length > 0) {
  console.error('Guidestination dependency sync validation failed:');
  for (const issue of mismatches) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Guidestination dependency sync validation passed for ${uniqueManifestPaths.length} manifest(s).`);
NODE
}

commit_and_push_repo() {
  local repo_dir="$1"
  local commit_message="$2"
  shift 2

  if ! git -C "${repo_dir}" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Skipping git push for ${repo_dir}: not a git repository."
    return
  fi

  local repo_root
  repo_root="$(git -C "${repo_dir}" rev-parse --show-toplevel)"

  if [[ "$#" -gt 0 ]]; then
    git -C "${repo_root}" add -- "$@"
  else
    git -C "${repo_root}" add -A
  fi

  if git -C "${repo_root}" diff --cached --quiet; then
    echo "No changes to commit in ${repo_root}."
    return
  fi

  git -C "${repo_root}" commit -m "${commit_message}"
  git -C "${repo_root}" push
  echo "Pushed ${repo_root} to GitHub."
}

update_guidestination_manifests
validate_guidestination_dependency_sync

if [[ "${GIT_PUSH}" == "1" ]]; then
  commit_and_push_repo "${ROOT_DIR}" "chore(release): publish ${PACKAGE_NAME}@${PACKAGE_VERSION}"
else
  echo "Skipping samsar-js git push (GIT_PUSH=${GIT_PUSH})."
fi

if [[ "${GIT_PUSH_GUIDESTINATION}" == "1" && "${#GUIDESTINATION_REPO_ROOTS[@]}" -gt 0 ]]; then
  for repo_root in "${GUIDESTINATION_REPO_ROOTS[@]-}"; do
    repo_files=()
    for synced_file in "${GUIDESTINATION_SYNCED_FILES[@]-}"; do
      if [[ "${synced_file}" == "${repo_root}/"* ]]; then
        repo_files+=("${synced_file#"${repo_root}/"}")
      fi
    done

    if [[ "${#repo_files[@]}" -gt 0 ]]; then
      commit_and_push_repo "${repo_root}" "chore: bump ${PACKAGE_NAME} to ${GUIDESTINATION_DEP_SPEC}" "${repo_files[@]}"
    fi
  done
else
  echo "Skipping Guidestination git push."
fi

echo "${publish_message}"
