# Handoff — polish 1 complete

- **Work order:** `mtd-evidence-pack-polish-1`
- **Repair commit:** `c1ee48dcd9ecae3b93023d7bd7c1e028ffe947db`
- **Deployment:** Azure Static Web App `77b69730-9512-45a6-8884-95d94a4aef2d`
- **Live:** <https://mtd-evidence-pack.sociobot.in>
- **Outcome:** PASS — every F-1-1 through F-1-8 finding is repaired and
  rechecked on production.

## What changed

- Added the one-click, isolated `/?demo=1` sample route with its persistent
  banner, reset action, and start-for-real action; `/demo` remains supported.
- Rewrote every reviewed vague or decorative landing string and the overlong,
  unsupported README copy. The catalog description is now a verb-first,
  68-character sentence.
- Added the declared `checkout-unavailable` claim and tagged browser proof.
- Completed the 404 metadata and common navigation/footer contract. SPA routes
  now update title, description, canonical, Open Graph, and Twitter metadata.
- Bumped the PWA cache and manifest to v1.0.7 so installed copies receive the
  repaired shell.

## How to run and verify

```sh
npm ci
npm test
npm run build
while IFS= read -r test; do sh -c "$test"; done < <(jq -r '.[].test' .factory/claims.json)
npm run verify:url -- http://127.0.0.1:4173
```

Open `/?demo=1` for the sample, `/workspace` for real local data, `/privacy`,
`/terms`, and an unknown URL for the designed HTTP 404.

## Evidence

The clean clone at `/tmp/mtd-evidence-pack-clean.aUbxI9` passed `npm ci`, all
13 exact claim commands, 8 unit tests, 24 browser tests, build, URL verification,
and production dependency audit. Live production also passed the 24-test browser
suite, URL verification, cold route metadata checks, privacy/offline claims, and
the static 404 check. Screenshots and the finding-by-finding mapping are in
`.factory/polish-1.md` and `.factory/polish-evidence-1/`.

## Known gaps

None. The standalone Axe command-line runner cannot find a system Chrome in
this container; the repository’s Playwright Axe integration passed on every
route, including the 404 and mobile views.
