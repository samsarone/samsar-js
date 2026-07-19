#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

TMP_FILES=()
TMP_DIRS=()
cleanup_tmp_files() {
  local tmp_file tmp_dir
  for tmp_file in "${TMP_FILES[@]-}"; do
    [[ -n "$tmp_file" ]] && rm -f "$tmp_file"
  done
  for tmp_dir in "${TMP_DIRS[@]-}"; do
    [[ -n "$tmp_dir" ]] && rm -rf "$tmp_dir"
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

repair_owned_tree() {
  local owner="$1"
  local group="$2"
  local path="$3"

  if [[ ! -e "${path}" ]]; then
    return
  fi

  echo "Repairing ownership and write permissions for ${path} as ${owner}:${group}..."
  chown -R "${owner}:${group}" "${path}"
  chmod -R u+rwX "${path}"
}

repair_deploy_ownership() {
  local owner="$1"
  local group="$2"
  local root package_file trimmed_file
  local -a package_files

  repair_owned_tree "${owner}" "${group}" "${ROOT_DIR}"

  if [[ -n "${SAMSAR_ONE_ROOTS:-}" ]]; then
    IFS=',' read -r -a package_files <<< "${SAMSAR_ONE_ROOTS}"
    for root in "${package_files[@]}"; do
      trimmed_file="${root#"${root%%[![:space:]]*}"}"
      trimmed_file="${trimmed_file%"${trimmed_file##*[![:space:]]}"}"
      if [[ -n "${trimmed_file}" ]]; then
        repair_owned_tree "${owner}" "${group}" "${trimmed_file}"
      fi
    done
  elif [[ -n "${SAMSAR_ONE_ROOT:-}" ]]; then
    repair_owned_tree "${owner}" "${group}" "${SAMSAR_ONE_ROOT}"
  elif [[ -n "${SAMSAR_PROCESSOR_ROOT:-}" ]]; then
    repair_owned_tree "${owner}" "${group}" "${SAMSAR_PROCESSOR_ROOT}"
  else
    for root in \
      "${ROOT_DIR}/../samsar_processor" \
      "${ROOT_DIR}/../samsar_ai_video_layer_generator" \
      "${ROOT_DIR}/../samsar_audio_generator" \
      "${ROOT_DIR}/../samsar_generator" \
      "${ROOT_DIR}/../samsar_express_video_listener" \
      "${ROOT_DIR}/../samsar_assistant_query_processor"; do
      repair_owned_tree "${owner}" "${group}" "${root}"
    done

    if [[ "${SYNC_SAMSAR_GALLERY:-0}" == "1" ]]; then
      repair_owned_tree "${owner}" "${group}" "${ROOT_DIR}/../samsar-gallery"
    fi

    if [[ "${SYNC_SAMSAR_MONOREPO:-1}" == "1" ]]; then
      repair_owned_tree "${owner}" "${group}" "${SAMSAR_MONOREPO_ROOT:-${ROOT_DIR}/../samsar}"
    fi
  fi

  if [[ -n "${SAMSAR_ONE_PACKAGE_FILES:-}" ]]; then
    IFS=',' read -r -a package_files <<< "${SAMSAR_ONE_PACKAGE_FILES}"
    for package_file in "${package_files[@]}"; do
      trimmed_file="${package_file#"${package_file%%[![:space:]]*}"}"
      trimmed_file="${trimmed_file%"${trimmed_file##*[![:space:]]}"}"
      if [[ -n "${trimmed_file}" ]]; then
        repair_owned_tree "${owner}" "${group}" "$(dirname "${trimmed_file}")"
      fi
    done
  fi

  if [[ -n "${SAMSAR_PROCESSOR_PACKAGE_FILES:-}" ]]; then
    IFS=',' read -r -a package_files <<< "${SAMSAR_PROCESSOR_PACKAGE_FILES}"
    for package_file in "${package_files[@]}"; do
      trimmed_file="${package_file#"${package_file%%[![:space:]]*}"}"
      trimmed_file="${trimmed_file%"${trimmed_file##*[![:space:]]}"}"
      if [[ -n "${trimmed_file}" ]]; then
        repair_owned_tree "${owner}" "${group}" "$(dirname "${trimmed_file}")"
      fi
    done
  fi
}

if [[ "${EUID}" -eq 0 && "${ALLOW_SUDO_DEPLOY:-0}" != "1" ]]; then
  echo "Do not run deploy.sh as root. Run it directly as the repository owner." >&2
  exit 1
fi

BUMP_LEVEL="${1:-none}"
case "$BUMP_LEVEL" in
  none|patch|minor|major) ;;
  *)
    echo "Usage: $0 [none|patch|minor|major]" >&2
    exit 1
    ;;
esac

AUTO_BUMP_ON_PUBLISHED="${AUTO_BUMP_ON_PUBLISHED:-0}"
ALLOW_PUBLISHED_VERSION="${ALLOW_PUBLISHED_VERSION:-0}"
RESUME_PUBLISHED_VERSION="${RESUME_PUBLISHED_VERSION:-${ALLOW_PUBLISHED_VERSION}}"
GIT_PUSH="${GIT_PUSH:-1}"
SAMSAR_JS_GIT_REMOTE="${SAMSAR_JS_GIT_REMOTE:-origin}"
SAMSAR_JS_MAIN_BRANCH="${SAMSAR_JS_MAIN_BRANCH:-main}"
SAMSAR_JS_SOURCE_COMMIT_MESSAGE="${SAMSAR_JS_SOURCE_COMMIT_MESSAGE:-feat(sdk): update client bundle}"
GIT_PUSH_SAMSAR_ONE="${GIT_PUSH_SAMSAR_ONE:-${GIT_PUSH_SAMSAR_PROCESSOR:-1}}"
SAMSAR_ONE_GIT_REMOTE="${SAMSAR_ONE_GIT_REMOTE:-origin}"
SYNC_SAMSAR_GALLERY="${SYNC_SAMSAR_GALLERY:-0}"
GIT_PUSH_SAMSAR_GALLERY="${GIT_PUSH_SAMSAR_GALLERY:-1}"
SAMSAR_GALLERY_GIT_REMOTE="${SAMSAR_GALLERY_GIT_REMOTE:-origin}"
SAMSAR_GALLERY_ROOT="${SAMSAR_GALLERY_ROOT:-${ROOT_DIR}/../samsar-gallery}"
SAMSAR_GALLERY_REPOSITORY="${SAMSAR_GALLERY_REPOSITORY:-https://github.com/samsarone/Gallery.git}"
SAMSAR_GALLERY_REPO_ROOT=""
SYNC_SAMSAR_MONOREPO="${SYNC_SAMSAR_MONOREPO:-1}"
GIT_PUSH_SAMSAR_MONOREPO="${GIT_PUSH_SAMSAR_MONOREPO:-1}"
SAMSAR_MONOREPO_ROOT="${SAMSAR_MONOREPO_ROOT:-${ROOT_DIR}/../samsar}"
SAMSAR_MONOREPO_SYNC_SCRIPT="${SAMSAR_MONOREPO_SYNC_SCRIPT:-${ROOT_DIR}/../scripts/sync-projects.sh}"
SAMSAR_MONOREPO_GIT_REMOTE="${SAMSAR_MONOREPO_GIT_REMOTE:-origin}"
SAMSAR_MONOREPO_MAIN_BRANCH="${SAMSAR_MONOREPO_MAIN_BRANCH:-main}"
SAMSAR_MONOREPO_COMMIT_MESSAGE="${SAMSAR_MONOREPO_COMMIT_MESSAGE:-}"

PACKAGE_NAME="$(node -p "require('./package.json').name")"
REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org/}"
REGISTRY_AUTH_HOST="${REGISTRY#http://}"
REGISTRY_AUTH_HOST="${REGISTRY_AUTH_HOST#https://}"
REGISTRY_AUTH_HOST="${REGISTRY_AUTH_HOST%/}"
REGISTRY_AUTH_PREFIX="//${REGISTRY_AUTH_HOST}/"

RELEASE_BRANCH=""
RELEASE_HEAD=""

prepare_samsar_gallery_target() {
  if [[ "${SYNC_SAMSAR_GALLERY}" != "1" ]]; then
    echo "Skipping Samsar Gallery dependency sync (SYNC_SAMSAR_GALLERY=${SYNC_SAMSAR_GALLERY})."
    return
  fi

  if [[ ! -f "${SAMSAR_GALLERY_ROOT}/package.json" ]]; then
    local clone_parent clone_dir
    clone_parent="$(mktemp -d "${TMPDIR:-/tmp}/samsar-gallery-sync.XXXXXX")"
    TMP_DIRS+=("${clone_parent}")
    clone_dir="${clone_parent}/samsar-gallery"
    echo "Samsar Gallery is not available beside samsar-js; cloning ${SAMSAR_GALLERY_REPOSITORY}..."
    git clone --depth 1 "${SAMSAR_GALLERY_REPOSITORY}" "${clone_dir}"
    SAMSAR_GALLERY_ROOT="${clone_dir}"
  fi

  if ! node - "${SAMSAR_GALLERY_ROOT}/package.json" <<'NODE'
const fs = require('fs');
const packagePath = process.argv[2];
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
if (!sections.some((section) => Object.prototype.hasOwnProperty.call(packageJson[section] || {}, 'samsar-js'))) {
  console.error(`${packagePath} does not declare samsar-js.`);
  process.exit(1);
}
NODE
  then
    echo "Samsar Gallery cannot be synchronized because its package manifest is invalid." >&2
    exit 1
  fi

  SAMSAR_GALLERY_REPO_ROOT="$(git -C "${SAMSAR_GALLERY_ROOT}" rev-parse --show-toplevel 2>/dev/null || true)"
  if [[ -z "${SAMSAR_GALLERY_REPO_ROOT}" ]]; then
    echo "Samsar Gallery dependency sync requires a git checkout at ${SAMSAR_GALLERY_ROOT}." >&2
    exit 1
  fi

  if ! git -C "${SAMSAR_GALLERY_REPO_ROOT}" diff --quiet -- package.json package-lock.json ||
    ! git -C "${SAMSAR_GALLERY_REPO_ROOT}" diff --cached --quiet -- package.json package-lock.json; then
    echo "Samsar Gallery package.json or package-lock.json already has local changes." >&2
    echo "Commit or restore those dependency files before publishing samsar-js." >&2
    exit 1
  fi

  if ! git -C "${SAMSAR_GALLERY_REPO_ROOT}" diff --cached --quiet; then
    echo "Samsar Gallery has staged changes; refusing to mix them into the automatic dependency commit." >&2
    exit 1
  fi

  if [[ "${GIT_PUSH_SAMSAR_GALLERY}" == "1" ]]; then
    local upstream_ref remote_name remote_ahead local_ahead
    upstream_ref="$(git -C "${SAMSAR_GALLERY_REPO_ROOT}" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
    if [[ -n "${upstream_ref}" ]]; then
      remote_name="${upstream_ref%%/*}"
      git -C "${SAMSAR_GALLERY_REPO_ROOT}" fetch "${remote_name}"
      read -r local_ahead remote_ahead < <(
        git -C "${SAMSAR_GALLERY_REPO_ROOT}" rev-list --left-right --count HEAD..."${upstream_ref}"
      )
      if [[ "${remote_ahead}" -gt 0 ]]; then
        echo "Samsar Gallery is behind ${upstream_ref} by ${remote_ahead} commit(s)." >&2
        echo "Pull/rebase Gallery before publishing so its dependency update can be pushed safely." >&2
        exit 1
      fi
    fi
  fi
}

require_clean_repo() {
  local repo_dir="$1"
  local label="$2"
  local status_output

  if ! git -C "${repo_dir}" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "${label} is not a git repository: ${repo_dir}" >&2
    return 1
  fi

  status_output="$(git -C "${repo_dir}" status --porcelain --untracked-files=all)"
  if [[ -n "${status_output}" ]]; then
    echo "${label} must be clean before publishing ${PACKAGE_NAME}." >&2
    printf '%s\n' "${status_output}" >&2
    return 1
  fi
}

remote_branch_exists() {
  local repo_dir="$1"
  local remote_name="$2"
  local branch_name="$3"
  local exit_code

  git -C "${repo_dir}" ls-remote --exit-code --heads "${remote_name}" \
    "refs/heads/${branch_name}" >/dev/null 2>&1 && return 0
  exit_code=$?
  if [[ "${exit_code}" -eq 2 ]]; then
    return 1
  fi

  echo "Unable to inspect ${remote_name}/${branch_name} in ${repo_dir}." >&2
  return 2
}

preflight_explicit_ref_push() {
  local repo_dir="$1"
  local remote_name="$2"
  local branch_name="$3"
  local label="$4"
  local require_remote_branch="${5:-1}"
  local allow_local_ahead="${6:-1}"
  local current_branch upstream_ref local_ahead remote_ahead remote_ref branch_status

  current_branch="$(git -C "${repo_dir}" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  if [[ -z "${current_branch}" ]]; then
    echo "${label} is on a detached HEAD; refusing to publish." >&2
    return 1
  fi
  if [[ "${current_branch}" != "${branch_name}" ]]; then
    echo "${label} must be on ${branch_name}; current branch is ${current_branch}." >&2
    return 1
  fi
  if ! git -C "${repo_dir}" remote get-url "${remote_name}" >/dev/null 2>&1; then
    echo "${label} git remote is not configured: ${remote_name}" >&2
    return 1
  fi

  upstream_ref="$(git -C "${repo_dir}" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
  if [[ -n "${upstream_ref}" && "${upstream_ref}" != "${remote_name}/${branch_name}" ]]; then
    echo "${label} tracks ${upstream_ref}, not ${remote_name}/${branch_name}; refusing to change its upstream." >&2
    return 1
  fi

  branch_status=0
  remote_branch_exists "${repo_dir}" "${remote_name}" "${branch_name}" || branch_status=$?
  if [[ "${branch_status}" -eq 0 ]]; then
    remote_ref="refs/remotes/${remote_name}/${branch_name}"
    git -C "${repo_dir}" fetch "${remote_name}" \
      "+refs/heads/${branch_name}:${remote_ref}"
    read -r local_ahead remote_ahead < <(
      git -C "${repo_dir}" rev-list --left-right --count HEAD..."${remote_ref}"
    )
    if [[ "${remote_ahead}" -gt 0 && "${local_ahead}" -gt 0 ]]; then
      echo "${label} has diverged from ${remote_name}/${branch_name}." >&2
      return 1
    fi
    if [[ "${remote_ahead}" -gt 0 ]]; then
      echo "${label} is behind ${remote_name}/${branch_name} by ${remote_ahead} commit(s)." >&2
      return 1
    fi
    if [[ "${allow_local_ahead}" != "1" && "${local_ahead}" -gt 0 ]]; then
      echo "${label} is ahead of ${remote_name}/${branch_name} by ${local_ahead} unrelated commit(s)." >&2
      return 1
    fi
  elif [[ "${branch_status}" -eq 1 && "${require_remote_branch}" != "1" ]]; then
    echo "${label} will create ${remote_name}/${branch_name}."
  elif [[ "${branch_status}" -eq 1 ]]; then
    echo "${label} remote branch does not exist: ${remote_name}/${branch_name}" >&2
    return 1
  else
    return "${branch_status}"
  fi

  git -C "${repo_dir}" push --dry-run "${remote_name}" \
    "HEAD:refs/heads/${branch_name}"
}

push_current_branch_explicit() {
  local repo_dir="$1"
  local remote_name="$2"
  local branch_name="$3"
  local label="$4"
  local upstream_ref

  upstream_ref="$(git -C "${repo_dir}" rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
  if [[ -n "${upstream_ref}" && "${upstream_ref}" != "${remote_name}/${branch_name}" ]]; then
    echo "${label} tracks ${upstream_ref}, not ${remote_name}/${branch_name}; refusing to change its upstream." >&2
    return 1
  fi

  if [[ -z "${upstream_ref}" ]]; then
    git -C "${repo_dir}" push --set-upstream "${remote_name}" \
      "HEAD:refs/heads/${branch_name}"
  else
    git -C "${repo_dir}" push "${remote_name}" \
      "HEAD:refs/heads/${branch_name}"
  fi
}

root_declares_registry_dependency() {
  local root="$1"

  node - "${PACKAGE_NAME}" "${root}" <<'NODE'
const fs = require('fs');
const path = require('path');

const [,, packageName, root] = process.argv;
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const skipDirs = new Set(['.git', '.next', 'build', 'coverage', 'dist', 'node_modules', 'outputs']);
let found = false;

function isRegistrySpec(spec) {
  return typeof spec === 'string' && spec.length > 0 &&
    !/^(?:file:|https?:|git(?:\+|:)|github:|link:|workspace:)/.test(spec);
}

function walk(dir) {
  if (found) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (found) return;
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(entryPath);
      continue;
    }
    if (!entry.isFile() || entry.name !== 'package.json') continue;
    try {
      const packageJson = JSON.parse(fs.readFileSync(entryPath, 'utf8'));
      found = sections.some((section) =>
        Object.prototype.hasOwnProperty.call(packageJson[section] || {}, packageName) &&
        isRegistrySpec(packageJson[section][packageName])
      );
    } catch {}
  }
}

walk(path.resolve(root));
process.exit(found ? 0 : 1);
NODE
}

preflight_sdk_release() {
  if [[ "${GIT_PUSH}" != "1" ]]; then
    echo "Publishing ${PACKAGE_NAME} requires its release commit to be pushed first; GIT_PUSH must be 1." >&2
    return 1
  fi

  RELEASE_BRANCH="${SAMSAR_JS_MAIN_BRANCH}"
  preflight_explicit_ref_push "${ROOT_DIR}" "${SAMSAR_JS_GIT_REMOTE}" \
    "${RELEASE_BRANCH}" "samsar-js SDK" 1
}

commit_and_push_sdk_main_before_deploy() {
  local status_output

  status_output="$(git -C "${ROOT_DIR}" status --porcelain --untracked-files=all)"
  if [[ -n "${status_output}" ]]; then
    echo "Validating local samsar-js changes before committing them to ${SAMSAR_JS_MAIN_BRANCH}..."
    npm test
    git -C "${ROOT_DIR}" add -A
    git -C "${ROOT_DIR}" diff --cached --check
    git -C "${ROOT_DIR}" commit -m "${SAMSAR_JS_SOURCE_COMMIT_MESSAGE}"
  else
    echo "No local samsar-js source changes to commit."
  fi

  status_output="$(git -C "${ROOT_DIR}" status --porcelain --untracked-files=all)"
  if [[ -n "${status_output}" ]]; then
    echo "samsar-js still has uncommitted files after the automatic source commit." >&2
    printf '%s\n' "${status_output}" >&2
    return 1
  fi

  echo "Pushing samsar-js HEAD to ${SAMSAR_JS_GIT_REMOTE}/${SAMSAR_JS_MAIN_BRANCH} before deployment preflights..."
  push_current_branch_explicit "${ROOT_DIR}" "${SAMSAR_JS_GIT_REMOTE}" \
    "${SAMSAR_JS_MAIN_BRANCH}" "samsar-js SDK"
  echo "samsar-js ${SAMSAR_JS_MAIN_BRANCH} is available on ${SAMSAR_JS_GIT_REMOTE}."
}

preflight_samsar_one_targets() {
  local root file trimmed_file repo_root current_branch
  local -a candidate_roots=()
  local -a package_files=()
  local -a repo_roots=()

  if [[ "${GIT_PUSH_SAMSAR_ONE}" == "1" ]]; then
    if [[ -n "${SAMSAR_ONE_ROOTS:-}" ]]; then
      IFS=',' read -r -a candidate_roots <<< "${SAMSAR_ONE_ROOTS}"
    elif [[ -n "${SAMSAR_ONE_ROOT:-}" ]]; then
      candidate_roots+=("${SAMSAR_ONE_ROOT}")
    elif [[ -n "${SAMSAR_PROCESSOR_ROOT:-}" ]]; then
      candidate_roots+=("${SAMSAR_PROCESSOR_ROOT}")
    else
      candidate_roots+=(
        "${ROOT_DIR}/../samsar_processor"
        "${ROOT_DIR}/../samsar_ai_video_layer_generator"
        "${ROOT_DIR}/../samsar_audio_generator"
        "${ROOT_DIR}/../samsar_generator"
        "${ROOT_DIR}/../samsar_express_video_listener"
        "${ROOT_DIR}/../samsar_assistant_query_processor"
      )
    fi

    if [[ -n "${SAMSAR_ONE_PACKAGE_FILES:-}" ]]; then
      IFS=',' read -r -a package_files <<< "${SAMSAR_ONE_PACKAGE_FILES}"
    fi
    if [[ -n "${SAMSAR_PROCESSOR_PACKAGE_FILES:-}" ]]; then
      local -a legacy_package_files=()
      IFS=',' read -r -a legacy_package_files <<< "${SAMSAR_PROCESSOR_PACKAGE_FILES}"
      package_files+=("${legacy_package_files[@]}")
    fi

    for root in "${candidate_roots[@]-}"; do
      trimmed_file="${root#"${root%%[![:space:]]*}"}"
      trimmed_file="${trimmed_file%"${trimmed_file##*[![:space:]]}"}"
      if [[ ! -d "${trimmed_file}" ]]; then
        echo "Required canonical consumer is missing: ${trimmed_file}" >&2
        return 1
      fi
      if ! root_declares_registry_dependency "${trimmed_file}"; then
        echo "Required canonical consumer does not declare ${PACKAGE_NAME}: ${trimmed_file}" >&2
        return 1
      fi
      repo_root="$(git -C "${trimmed_file}" rev-parse --show-toplevel 2>/dev/null || true)"
      if [[ -z "${repo_root}" ]]; then
        echo "Canonical consumer is not a git checkout: ${trimmed_file}" >&2
        return 1
      fi
      if ! contains_element "${repo_root}" "${repo_roots[@]-}"; then
        repo_roots+=("${repo_root}")
      fi
    done

    for file in "${package_files[@]-}"; do
      trimmed_file="${file#"${file%%[![:space:]]*}"}"
      trimmed_file="${trimmed_file%"${trimmed_file##*[![:space:]]}"}"
      if [[ -z "${trimmed_file}" ]]; then
        continue
      fi
      if [[ ! -f "${trimmed_file}" ]]; then
        echo "Explicit consumer package is missing: ${trimmed_file}" >&2
        return 1
      fi
      repo_root="$(git -C "$(dirname "${trimmed_file}")" rev-parse --show-toplevel 2>/dev/null || true)"
      if [[ -z "${repo_root}" ]]; then
        echo "Explicit consumer package is not in a git checkout: ${trimmed_file}" >&2
        return 1
      fi
      if ! contains_element "${repo_root}" "${repo_roots[@]-}"; then
        repo_roots+=("${repo_root}")
      fi
    done

    for repo_root in "${repo_roots[@]-}"; do
      current_branch="$(git -C "${repo_root}" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
      preflight_explicit_ref_push "${repo_root}" "${SAMSAR_ONE_GIT_REMOTE}" \
        "${current_branch}" "canonical consumer ${repo_root}" 1 0
    done
  fi

  if [[ "${SYNC_SAMSAR_GALLERY}" == "1" && "${GIT_PUSH_SAMSAR_GALLERY}" == "1" ]]; then
    current_branch="$(git -C "${SAMSAR_GALLERY_REPO_ROOT}" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
    preflight_explicit_ref_push "${SAMSAR_GALLERY_REPO_ROOT}" "${SAMSAR_GALLERY_GIT_REMOTE}" \
      "${current_branch}" "Samsar Gallery" 1 0
  fi
}

preflight_samsar_monorepo() {
  local current_branch

  if [[ "${SYNC_SAMSAR_MONOREPO}" != "1" ]]; then
    echo "Skipping Samsar monorepo propagation (SYNC_SAMSAR_MONOREPO=${SYNC_SAMSAR_MONOREPO})."
    return
  fi
  if [[ "${GIT_PUSH_SAMSAR_MONOREPO}" == "1" && "${GIT_PUSH_SAMSAR_ONE}" != "1" ]]; then
    echo "Monorepo push requires canonical source pushes (GIT_PUSH_SAMSAR_ONE=1)." >&2
    return 1
  fi
  if [[ ! -f "${SAMSAR_MONOREPO_SYNC_SCRIPT}" ]]; then
    echo "Samsar monorepo sync script is missing: ${SAMSAR_MONOREPO_SYNC_SCRIPT}" >&2
    return 1
  fi
  require_clean_repo "${SAMSAR_MONOREPO_ROOT}" "Samsar monorepo"
  if ! git -C "${SAMSAR_MONOREPO_ROOT}" ls-files --error-unmatch -- \
    "apps/setup-wizard/package.json" "apps/setup-wizard/package-lock.json" >/dev/null 2>&1; then
    echo "Samsar monorepo setup-wizard package.json and package-lock.json must both be tracked." >&2
    return 1
  fi

  current_branch="$(git -C "${SAMSAR_MONOREPO_ROOT}" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  if [[ "${current_branch}" != "${SAMSAR_MONOREPO_MAIN_BRANCH}" ]]; then
    echo "Samsar monorepo must be on ${SAMSAR_MONOREPO_MAIN_BRANCH}; current branch is ${current_branch:-detached}." >&2
    return 1
  fi

  if [[ "${GIT_PUSH_SAMSAR_MONOREPO}" == "1" ]]; then
    preflight_explicit_ref_push "${SAMSAR_MONOREPO_ROOT}" "${SAMSAR_MONOREPO_GIT_REMOTE}" \
      "${SAMSAR_MONOREPO_MAIN_BRANCH}" "Samsar monorepo" 1 0
  fi
}

preflight_sdk_release
commit_and_push_sdk_main_before_deploy
prepare_samsar_gallery_target
preflight_samsar_one_targets
preflight_samsar_monorepo

if [[ "${RESUME_PUBLISHED_VERSION}" == "1" && "${BUMP_LEVEL}" != "none" ]]; then
  echo "RESUME_PUBLISHED_VERSION/ALLOW_PUBLISHED_VERSION cannot be combined with a version bump." >&2
  exit 1
fi

if [[ "$BUMP_LEVEL" != "none" ]]; then
  npm version "$BUMP_LEVEL" --no-git-tag-version
fi

PACKAGE_VERSION="$(node -p "require('./package.json').version")"

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

already_published="false"
if version_is_published; then
  if [[ "${RESUME_PUBLISHED_VERSION}" == "1" ]]; then
    already_published="true"
    echo "Resuming propagation for existing ${PACKAGE_NAME}@${PACKAGE_VERSION}."
  elif [[ "$BUMP_LEVEL" == "none" && "$AUTO_BUMP_ON_PUBLISHED" == "1" ]]; then
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
    echo "Explicit AUTO_BUMP_ON_PUBLISHED selected ${PACKAGE_VERSION}."
  else
    echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is already published on ${REGISTRY}." >&2
    echo "Use RESUME_PUBLISHED_VERSION=1 (or ALLOW_PUBLISHED_VERSION=1) to resume Git and consumer propagation without republishing." >&2
    echo "To publish a new release, re-run with an explicit patch/minor/major bump." >&2
    exit 1
  fi
elif [[ "${RESUME_PUBLISHED_VERSION}" == "1" ]]; then
  echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is not published on ${REGISTRY}; resume mode is not applicable." >&2
  echo "Unset RESUME_PUBLISHED_VERSION/ALLOW_PUBLISHED_VERSION to publish or retry this exact version." >&2
  exit 1
fi

npm ci
npm run build

commit_and_push_sdk_release() {
  local status_output

  git -C "${ROOT_DIR}" add -- "package.json" "package-lock.json"
  if git -C "${ROOT_DIR}" diff --cached --quiet; then
    echo "No SDK release metadata changes to commit."
  else
    git -C "${ROOT_DIR}" commit -m "chore(release): publish ${PACKAGE_NAME}@${PACKAGE_VERSION}"
  fi

  status_output="$(git -C "${ROOT_DIR}" status --porcelain --untracked-files=all)"
  if [[ -n "${status_output}" ]]; then
    echo "samsar-js has uncommitted files after build; refusing to push a release that does not match the package artifact." >&2
    printf '%s\n' "${status_output}" >&2
    return 1
  fi

  push_current_branch_explicit "${ROOT_DIR}" "${SAMSAR_JS_GIT_REMOTE}" \
    "${RELEASE_BRANCH}" "samsar-js SDK"
  RELEASE_HEAD="$(git -C "${ROOT_DIR}" rev-parse HEAD)"
}

commit_and_push_sdk_release

publish_message="Published ${PACKAGE_NAME}@${PACKAGE_VERSION} to ${REGISTRY}"
if version_is_published; then
  already_published="true"
  publish_message="Using existing ${PACKAGE_NAME}@${PACKAGE_VERSION} from ${REGISTRY}"
fi

if [[ "${already_published}" != "true" ]]; then
  TOKEN="${NPM_TOKEN:-${NODE_AUTH_TOKEN:-}}"
  ACTIVE_NPM_USERCONFIG=""

  npm_public_auth() {
    env -u NPM_TOKEN -u NODE_AUTH_TOKEN npm "$@"
  }

  npm_auth() {
    if [[ -n "${ACTIVE_NPM_USERCONFIG}" ]]; then
      env -u NPM_TOKEN -u NODE_AUTH_TOKEN NPM_CONFIG_USERCONFIG="${ACTIVE_NPM_USERCONFIG}" npm "$@"
    else
      npm_public_auth "$@"
    fi
  }

  ensure_npm_browser_login() {
    if npm_public_auth whoami --registry="${REGISTRY}" >/dev/null 2>&1; then
      return
    fi

    echo "Starting npm web login for ${REGISTRY}. This login is saved to your normal npm config."
    npm_public_auth login --registry="${REGISTRY}" --auth-type=web
  }

  publish_package() {
    if [[ -n "${NPM_OTP:-}" ]]; then
      npm_auth publish --access public --registry="${REGISTRY}" --otp "${NPM_OTP}"
    else
      npm_auth publish --access public --registry="${REGISTRY}"
    fi
  }

  explain_missing_publish_otp() {
    cat >&2 <<EOF
npm publish requires a one-time password for ${PACKAGE_NAME}@${PACKAGE_VERSION}.
Re-run deploy with a fresh npm OTP, for example:

  NPM_OTP=123456 $0 ${BUMP_LEVEL}

The release commit was already pushed, but the package was not published and
dependent projects were not updated. Re-run without a version bump after npm
authentication is fixed; the exact release version will be retried.
EOF
  }

  if [[ "${TOKEN}" == "npm_REPLACE_WITH_YOUR_TOKEN" || "${TOKEN}" == "npm_YOUR_TOKEN_HERE" ]]; then
    echo "Replace the placeholder NPM_TOKEN in .env before publishing ${PACKAGE_NAME}@${PACKAGE_VERSION}." >&2
    exit 1
  fi

  if [[ -n "${TOKEN}" ]]; then
    if [[ "${PREFER_NPM_WEB_LOGIN:-0}" == "1" ]] && npm_public_auth whoami --registry="${REGISTRY}" >/dev/null 2>&1; then
      echo "Using existing npm web login for ${REGISTRY}; ignoring NPM_TOKEN/NODE_AUTH_TOKEN from environment."
    else
      TMP_NPMRC="$(mktemp)"
      TMP_FILES+=("$TMP_NPMRC")

      printf "registry=%s\nalways-auth=true\n" "$REGISTRY" > "$TMP_NPMRC"
      printf "%s:_authToken=%s\n" "$REGISTRY_AUTH_PREFIX" "$TOKEN" >> "$TMP_NPMRC"

      if env -u NPM_TOKEN -u NODE_AUTH_TOKEN NPM_CONFIG_USERCONFIG="$TMP_NPMRC" npm whoami --registry="${REGISTRY}" >/dev/null 2>&1; then
        ACTIVE_NPM_USERCONFIG="$TMP_NPMRC"
      else
        unset NPM_TOKEN NODE_AUTH_TOKEN
        echo "Configured NPM_TOKEN/NODE_AUTH_TOKEN was rejected by ${REGISTRY}; ignoring it and falling back to your npm web login."
      fi
    fi
  fi

  if [[ -z "${ACTIVE_NPM_USERCONFIG}" ]]; then
    ensure_npm_browser_login
  fi

  if ! npm_auth whoami --registry="${REGISTRY}" >/dev/null 2>&1; then
    echo "npm authentication failed for ${REGISTRY}; cannot publish ${PACKAGE_NAME}@${PACKAGE_VERSION}." >&2
    exit 1
  fi

  publish_log="$(mktemp)"
  TMP_FILES+=("$publish_log")

  if ! publish_package 2>&1 | tee "$publish_log"; then
    if version_is_published; then
      echo "${PACKAGE_NAME}@${PACKAGE_VERSION} was published, but npm returned an auth-flow error while finishing."
    elif grep -Eq 'EOTP|one-time password|one time password' "$publish_log"; then
      explain_missing_publish_otp
      exit 1
    elif grep -Eq 'Authenticate your account|/-/v1/done|ENEEDAUTH|code E404' "$publish_log"; then
      echo "npm publish authentication did not complete cleanly; refreshing browser login and retrying once..."
      ACTIVE_NPM_USERCONFIG=""
      ensure_npm_browser_login
      if ! npm_auth whoami --registry="${REGISTRY}" >/dev/null 2>&1; then
        echo "npm authentication failed after browser login; cannot publish ${PACKAGE_NAME}@${PACKAGE_VERSION}." >&2
        exit 1
      fi
      publish_package
    else
      exit 1
    fi
  fi
else
  if [[ "${RESUME_PUBLISHED_VERSION}" != "1" ]]; then
    echo "Refusing to continue without publishing a new version." >&2
    exit 1
  fi
fi

wait_for_registry_version "${PACKAGE_VERSION}"

DEPENDENCY_SYNC_NPM_CACHE="$(mktemp -d "${TMPDIR:-/tmp}/samsar-js-npm-cache.XXXXXX")"
TMP_DIRS+=("$DEPENDENCY_SYNC_NPM_CACHE")

SAMSAR_ONE_SYNCED_FILES=()
SAMSAR_ONE_REPO_ROOTS=()
SAMSAR_ONE_DEP_SPEC=""
SAMSAR_ONE_MANIFEST_FILES=()

update_samsar_one_manifests() {
  local dependency_spec="${SAMSAR_ONE_SAMSAR_JS_SPEC:-${SAMSAR_PROCESSOR_SAMSAR_JS_SPEC:-${PACKAGE_VERSION}}}"
  local include_non_registry_specs="${SAMSAR_ONE_INCLUDE_NON_REGISTRY_SPECS:-0}"
  local create_lockfiles="${SAMSAR_ONE_CREATE_LOCKFILES:-0}"
  local -a candidate_roots=()
  local -a extra_files=()
  local root file trimmed_file

  SAMSAR_ONE_DEP_SPEC="${dependency_spec}"

  if [[ -n "${SAMSAR_ONE_ROOTS:-}" ]]; then
    IFS=',' read -r -a candidate_roots <<< "${SAMSAR_ONE_ROOTS}"
  elif [[ -n "${SAMSAR_ONE_ROOT:-}" ]]; then
    candidate_roots+=("${SAMSAR_ONE_ROOT}")
  elif [[ -n "${SAMSAR_PROCESSOR_ROOT:-}" ]]; then
    candidate_roots+=("${SAMSAR_PROCESSOR_ROOT}")
  else
    candidate_roots+=(
      "${ROOT_DIR}/../samsar_processor"
      "${ROOT_DIR}/../samsar_ai_video_layer_generator"
      "${ROOT_DIR}/../samsar_audio_generator"
      "${ROOT_DIR}/../samsar_generator"
      "${ROOT_DIR}/../samsar_express_video_listener"
      "${ROOT_DIR}/../samsar_assistant_query_processor"
    )
  fi

  if [[ "${SYNC_SAMSAR_GALLERY}" == "1" ]]; then
    extra_files+=("${SAMSAR_GALLERY_ROOT}/package.json")
  fi

  if [[ -n "${SAMSAR_ONE_PACKAGE_FILES:-}" ]]; then
    local -a samsar_one_extra_files=()
    IFS=',' read -r -a samsar_one_extra_files <<< "${SAMSAR_ONE_PACKAGE_FILES}"
    for file in "${samsar_one_extra_files[@]}"; do
      extra_files+=("${file}")
    done
  fi

  if [[ -n "${SAMSAR_PROCESSOR_PACKAGE_FILES:-}" ]]; then
    local -a processor_extra_files=()
    IFS=',' read -r -a processor_extra_files <<< "${SAMSAR_PROCESSOR_PACKAGE_FILES}"
    for file in "${processor_extra_files[@]}"; do
      extra_files+=("${file}")
    done
  fi

  local discovered_list_file manifest_list_file
  discovered_list_file="$(mktemp)"
  manifest_list_file="$(mktemp)"
  TMP_FILES+=("$discovered_list_file" "$manifest_list_file")

  if [[ "${SAMSAR_ONE_DISCOVER_PACKAGE_FILES:-1}" == "1" ]]; then
    node - "${PACKAGE_NAME}" "${ROOT_DIR}" "${include_non_registry_specs}" "${candidate_roots[@]}" <<'NODE' > "$discovered_list_file"
const fs = require('fs');
const path = require('path');

const [,, packageName, sdkRoot, includeNonRegistrySpecs, ...roots] = process.argv;
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const skipDirs = new Set([
  '.git',
  '.next',
  '.npm-cache',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'outputs',
]);
const sdkRootPath = path.resolve(sdkRoot);
const includeNonRegistry = includeNonRegistrySpecs === '1';
const found = new Set();

function hasDependency(packageJson) {
  for (const section of sections) {
    if (
      packageJson[section] &&
      Object.prototype.hasOwnProperty.call(packageJson[section], packageName)
    ) {
      const spec = packageJson[section][packageName];
      if (includeNonRegistry || isRegistrySpec(spec)) {
        return true;
      }
    }
  }
  return false;
}

function isRegistrySpec(spec) {
  return (
    typeof spec === 'string' &&
    spec.length > 0 &&
    !/^(?:file:|https?:|git(?:\+|:)|github:|link:|workspace:)/.test(spec)
  );
}

function walk(currentDir) {
  let entries;
  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) {
        continue;
      }
      walk(path.join(currentDir, entry.name));
      continue;
    }

    if (!entry.isFile() || entry.name !== 'package.json') {
      continue;
    }

    const manifestPath = path.join(currentDir, entry.name);
    if (manifestPath === path.join(sdkRootPath, 'package.json')) {
      continue;
    }

    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      continue;
    }

    if (hasDependency(packageJson)) {
      found.add(manifestPath);
    }
  }
}

for (const root of roots) {
  const resolvedRoot = path.resolve(root);
  if (fs.existsSync(resolvedRoot)) {
    walk(resolvedRoot);
  }
}

for (const manifestPath of [...found].sort()) {
  console.log(manifestPath);
}
NODE
  fi

  for file in "${extra_files[@]-}"; do
    trimmed_file="${file#"${file%%[![:space:]]*}"}"
    trimmed_file="${trimmed_file%"${trimmed_file##*[![:space:]]}"}"
    if [[ -n "${trimmed_file}" ]]; then
      printf '%s\n' "${trimmed_file}" >> "$discovered_list_file"
    fi
  done

  if [[ ! -s "${discovered_list_file}" ]]; then
    echo "No Samsar One package.json files with ${PACKAGE_NAME} found; skipping dependency sync."
    return
  fi

  node - "${PACKAGE_NAME}" "${dependency_spec}" "${discovered_list_file}" <<'NODE' > "$manifest_list_file"
const fs = require('fs');
const path = require('path');

const [,, packageName, dependencySpec, listPath] = process.argv;
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const manifestPaths = fs
  .readFileSync(listPath, 'utf8')
  .split(/\r?\n/)
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => path.resolve(entry));
const uniqueManifestPaths = [...new Set(manifestPaths)];
let updatedCount = 0;

for (const manifestPath of uniqueManifestPaths) {
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    console.error(`Skipping ${manifestPath}: ${error.message}`);
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
    console.error(`No ${packageName} dependency in ${manifestPath}; leaving unchanged.`);
    continue;
  }

  if (changed) {
    fs.writeFileSync(manifestPath, `${JSON.stringify(packageJson, null, 2)}\n`);
    updatedCount += 1;
    console.error(`Updated ${manifestPath} -> ${packageName}@${dependencySpec}`);
  } else {
    console.error(`Already up to date: ${manifestPath}`);
  }

  console.log(manifestPath);
}

console.error(`Samsar One dependency sync manifest update complete (${updatedCount} updated file(s)).`);
NODE

  if [[ ! -s "${manifest_list_file}" ]]; then
    echo "No Samsar One package.json files with ${PACKAGE_NAME} found after filtering; skipping lockfile sync."
    return
  fi

  while IFS= read -r manifest_path; do
    if [[ -n "${manifest_path}" ]]; then
      SAMSAR_ONE_MANIFEST_FILES+=("${manifest_path}")
    fi
  done < "$manifest_list_file"

  local manifest_path project_dir lock_file repo_root
  local install_attempt install_max_attempts install_retry_delay
  local -a npm_install_args
  install_max_attempts="${SAMSAR_ONE_INSTALL_RETRIES:-${SAMSAR_PROCESSOR_INSTALL_RETRIES:-8}}"
  install_retry_delay="${SAMSAR_ONE_INSTALL_RETRY_DELAY_SECONDS:-${SAMSAR_PROCESSOR_INSTALL_RETRY_DELAY_SECONDS:-5}}"

  for manifest_path in "${SAMSAR_ONE_MANIFEST_FILES[@]}"; do
    project_dir="$(dirname "${manifest_path}")"
    SAMSAR_ONE_SYNCED_FILES+=("${manifest_path}")

    lock_file="${project_dir}/package-lock.json"
    if [[ -f "${lock_file}" || "${create_lockfiles}" == "1" ]]; then
      npm_install_args=(
        --package-lock-only
        --ignore-scripts
        --cache "${DEPENDENCY_SYNC_NPM_CACHE}"
        --workspaces=false
        --engine-strict=false
        --no-audit
        --fund=false
        --loglevel=error
        --update-notifier=false
        --registry "${REGISTRY}"
      )
      if is_exact_version_spec "${dependency_spec}"; then
        npm_install_args+=(--save-exact)
      fi

      install_attempt=1
      while true; do
        if (
          cd "${project_dir}" &&
          npm install "${npm_install_args[@]}" "${PACKAGE_NAME}@${dependency_spec}"
        ); then
          break
        fi

        if [[ "${install_attempt}" -ge "${install_max_attempts}" ]]; then
          echo "Failed to update ${PACKAGE_NAME}@${dependency_spec} lockfile in ${project_dir} after ${install_max_attempts} attempts." >&2
          return 1
        fi

        echo "Retrying Samsar One lockfile update for ${project_dir} in ${install_retry_delay}s (attempt ${install_attempt}/${install_max_attempts})..."
        sleep "${install_retry_delay}"
        install_attempt=$((install_attempt + 1))
      done

      if [[ -f "${lock_file}" ]]; then
        if git -C "${project_dir}" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
          if git -C "${project_dir}" ls-files --error-unmatch "package-lock.json" >/dev/null 2>&1 ||
            ! git -C "${project_dir}" check-ignore -q "package-lock.json"; then
            SAMSAR_ONE_SYNCED_FILES+=("${lock_file}")
          else
            echo "Updated ignored lockfile for ${manifest_path}; not staging package-lock.json."
          fi
        else
          SAMSAR_ONE_SYNCED_FILES+=("${lock_file}")
        fi
      fi

      echo "Updated Samsar One dependency lockfile for ${manifest_path}"
    else
      echo "No package-lock.json found for ${manifest_path}; skipping lockfile update."
    fi

    repo_root="$(git -C "${project_dir}" rev-parse --show-toplevel 2>/dev/null || true)"
    if [[ -n "${repo_root}" ]] && ! contains_element "${repo_root}" "${SAMSAR_ONE_REPO_ROOTS[@]-}"; then
      SAMSAR_ONE_REPO_ROOTS+=("${repo_root}")
    fi
  done
}

validate_samsar_one_dependency_sync() {
  if [[ "${#SAMSAR_ONE_MANIFEST_FILES[@]}" -eq 0 ]]; then
    return
  fi

  node - "${PACKAGE_NAME}" "${SAMSAR_ONE_DEP_SPEC}" "${SAMSAR_ONE_REQUIRE_LOCKFILES:-0}" "${SAMSAR_ONE_MANIFEST_FILES[@]}" <<'NODE'
const fs = require('fs');
const path = require('path');

const [,, packageName, expectedSpec, requireLockfiles, ...manifestPaths] = process.argv;
const uniqueManifestPaths = [...new Set(manifestPaths)];
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const mismatches = [];
const versionMatch = expectedSpec.match(/[0-9]+\.[0-9]+\.[0-9]+(?:[.-][0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?/);
const expectedVersion = versionMatch ? versionMatch[0] : null;

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
    mismatches.push(`${manifestPath}: missing ${packageName} dependency`);
  } else if (declaredSpec !== expectedSpec) {
    mismatches.push(
      `${manifestPath}: package.json has ${packageName}@${declaredSpec} (expected ${expectedSpec})`
    );
  }

  const lockPath = path.join(path.dirname(manifestPath), 'package-lock.json');
  if (!fs.existsSync(lockPath)) {
    if (requireLockfiles === '1') {
      mismatches.push(`${lockPath}: missing package-lock.json`);
    }
    continue;
  }

  let lockJson;
  try {
    lockJson = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch (error) {
    mismatches.push(`${lockPath}: unreadable package-lock.json (${error.message})`);
    continue;
  }

  const lockRootSpec =
    lockJson?.packages?.['']?.dependencies?.[packageName] ??
    lockJson?.packages?.['']?.devDependencies?.[packageName] ??
    lockJson?.packages?.['']?.optionalDependencies?.[packageName] ??
    lockJson?.packages?.['']?.peerDependencies?.[packageName] ??
    null;

  if (lockRootSpec !== expectedSpec) {
    mismatches.push(
      `${lockPath}: root lockfile has ${packageName}@${lockRootSpec ?? 'missing'} (expected ${expectedSpec})`
    );
  }

  const lockVersion =
    lockJson?.packages?.[`node_modules/${packageName}`]?.version ??
    lockJson?.dependencies?.[packageName]?.version ??
    null;

  if (expectedVersion && typeof lockVersion === 'string' && lockVersion.length > 0) {
    if (lockVersion !== expectedVersion) {
      mismatches.push(
        `${lockPath}: lockfile has ${packageName}@${lockVersion} (expected ${expectedVersion})`
      );
    }
  } else if (!lockVersion) {
    mismatches.push(`${lockPath}: missing node_modules/${packageName} entry`);
  }
}

if (mismatches.length > 0) {
  console.error('Samsar One dependency sync validation failed:');
  for (const issue of mismatches) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Samsar One dependency sync validation passed for ${uniqueManifestPaths.length} manifest(s).`);
NODE
}

commit_and_push_repo() {
  local repo_dir="$1"
  local commit_message="$2"
  local remote_name="$3"
  shift 3

  if ! git -C "${repo_dir}" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Skipping git push for ${repo_dir}: not a git repository."
    return
  fi

  local repo_root current_branch
  repo_root="$(git -C "${repo_dir}" rev-parse --show-toplevel)"
  current_branch="$(git -C "${repo_root}" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  if [[ -z "${current_branch}" ]]; then
    echo "Refusing to commit in ${repo_root}: detached HEAD." >&2
    return 1
  fi

  if [[ "$#" -eq 0 ]]; then
    echo "Refusing to commit in ${repo_root}: no explicit file list was provided." >&2
    return 1
  fi

  git -C "${repo_root}" add -- "$@"

  if git -C "${repo_root}" diff --cached --quiet -- "$@"; then
    echo "No changes to commit in ${repo_root}."
  else
    # Commit only dependency files managed by this deploy. A canonical
    # consumer may have unrelated staged or unstaged source work in progress.
    git -C "${repo_root}" commit --only -m "${commit_message}" -- "$@"
  fi

  push_current_branch_explicit "${repo_root}" "${remote_name}" \
    "${current_branch}" "consumer ${repo_root}"
  echo "Pushed ${repo_root} to GitHub."
}

propagate_samsar_monorepo() {
  local setup_dir workspace_root commit_message current_branch
  local -a sync_args

  if [[ "${SYNC_SAMSAR_MONOREPO}" != "1" ]]; then
    return
  fi

  setup_dir="${SAMSAR_MONOREPO_ROOT}/apps/setup-wizard"
  workspace_root="$(cd "${ROOT_DIR}/.." && pwd)"
  commit_message="${SAMSAR_MONOREPO_COMMIT_MESSAGE:-chore: propagate ${PACKAGE_NAME}@${PACKAGE_VERSION} to Samsar monorepo}"

  (
    cd "${setup_dir}"
    npm install \
      --package-lock-only \
      --ignore-scripts \
      --cache "${DEPENDENCY_SYNC_NPM_CACHE}" \
      --workspaces=false \
      --engine-strict=false \
      --no-audit \
      --fund=false \
      --loglevel=error \
      --update-notifier=false \
      --registry "${REGISTRY}" \
      --save-exact \
      "${PACKAGE_NAME}@${PACKAGE_VERSION}"
  )

  node - "${setup_dir}/package.json" "${setup_dir}/package-lock.json" \
    "${PACKAGE_NAME}" "${PACKAGE_VERSION}" <<'NODE'
const fs = require('fs');
const [,, packagePath, lockPath, packageName, expectedVersion] = process.argv;
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const lockJson = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const declared = packageJson.dependencies?.[packageName] ??
  packageJson.devDependencies?.[packageName] ??
  packageJson.optionalDependencies?.[packageName];
const lockedRoot = lockJson.packages?.['']?.dependencies?.[packageName] ??
  lockJson.packages?.['']?.devDependencies?.[packageName] ??
  lockJson.packages?.['']?.optionalDependencies?.[packageName];
const lockedVersion = lockJson.packages?.[`node_modules/${packageName}`]?.version ??
  lockJson.dependencies?.[packageName]?.version;

if (declared !== expectedVersion || lockedRoot !== expectedVersion || lockedVersion !== expectedVersion) {
  console.error(
    `Monorepo setup-wizard dependency mismatch: package=${declared}, lockRoot=${lockedRoot}, lock=${lockedVersion}, expected=${expectedVersion}`
  );
  process.exit(1);
}
NODE

  sync_args=(
    --source "${workspace_root}"
    --target "${SAMSAR_MONOREPO_ROOT}"
    --remote "${SAMSAR_MONOREPO_GIT_REMOTE}"
    --main-branch "${SAMSAR_MONOREPO_MAIN_BRANCH}"
    --message "${commit_message}"
  )

  bash "${SAMSAR_MONOREPO_SYNC_SCRIPT}" "${sync_args[@]}"

  if [[ "${GIT_PUSH_SAMSAR_MONOREPO}" != "1" ]]; then
    echo "Skipping Samsar monorepo git push."
    return
  fi

  current_branch="$(git -C "${SAMSAR_MONOREPO_ROOT}" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
  if [[ "${current_branch}" != "${SAMSAR_MONOREPO_MAIN_BRANCH}" ]]; then
    echo "Samsar monorepo left ${SAMSAR_MONOREPO_MAIN_BRANCH} during sync; refusing to commit." >&2
    return 1
  fi

  git -C "${SAMSAR_MONOREPO_ROOT}" add -A
  if git -C "${SAMSAR_MONOREPO_ROOT}" diff --cached --quiet; then
    echo "No Samsar monorepo changes to commit."
  else
    git -C "${SAMSAR_MONOREPO_ROOT}" commit -m "${commit_message}"
  fi
  push_current_branch_explicit "${SAMSAR_MONOREPO_ROOT}" \
    "${SAMSAR_MONOREPO_GIT_REMOTE}" "${SAMSAR_MONOREPO_MAIN_BRANCH}" \
    "Samsar monorepo"
  echo "Pushed Samsar monorepo ${SAMSAR_MONOREPO_MAIN_BRANCH} to GitHub."
}

update_samsar_one_manifests
validate_samsar_one_dependency_sync

if [[ "${#SAMSAR_ONE_REPO_ROOTS[@]}" -gt 0 ]]; then
  for repo_root in "${SAMSAR_ONE_REPO_ROOTS[@]-}"; do
    repo_push_enabled="${GIT_PUSH_SAMSAR_ONE}"
    repo_remote="${SAMSAR_ONE_GIT_REMOTE}"
    if [[ -n "${SAMSAR_GALLERY_REPO_ROOT}" && "${repo_root}" == "${SAMSAR_GALLERY_REPO_ROOT}" ]]; then
      repo_push_enabled="${GIT_PUSH_SAMSAR_GALLERY}"
      repo_remote="${SAMSAR_GALLERY_GIT_REMOTE}"
    fi

    repo_files=()
    for synced_file in "${SAMSAR_ONE_SYNCED_FILES[@]-}"; do
      if [[ "${synced_file}" == "${repo_root}/"* ]]; then
        repo_files+=("${synced_file#"${repo_root}/"}")
      fi
    done

    if [[ "${#repo_files[@]}" -gt 0 ]]; then
      if [[ "${repo_push_enabled}" == "1" ]]; then
        commit_and_push_repo "${repo_root}" \
          "chore: bump ${PACKAGE_NAME} to ${SAMSAR_ONE_DEP_SPEC}" \
          "${repo_remote}" \
          "${repo_files[@]}"
      else
        echo "Skipping dependency git push for ${repo_root}."
      fi
    fi
  done
else
  echo "No dependent repositories were updated."
fi

propagate_samsar_monorepo

echo "${publish_message}"
