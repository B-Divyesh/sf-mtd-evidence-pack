# Handoff — MTD Evidence Pack

> **Independent release decision (28 August 2026): FAIL.** Candidate
> `53f86b0cf1704036dce0ec4147898a49424249ad` at
> <https://mtd-evidence-pack.sociobot.in> must not release. The independent
> verifier found silent invalid CSV acceptance, a mobile Lighthouse performance
> score below the required threshold, and unlisted public claims. See
> `.factory/verification.md` for exact reproduction and full evidence. This
> decision supersedes the historical builder results below.

Date: 28 August 2026

Work order: `mtd-evidence-pack-build-1`

Version: 1.0.0

## What shipped

- A Vite and TypeScript local-first PWA at `/workspace`.
- A one-click, memory-only sample at `/demo` with 12 records, three source indexes, and one open check.
- Categorised CSV import with row-level validation and a downloadable template.
- Local IndexedDB storage for the period, records, checklist, cover note, and source files.
- A versioned UK sole-trader evidence checklist with clear readiness gaps.
- Password-protected ZIP export containing CSV, a one-page PDF summary, source files, a manifest, and SHA-256 hashes.
- Formula-safe CSV output, an eight-character minimum ZIP password, and no stored export password.
- A £24 one-time supported edition through Sociobot checkout and licence verification. It adds custom checks and saved cover notes. The core export remains free.
- Install metadata, icons, offline caching, offline fallback, update notice, privacy, terms, 404, sitemap, robots, security headers, and route metadata.
- An original surreal paper-ledger hero and matching social card. Source, prompt, and provenance are in `assets/src/` and `.factory/design.md`.

## Run and verify

```sh
npm install
npm test
npm run build
```

The production command is exactly `npm run build`. It creates `dist/index.html`.

Final local results:

- `npm test`: 5 unit tests and 10 Playwright tests passed.
- All seven listed claims passed through the commands in `.factory/claims.json`.
- Playwright axe scan: no serious or critical issues on home, demo, privacy, terms, or 404.
- Mobile check: no horizontal overflow at 390 × 844; keyboard focus path passed.
- Offline check: `/demo` reloaded with its records after the browser went offline.
- Console check: no console or page errors across all routes.
- Factory `verify-url.sh`: HTTP 200, title present, `lang=en-GB`, one `h1`, one `main`, no missing alt text, and no unlabelled buttons. Report: `.factory/verification/verify.json`.
- `npm audit --omit=dev`: zero vulnerabilities.

Lighthouse 12.8.2 mobile simulation on the production build:

- Performance: 100
- Accessibility: 100
- Best practices: 100
- SEO: 100
- LCP: 1.2 s
- CLS: 0
- Total blocking time: 0 ms

Build budgets:

- Initial JavaScript: 12.82 KB gzip
- Initial CSS: 4.99 KB gzip
- Lazy ZIP module: 54.45 KB gzip
- Mobile hero: 13 KB; desktop hero: 36 KB

## Privacy and data boundaries

Real work uses only local IndexedDB. Demo work uses memory and never opens that database. The app has no analytics, remote fonts, bank calls, or HMRC calls. Licence verification sends only the pasted token to `api.sociobot.in`. No HMRC credentials are requested or stored.

## Known gaps and next steps

- This intentionally does not submit to HMRC, calculate tax, connect to banks, or certify records.
- Checklist v1.0 is a 2026–27 working evidence checklist. The user must confirm it with their accountant or filing software.
- The factory must register the `mtd-evidence-pack` product and £24 price before checkout can complete in production.
- Lighthouse does not report lab INP without interaction; total blocking time was 0 ms and browser interaction tests passed.
- Some older ZIP tools do not open AES-encrypted archives. Current 7-Zip, WinZip, and other AES-capable tools do.

No deployment, DNS, billing registration, or infrastructure was changed from this repository.
