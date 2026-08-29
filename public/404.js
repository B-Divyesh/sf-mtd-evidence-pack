const state = document.querySelector("[data-network]");

function updateNetworkState() {
  if (state) state.textContent = navigator.onLine ? "Online" : "Offline";
}

updateNetworkState();
window.addEventListener("online", updateNetworkState);
window.addEventListener("offline", updateNetworkState);
