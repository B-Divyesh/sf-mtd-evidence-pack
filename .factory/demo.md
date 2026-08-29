# Demo sandbox

Open `/?demo=1` or `https://mtd-evidence-pack.sociobot.in/?demo=1`. `/demo` is also a direct sample route.

The demo starts with Rowan Field Studio’s Quarter 1 for 2026–27. It contains 12 categorised bookkeeping records, three text evidence indexes, six completed checklist items, one open item, and a cover note.

Changes live in page memory only. The demo never opens the real IndexedDB workspace. Reload the route or choose **Reset demo** to restore the sample. Choose **Start for real** to discard the sample and open the separate local workspace.

Both demo URLs decide their mode before licence startup. They do not read, write, capture, or verify the real `sb_license:mtd-evidence-pack` keys. A `license` query value on a demo URL is ignored. **Start for real** is the first point where an existing real licence and workspace may be loaded.

The demo heading says **The sample resets when you reload or leave the demo.** The real workspace alone says **Your work saves on this device.**

The sample, app shell, and encrypted-export code are bundled with the PWA. After the first visit, the demo reloads and exports its sample pack without a network connection.

Verifier entry point: `/demo`. The isolation claim also cold-opens `/?demo=1` and `/demo` with preloaded real records and licence keys. All claim tests use a fresh browser context and the sample. Demo mode makes no external request.
