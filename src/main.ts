import "./styles.css";
import { captureReturnedLicense, isDemoLocation } from "./license";

type RouteState = { mtdScroll?: { x: number; y: number } } & Record<string, unknown>;

function saveCurrentScroll(): void {
  const current = history.state && typeof history.state === "object" ? history.state as RouteState : {};
  history.replaceState({ ...current, mtdScroll: { x: scrollX, y: scrollY } }, "", location.href);
}

function updateNetworkState(): void {
  const state = document.querySelector<HTMLElement>("[data-network]");
  if (state) state.textContent = navigator.onLine ? "Online" : "Offline — saved work stays available";
}

function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;
  navigator.serviceWorker.register("/sw.js").then(registration => {
    registration.addEventListener("updatefound", () => {
      if (!navigator.serviceWorker.controller) return;
      const liveRegion = document.querySelector<HTMLElement>(".live-region");
      if (liveRegion) liveRegion.textContent = "An update is installing. It will be ready on the next page.";
    });
  }).catch(() => { /* The online workspace remains available if registration fails. */ });
}

history.scrollRestoration = "manual";
saveCurrentScroll();
if (!isDemoLocation()) captureReturnedLicense();
updateNetworkState();
window.addEventListener("online", updateNetworkState);
window.addEventListener("offline", updateNetworkState);
registerServiceWorker();

// The first screen is real HTML in index.html. Keep its critical path small;
// load the full workspace only when a route needs application state.
const root = document.querySelector<HTMLDivElement>("#app")!;
const loadApplicationForNavigation = (event: MouseEvent): void => {
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-link]");
  if (!link || link.origin !== location.origin) return;
  event.preventDefault();
  saveCurrentScroll();
  history.pushState({ mtdScroll: { x: 0, y: 0 } }, "", link.pathname + link.search);
  (window as typeof window & { __mtdClientNavigation?: boolean }).__mtdClientNavigation = true;
  root.removeEventListener("click", loadApplicationForNavigation);
  void import("./app");
};
root.addEventListener("click", loadApplicationForNavigation);
if (location.pathname !== "/" || new URLSearchParams(location.search).get("demo") === "1") void import("./app");
