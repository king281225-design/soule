// Simple cart, persisted in sessionStorage so it survives navigation
// between menu.html, cart.html and checkout.html within one visit.
// (This is a real deployed website, not a Claude.ai artifact preview,
// so browser storage is fine here.)

const Cart = (function () {
  const KEY = "menu.cart";

  function read() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function write(lines) {
    sessionStorage.setItem(KEY, JSON.stringify(lines));
  }

  function add(itemId, name, price) {
    const lines = read();
    const existing = lines.find(function (l) { return l.itemId === itemId; });
    if (existing) {
      existing.qty += 1;
    } else {
      lines.push({ itemId: itemId, name: name, price: price, qty: 1 });
    }
    write(lines);
  }

  function setQty(itemId, qty) {
    let lines = read();
    if (qty <= 0) {
      lines = lines.filter(function (l) { return l.itemId !== itemId; });
    } else {
      const existing = lines.find(function (l) { return l.itemId === itemId; });
      if (existing) existing.qty = qty;
    }
    write(lines);
  }

  function qtyFor(itemId) {
    const line = read().find(function (l) { return l.itemId === itemId; });
    return line ? line.qty : 0;
  }

  function count() {
    return read().reduce(function (n, l) { return n + l.qty; }, 0);
  }

  function subtotal() {
    return read().reduce(function (s, l) { return s + l.price * l.qty; }, 0);
  }

  function clear() {
    sessionStorage.removeItem(KEY);
  }

  return { read: read, add: add, setQty: setQty, qtyFor: qtyFor, count: count, subtotal: subtotal, clear: clear };
})();
