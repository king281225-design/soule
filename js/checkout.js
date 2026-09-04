(function () {
  const TAX_RATE = 0.05;

  function formatINR(n) {
    return "\u20B9" + n.toLocaleString("en-IN");
  }

  const lines = Cart.read();
  if (lines.length === 0) {
    window.location.href = "menu.html";
    return;
  }

  const subtotal = Cart.subtotal();
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  document.getElementById("sum-subtotal").textContent = formatINR(subtotal);
  document.getElementById("sum-tax").textContent = formatINR(tax);
  document.getElementById("sum-total").textContent = formatINR(total);

  let orderType = TableSession.token ? "DINE_IN" : "TAKEAWAY";

  const dineinBtn = document.getElementById("type-dinein");
  const takeawayBtn = document.getElementById("type-takeaway");
  const tableHint = document.getElementById("table-hint");

  function refreshTypeButtons() {
    dineinBtn.classList.toggle("active", orderType === "DINE_IN");
    takeawayBtn.classList.toggle("active", orderType === "TAKEAWAY");
    dineinBtn.disabled = !TableSession.token;
    dineinBtn.style.opacity = TableSession.token ? "1" : "0.4";
    tableHint.style.display = TableSession.token ? "none" : "block";
    dineinBtn.textContent = TableSession.label ? "Dining at " + TableSession.label : "Dine-in";
  }

  dineinBtn.onclick = function () {
    if (!TableSession.token) return;
    orderType = "DINE_IN";
    refreshTypeButtons();
  };
  takeawayBtn.onclick = function () {
    orderType = "TAKEAWAY";
    refreshTypeButtons();
  };
  refreshTypeButtons();

  const placeBtn = document.getElementById("place-order-btn");
  const errorMsg = document.getElementById("error-msg");

  placeBtn.onclick = function () {
    if (orderType === "DINE_IN" && !TableSession.token) {
      errorMsg.textContent = "Scan your table's QR code to order for dine-in, or choose Takeaway.";
      errorMsg.style.display = "block";
      return;
    }

    errorMsg.style.display = "none";
    placeBtn.textContent = "Placing order\u2026";
    placeBtn.disabled = true;

    const payload = {
      idempotencyKey: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      orderType: orderType,
      tableToken: orderType === "DINE_IN" ? TableSession.token : undefined,
      customerName: document.getElementById("name").value || undefined,
      customerPhone: document.getElementById("phone").value || undefined,
      items: lines.map(function (l) {
        return { menuItemId: l.itemId, qty: l.qty, name: l.name, unitPrice: l.price };
      }),
      subtotal: subtotal,
      tax: tax,
      total: total,
    };

    Api.placeOrder(payload)
      .then(function (confirmation) {
        sessionStorage.setItem("lastOrderNumber", confirmation.orderNumber);
        Cart.clear();
        window.location.href = "order-status.html?id=" + encodeURIComponent(confirmation.orderId);
      })
      .catch(function (err) {
        console.error(err);
        errorMsg.textContent = "Something went wrong sending your order. Please try again.";
        errorMsg.style.display = "block";
        placeBtn.textContent = "Place Order";
        placeBtn.disabled = false;
      });
  };
})();
