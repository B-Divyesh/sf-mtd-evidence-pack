# MTD Evidence Pack

Prepare a quarterly MTD evidence pack from local bookkeeping records.

MTD Evidence Pack is for UK sole traders who keep their own books. It imports a categorised CSV, tracks a versioned evidence checklist, attaches source files, and exports a password-protected handoff for an accountant or compatible filing software.

Use compatible filing software or an accountant when you are ready to submit.

## Try the sample

Open `/demo` locally or visit <https://mtd-evidence-pack.sociobot.in/demo>. The sample contains one realistic quarter. Demo changes are kept in memory and disappear on reload.

## What the export contains

The password-protected ZIP contains:

- `records/transactions.csv`
- `summary/quarterly-handoff.pdf`
- attached source files
- `manifest.json` with SHA-256 hashes and checklist status
- `README.txt`

Send the ZIP password through a different channel. The password is never saved.

## Privacy and offline use

See the in-product [Privacy](/privacy) page for browser-data controls and the Sociobot payment service for its own privacy information.

The app shell and sample work after the first visit. Install it from a supporting browser for a standalone window.

## Supported edition

The core import, checklist, attachments, and encrypted export are free. A £24 one-time purchase adds saved cover notes and custom checklist items. Checkout and licence verification use the Sociobot billing API; no payment provider is embedded here.

## Develop

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. No account, environment variable, or remote service is needed for the core workflow.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit and Playwright browser checks, including the tagged claims in [`.factory/claims.json`](.factory/claims.json). The exact production build command is `npm run build`. Static output lands in `dist/`, with `dist/index.html` at its root.

To run one claim:

```sh
npm run test:e2e -- --grep @claim:offline-reload
```

## Deploy

Deploy the contents of `dist/` to a static host with SPA fallbacks. `public/staticwebapp.config.json` supplies the fallback, security headers, and asset policy for Azure Static Web Apps.

## Data format

CSV headers are `date,description,amount,category,reference`. Dates use `YYYY-MM-DD`. Income is positive and expenses are negative. The `reference` column is optional.

The importer rejects invalid calendar dates and missing amounts before replacing records.

## Licence

MIT. See [LICENSE](LICENSE).
