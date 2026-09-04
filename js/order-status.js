(function () {
  const STEPS = [
    { key: "RECEIVED", label: "Order Received" },
    { key: "PREPARING", label: "Preparing" },
    { key: "READY", label: "Ready / Serving" },
    { key: "COMPLETED", label: "Completed" },
  ];

  function formatINR(n) {
    return "\u20B9" + n.toLocaleString("en-IN");
  }

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  function render(order) {
    document.getElementById("order-meta").textContent =
      order.orderNumber + (order.total ? " \u00B7 " + formatINR(order.total) : "");

    const posNote = document.getElementById("pos-note");
    if (order.posSyncStatus === "PENDING") {
      posNote.textContent = "Syncing with the restaurant billing system\u2026";
    } else if (order.posSyncStatus === "SYNCED") {
      posNote.textContent = order.posBillNumber ? "Bill No. " + order.posBillNumber : "";
    } else {
      posNote.textContent = "";
    }

    const activeIndex = STEPS.findIndex(function (s) { return s.key === order.status; });
    const container = document.getElementById("status-steps");
    container.innerHTML = "";

    if (order.status === "CANCELLED") {
      container.innerHTML =
        '<p style="text-align:center; color:#c0392b; font-size:13px;">This order was cancelled. Please speak to restaurant staff.</p>';
      return;
    }

    STEPS.forEach(function (step, i) {
      const done = i <= activeIndex;
      const el = document.createElement("div");
      el.className = "status-step" + (done ? " done" : "");
      el.innerHTML = '<span class="dot">' + (done ? "\u2713" : "") + "</span><span>" + step.label + "</span>";
      container.appendChild(el);
    });
  }

  function poll() {
    if (!orderId) return;
    Api.getOrderStatus(orderId).then(render).catch(function (err) {
      console.error(err);
    });
  }

  poll();
  setInterval(poll, 8000);
})();
