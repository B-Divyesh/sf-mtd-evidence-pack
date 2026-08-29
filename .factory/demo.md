# Demo sandbox

Open `/demo` or `https://mtd-evidence-pack.sociobot.in/demo`.

The demo starts with Rowan Field Studio’s Quarter 1 for 2026–27. It contains 12 categorised bookkeeping records, three text evidence indexes, six completed checklist items, one open item, and a cover note.

Changes live in page memory only. The demo never opens the real IndexedDB workspace. Reload the route or choose **Reset demo** to restore the sample. Choose **Start for real** to discard the sample and open the separate local workspace.

The sample, app shell, and encrypted-export code are bundled with the PWA. After the first visit, the demo reloads and exports its sample pack without a network connection.

Verifier entry point: `/demo`. All claim tests start with a fresh browser context and this sample. The demo makes no external request unless a verifier explicitly tests the licence endpoint.
