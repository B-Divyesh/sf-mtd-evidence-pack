const VERSION = "mtd-evidence-pack-v1.0.1";
const SHELL = ["/", "/demo", "/workspace", "/privacy", "/terms", "/offline.html", "/favicon.svg", "/manifest.webmanifest", "/assets/hero-ledger.webp", "/assets/hero-ledger-720.webp"];
self.addEventListener("install", event => event.waitUntil((async () => {
  const cache = await caches.open(VERSION);
  await cache.addAll(SHELL);
  const html = await (await cache.match("/")).text();
  const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/g)].map(match => match[1]);
  await cache.addAll(builtAssets);
  await self.skipWaiting();
})()));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(response => { const copy = response.clone(); caches.open(VERSION).then(cache => cache.put(event.request, copy)); return response; }).catch(async () => (await caches.match(event.request)) || (await caches.match("/")) || caches.match("/offline.html")));
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(url.pathname, { ignoreSearch: true });
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) caches.open(VERSION).then(cache => cache.put(url.pathname, response.clone()));
    return response;
  })());
});
