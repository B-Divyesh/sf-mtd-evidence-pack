#!/usr/bin/env bash
set -euo pipefail

# This verifies the lower edge of the supported range in a disposable clone.
# Keeping the build separate means the normal developer runtime is untouched.
readonly runtime_package="node@20.19.0"
readonly expected_engine="^20.19.0 || >=22.12.0"
readonly repo_root="$(git rev-parse --show-toplevel)"
readonly npm_cli="$(command -v npm)"
temp_root="$(mktemp -d "${TMPDIR:-/tmp}/mtd-node-runtime.XXXXXX")"

cleanup() {
  rm -rf "$temp_root"
}
trap cleanup EXIT

git clone --quiet --no-local --depth=1 "$repo_root" "$temp_root/repo"
runtime="$(cd "$temp_root/repo" && npx --yes "$runtime_package" -p 'process.execPath')"
runtime_dir="$(dirname "$runtime")"

"$runtime" -e '
  const packageJson = require(process.argv[1]);
  const expected = process.argv[2];
  if (process.version !== "v20.19.0") throw new Error(`Expected Node v20.19.0, received ${process.version}`);
  if (packageJson.engines?.node !== expected) throw new Error(`Expected engines.node ${expected}`);
' "$temp_root/repo/package.json" "$expected_engine"

(
  cd "$temp_root/repo"
  PATH="$runtime_dir:$PATH" "$runtime" "$npm_cli" ci
  PATH="$runtime_dir:$PATH" "$runtime" "$npm_cli" run build
)

printf 'Verified clean install and production build with Node v20.19.0.\n'
