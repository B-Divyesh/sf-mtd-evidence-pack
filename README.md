# MTD Evidence Pack

Prepare a quarterly MTD evidence pack from local bookkeeping records.

MTD Evidence Pack is for UK sole traders who keep their own books. Import a categorised CSV and attach source files. Check one quarter before exporting an encrypted handoff for your accountant or compatible filing software.

Use compatible filing software or an accountant when you are ready to submit.

## Try the sample

Open `/?demo=1` locally or visit <https://mtd-evidence-pack.sociobot.in/?demo=1>. The sample contains one realistic quarter. Demo changes are kept in memory and disappear on reload. `/demo` also opens the sample.

## What the export contains

The password-protected ZIP contains:

- `records/transactions.csv`
- `summary/quarterly-handoff.pdf`
- attached source files
- `manifest.json` with SHA-256 hashes and checklist status
- `README.txt`

Send the ZIP password through a different channel. The password is never saved.

## Privacy and offline use

See the in-product [Privacy](/privacy) page for browser-data controls and licence checks.

The app shell, sample, and encrypted export work after the first visit. Install it from a supporting browser for a standalone window.

## Supported edition

The core import, checklist maintenance, attachments, and encrypted export are free. Existing licence holders can paste a token to restore saved cover notes. New licences are not currently available. Licence verification uses the Sociobot billing API.

## Develop

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>.

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

Deploy the contents of `dist/` to Azure Static Web Apps. `public/staticwebapp.config.json` supplies the explicit product routes, designed 404 response, security headers, and asset policy.

## Data format

CSV headers are `date,description,amount,category,reference`. Dates use `YYYY-MM-DD`. Income is positive and expenses are negative. The `reference` column is optional.

The importer rejects invalid calendar dates, missing amounts, and records outside the selected period. Valid imports add records without replacing earlier records.

## Licence

MIT. See [LICENSE](LICENSE).
