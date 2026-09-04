// Set this to your deployed backend URL once you've deployed the Worker
// (see backend/README.md). Left blank, checkout runs in mock mode: orders
// "succeed" locally so you can test the full flow before any backend or
// POS is wired up.
const API_BASE_URL = ""; // e.g. "https://soule-menu-backend.yourname.workers.dev"

const Api = (function () {
  function placeOrder(payload) {
    if (!API_BASE_URL) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve({
            orderId: "mock-" + Date.now(),
            orderNumber: "#" + Math.floor(1000 + Math.random() * 9000),
            status: "RECEIVED",
            total: payload.total,
            posSyncStatus: "PENDING",
          });
        }, 400);
      });
    }

    return fetch(API_BASE_URL + "/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (res) {
      if (!res.ok) throw new Error("Order failed: " + res.status);
      return res.json();
    });
  }

  function getOrderStatus(orderId) {
    if (!API_BASE_URL || orderId.indexOf("mock-") === 0) {
      return Promise.resolve({
        orderId: orderId,
        orderNumber: sessionStorage.getItem("lastOrderNumber") || "#0000",
        status: "PREPARING",
        posSyncStatus: "PENDING",
      });
    }
    return fetch(API_BASE_URL + "/api/orders/" + orderId + "/status").then(function (res) {
      return res.json();
    });
  }

  return { placeOrder: placeOrder, getOrderStatus: getOrderStatus };
})();
