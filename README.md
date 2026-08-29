# MTD Evidence Pack

Prepare a quarterly MTD evidence pack from local bookkeeping records.

MTD Evidence Pack is for UK sole traders who keep their own books. Import a categorised CSV and attach source files. Check one quarter before exporting an encrypted evidence pack for your accountant or compatible filing software.

Use compatible filing software or an accountant when you are ready to submit.

## Try the sample

Open `/?demo=1` locally or visit <https://mtd-evidence-pack.sociobot.in/?demo=1>. The sample contains 12 categorised records, three source files, and one open checklist item for one quarter. Demo changes are kept in memory and disappear on reload. `/demo` also opens the sample.

## What the export contains

The password-protected ZIP contains:

- `records/transactions.csv`
- `summary/evidence-pack-summary.pdf`
- attached source files
- `manifest.json`, with checklist status and file-change checks (SHA-256)
- `README.txt`

Send the ZIP password through a different channel. The password is never saved.

## Privacy and offline use

See the in-product [Privacy](https://mtd-evidence-pack.sociobot.in/privacy) page to learn how to delete local data and how licence checks work.

The app, sample, and encrypted export work offline after the first visit. If your browser offers Install, use it to open the tool in its own window.

## Free export and existing licences

Import records, maintain the checklist, attach source files, and export an encrypted evidence pack without a licence. Existing licence holders can paste a token to restore saved cover notes. New licences are not currently available. Licence verification sends its token to the Sociobot billing API.

## Develop

Requires Node.js 20.19+ or 22.12+.

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

## Source code licence

MIT. See [LICENSE](LICENSE).
