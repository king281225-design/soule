(function () {
  const TAX_RATE = 0.05; // placeholder — confirm the real rate with the restaurant

  function formatINR(n) {
    return "\u20B9" + n.toLocaleString("en-IN");
  }

  function render() {
    const lines = Cart.read();
    const container = document.getElementById("cart-lines");
    const empty = document.getElementById("cart-empty");
    const summary = document.getElementById("cart-summary");

    if (lines.length === 0) {
      container.innerHTML = "";
      empty.style.display = "block";
      summary.style.display = "none";
      return;
    }

    empty.style.display = "none";
    summary.style.display = "block";

    container.innerHTML = "";
    lines.forEach(function (line) {
      const el = document.createElement("div");
      el.className = "cart-line";
      el.innerHTML =
        '<div>' +
        '<div class="name">' + line.name + "</div>" +
        '<div class="line-price">' + formatINR(line.price) + " each</div>" +
        "</div>" +
        '<span class="qty-stepper">' +
        '<button class="qty-minus" aria-label="Decrease quantity">\u2212</button>' +
        '<span class="qty-value">' + line.qty + "</span>" +
        '<button class="qty-plus" aria-label="Increase quantity">+</button>' +
        "</span>";

      el.querySelector(".qty-minus").onclick = function () {
        Cart.setQty(line.itemId, line.qty - 1);
        render();
      };
      el.querySelector(".qty-plus").onclick = function () {
        Cart.setQty(line.itemId, line.qty + 1);
        render();
      };

      container.appendChild(el);
    });

    const subtotal = Cart.subtotal();
    const tax = Math.round(subtotal * TAX_RATE);
    document.getElementById("sum-subtotal").textContent = formatINR(subtotal);
    document.getElementById("sum-tax").textContent = formatINR(tax);
    document.getElementById("sum-total").textContent = formatINR(subtotal + tax);
    document.getElementById("checkout-link").textContent =
      "Continue to Checkout \u00B7 " + formatINR(subtotal + tax);
  }

  render();
})();
