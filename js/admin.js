// Set this to your deployed backend URL (same as js/api.js's API_BASE_URL).
const ADMIN_API_BASE = ""; // e.g. "https://soule-menu-backend.yourname.workers.dev"

(function () {
  const TOKEN_KEY = "admin.token";

  const COLUMNS = [
    { status: "RECEIVED", label: "New Orders" },
    { status: "PREPARING", label: "Preparing" },
    { status: "READY", label: "Ready" },
    { status: "COMPLETED", label: "Completed" },
  ];

  const NEXT_STATUS = {
    RECEIVED: "PREPARING",
    PREPARING: "READY",
    READY: "COMPLETED",
    COMPLETED: null,
    CANCELLED: null,
  };

  function formatINR(n) {
    return "\u20B9" + Number(n || 0).toLocaleString("en-IN");
  }

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  const loginView = document.getElementById("login-view");
  const boardView = document.getElementById("board-view");

  function showBoard() {
    loginView.style.display = "none";
    boardView.style.display = "block";
    loadOrders();
  }

  function showLogin(message) {
    loginView.style.display = "block";
    boardView.style.display = "none";
    if (message) {
      const err = document.getElementById("login-error");
      err.textContent = message;
      err.style.display = "block";
    }
  }

  document.getElementById("login-btn").onclick = function () {
    const password = document.getElementById("password-input").value;
    if (!password) return;

    if (!ADMIN_API_BASE) {
      showLogin("Set ADMIN_API_BASE in js/admin.js to your deployed backend URL first.");
      return;
    }

    fetch(ADMIN_API_BASE + "/api/admin/orders", {
      headers: { Authorization: "Bearer " + password },
    })
      .then(function (res) {
        if (res.status === 401) throw new Error("Incorrect password");
        if (!res.ok) throw new Error("Login failed (" + res.status + ")");
        sessionStorage.setItem(TOKEN_KEY, password);
        showBoard();
      })
      .catch(function (err) {
        showLogin(err.message);
      });
  };

  document.getElementById("logout-btn").onclick = function () {
    sessionStorage.removeItem(TOKEN_KEY);
    showLogin();
  };

  function loadOrders() {
    const token = getToken();
    if (!token) return showLogin();

    fetch(ADMIN_API_BASE + "/api/admin/orders", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(function (res) {
        if (res.status === 401) throw new Error("Session expired, please log in again.");
        return res.json();
      })
      .then(renderBoard)
      .catch(function (err) {
        showLogin(err.message);
      });
  }

  function renderBoard(orders) {
    const board = document.getElementById("admin-board");
    board.innerHTML = "";

    COLUMNS.forEach(function (col) {
      const columnOrders = orders.filter(function (o) { return o.status === col.status; });

      const colEl = document.createElement("div");
      colEl.className = "admin-column";
      colEl.innerHTML = "<h2>" + col.label + " (" + columnOrders.length + ")</h2>";

      columnOrders.forEach(function (o) {
        const card = document.createElement("div");
        card.className = "admin-card";

        const posClass =
          o.pos_sync_status === "SYNCED" ? "synced" : o.pos_sync_status === "FAILED" ? "failed" : "pending";

        card.innerHTML =
          '<div class="row"><span class="order-num">' + o.order_number + "</span><span>" + formatINR(o.total) + "</span></div>" +
          '<div class="meta">' + (o.table_token ? "Table " + o.table_token : o.order_type) + " \u00B7 " +
          new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + "</div>" +
          '<div class="pos-status ' + posClass + '">POS: ' + o.pos_sync_status +
          (o.pos_bill_number ? " \u00B7 Bill " + o.pos_bill_number : "") + "</div>";

        const next = NEXT_STATUS[o.status];
        if (next) {
          const btn = document.createElement("button");
          btn.className = "admin-advance-btn";
          btn.textContent = "Mark " + next.toLowerCase();
          btn.onclick = function () {
            fetch(ADMIN_API_BASE + "/api/admin/orders/" + o.id + "/status", {
              method: "PATCH",
              headers: { "Content-Type": "application/json", Authorization: "Bearer " + getToken() },
              body: JSON.stringify({ status: next }),
            }).then(loadOrders);
          };
          card.appendChild(btn);
        }

        colEl.appendChild(card);
      });

      board.appendChild(colEl);
    });
  }

  if (getToken()) {
    showBoard();
  } else {
    showLogin();
  }

  setInterval(function () {
    if (getToken()) loadOrders();
  }, 10000);
})();
