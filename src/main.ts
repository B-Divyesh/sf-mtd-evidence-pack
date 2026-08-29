import "./styles.css";
import { captureReturnedLicense } from "./license";

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

captureReturnedLicense();
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
  history.pushState({}, "", link.pathname + link.search);
  (window as typeof window & { __mtdClientNavigation?: boolean }).__mtdClientNavigation = true;
  root.removeEventListener("click", loadApplicationForNavigation);
  void import("./app");
};
root.addEventListener("click", loadApplicationForNavigation);
if (location.pathname !== "/") void import("./app");
