(function () {
  document.getElementById("hero-img").src = RESTAURANT.heroImage;
  document.getElementById("restaurant-tagline").textContent = RESTAURANT.tagline;

  if (TableSession.label) {
    const badge = document.getElementById("table-badge");
    badge.textContent = "Dining at " + TableSession.label;
    badge.style.display = "inline-block";
  }

  document.getElementById("info-name").textContent = RESTAURANT.name;
  document.getElementById("info-address").textContent = RESTAURANT.address;
  document.getElementById("info-hours").textContent = RESTAURANT.hours;
  const phoneEl = document.getElementById("info-phone");
  phoneEl.textContent = RESTAURANT.phone;
  phoneEl.href = "tel:" + RESTAURANT.phone;
  document.getElementById("info-directions").href = RESTAURANT.gmapsUrl;

  function formatINR(n) {
    return "\u20B9" + n.toLocaleString("en-IN");
  }

  function renderScrollRow(containerId, items) {
    const container = document.getElementById(containerId);
    items.slice(0, 6).forEach(function (item) {
      const a = document.createElement("a");
      a.className = "scroll-card";
      a.href = "menu.html#" + item.category;
      a.innerHTML =
        '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy" />' +
        '<div class="scroll-card-body">' +
        '<div class="name">' + item.name + "</div>" +
        '<div class="price">' + formatINR(item.price) + "</div>" +
        "</div>";
      container.appendChild(a);
    });
  }

  renderScrollRow("bestsellers", MENU_ITEMS.filter(function (i) { return i.bestseller; }));
  renderScrollRow("specials", MENU_ITEMS.filter(function (i) { return i.chefSpecial; }));
})();
