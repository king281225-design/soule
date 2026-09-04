# Soulé — QR Digital Menu (static website + optional ordering backend)

A plain HTML/CSS/JS website — no build step, no framework for the menu itself. Open `index.html` in a browser and it works. Deploy it as-is to GitHub Pages and point your table QR codes at `menu.html`.

Cart, checkout, and POS billing integration are also included, backed by a small Cloudflare Worker (`backend/`) — see [Ordering + POS integration](#ordering--pos-integration) below.

```
qr-menu-website/
  index.html          Home page (hero, best sellers, chef's specials)
  menu.html           Full menu + Add to cart — this is what your table QR codes point to
  cart.html           Cart review
  checkout.html       Order type, details, place order
  order-status.html   Confirmation + live status tracking
  qr-generator.html   Standalone tool to generate a QR code per table
  css/style.css        All styling — brand colors/fonts are CSS variables at the top
  js/data.js            Restaurant info + menu items — edit this to update the menu
  js/table.js            Detects ?t=<table> in the URL
  js/cart.js             Cart state (sessionStorage)
  js/api.js              Talks to the backend (or runs in mock mode without one)
  backend/              Cloudflare Worker: order storage + POS adapter (see its own README)
```

## 1. Preview it locally

No install needed for the site itself:

```bash
cd qr-menu-website
python3 -m http.server 8000
```

Open `http://localhost:8000`. To preview the QR-scanned experience: `http://localhost:8000/menu.html?t=12`. Checkout works out of the box in mock mode (no backend needed) — orders "succeed" locally so you can test the whole flow.

## 2. Deploy the site to GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo **Settings → Pages** → Source: "Deploy from a branch" → branch `main`, folder `/ (root)`.
3. Your site is live at `https://<username>.github.io/<repo>/` within a minute or two.

No GitHub Actions workflow is required for the static pages — GitHub Pages serves the files directly.

## 3. Generate table QR codes

Open `qr-generator.html`, paste your live menu URL and a table number, download the PNG, print it. See its own instructions for the unguessable-token recommendation before going live.

## Ordering + POS integration

`menu.html` → `cart.html` → `checkout.html` → `order-status.html` is a full ordering flow. By default (no backend deployed) it runs in **mock mode**: `js/api.js` simulates a successful order so you can test everything before choosing or configuring any POS.

To make it real:
1. Deploy `backend/` (a Cloudflare Worker + D1 database) — full steps in `backend/README.md`.
2. Set `API_BASE_URL` in `js/api.js` to your deployed Worker URL.
3. When you've picked a POS (Petpooja, Posist, Square, or anything else), implement one adapter file against its API — `backend/README.md` walks through exactly what to fill in. Nothing else in the code changes.

**Why a backend at all, if this is "just a website"?** GitHub Pages can't hold API secrets or run server code, and a real POS push needs both (a secret key, and often a webhook endpoint for status updates). So ordering + billing needs a small backend alongside the static site — see `backend/README.md` for the full explanation.

## 4. Swap in the real restaurant

- **Menu & restaurant info** — edit `js/data.js`. Plain JS, no build step: save and refresh.
- **Branding** — edit the `:root` variables at the top of `css/style.css`.
- **Images** — `assets/` already has your logo and interior photo; add more as needed and reference them as relative paths.

## 5. Admin page (live orders)

`admin.html` is a password-gated live orders board (New → Preparing → Ready → Completed, one-tap status advance, POS sync status per order).

1. Deploy `backend/` and set the `ADMIN_PASSWORD` secret: `wrangler secret put ADMIN_PASSWORD`.
2. Set `ADMIN_API_BASE` in `js/admin.js` to your Worker URL (same value as `API_BASE_URL` in `js/api.js`).
3. Open `admin.html` on the deployed site, log in with that password.

This is a single shared password for restaurant staff, not a multi-user system — right-sized for one restaurant.

## What's intentionally not here

A menu-editing UI — menu changes are still a `js/data.js` edit. That's a reasonable next addition if you want it (would need to move the menu into D1 alongside orders) — ask whenever you're ready.

