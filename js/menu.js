(function () {
  if (TableSession.label) {
    const banner = document.getElementById("table-banner");
    banner.textContent = "Dining at " + TableSession.label;
    banner.style.display = "block";
  }

  function formatINR(n) {
    return "\u20B9" + n.toLocaleString("en-IN");
  }

  const nav = document.getElementById("category-nav");
  const list = document.getElementById("menu-list");

  CATEGORIES.forEach(function (cat) {
    const items = MENU_ITEMS.filter(function (i) { return i.category === cat.id; });
    if (items.length === 0) return;

    const pill = document.createElement("a");
    pill.className = "category-pill";
    pill.textContent = cat.name;
    pill.href = "#" + cat.id;
    pill.dataset.cat = cat.id;
    nav.appendChild(pill);

    const section = document.createElement("section");
    section.className = "menu-section";
    section.id = cat.id;

    const heading = document.createElement("h2");
    heading.textContent = cat.name;
    section.appendChild(heading);

    items.forEach(function (item) {
      const card = document.createElement("div");
      card.className = "item-card";

      const vegClass = item.veg ? "veg-dot" : "veg-dot nonveg";
      const badges = [];
      if (item.bestseller) badges.push('<span class="badge bestseller">Bestseller</span>');
      if (item.chefSpecial) badges.push('<span class="badge chef-special">Chef Special</span>');

      card.innerHTML =
        '<div class="item-image' + (item.available ? "" : " unavailable") + '">' +
        '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy" />' +
        (item.available ? "" : '<span class="sold-out-tag">Sold Out</span>') +
        "</div>" +
        '<div class="item-body">' +
        '<div class="item-title-row">' +
        '<span class="' + vegClass + '"><span></span></span>' +
        '<span class="item-name">' + item.name + "</span>" +
        "</div>" +
        (badges.length ? '<div class="badges">' + badges.join("") + "</div>" : "") +
        '<p class="item-desc">' + item.description + "</p>" +
        '<div class="item-footer">' +
        '<span class="item-price">' + formatINR(item.price) + "</span>" +
        '<span class="cart-ctrl" data-item-id="' + item.id + '"></span>' +
        "</div></div>";

      section.appendChild(card);

      if (item.available) {
        renderCartCtrl(card.querySelector(".cart-ctrl"), item);
      } else {
        card.querySelector(".cart-ctrl").outerHTML = '<span class="unavailable-tag">Unavailable</span>';
      }
    });

    list.appendChild(section);
  });

  function renderCartCtrl(el, item) {
    const qty = Cart.qtyFor(item.id);
    if (qty === 0) {
      el.innerHTML = '<button class="add-btn">Add</button>';
      el.querySelector(".add-btn").onclick = function () {
        Cart.add(item.id, item.name, item.price);
        renderCartCtrl(el, item);
        updateStickyBar();
      };
    } else {
      el.innerHTML =
        '<span class="qty-stepper">' +
        '<button class="qty-minus" aria-label="Decrease quantity">\u2212</button>' +
        '<span class="qty-value">' + qty + "</span>" +
        '<button class="qty-plus" aria-label="Increase quantity">+</button>' +
        "</span>";
      el.querySelector(".qty-minus").onclick = function () {
        Cart.setQty(item.id, qty - 1);
        renderCartCtrl(el, item);
        updateStickyBar();
      };
      el.querySelector(".qty-plus").onclick = function () {
        Cart.setQty(item.id, qty + 1);
        renderCartCtrl(el, item);
        updateStickyBar();
      };
    }
  }

  function updateStickyBar() {
    const bar = document.getElementById("sticky-cart-bar");
    const count = Cart.count();
    if (count === 0) {
      bar.style.display = "none";
      return;
    }
    bar.style.display = "flex";
    bar.querySelector(".sticky-cart-summary").textContent =
      count + (count === 1 ? " Item" : " Items") + " \u00B7 " + formatINR(Cart.subtotal());
  }

  updateStickyBar();

  // Highlight the active category pill as the user scrolls.
  const pills = Array.prototype.slice.call(document.querySelectorAll(".category-pill"));
  const sections = Array.prototype.slice.call(document.querySelectorAll(".menu-section"));

  function setActive(id) {
    pills.forEach(function (p) {
      p.classList.toggle("active", p.dataset.cat === id);
    });
  }

  if (pills.length) setActive(pills[0].dataset.cat);

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-120px 0px -70% 0px" },
  );
  sections.forEach(function (s) { observer.observe(s); });
})();
