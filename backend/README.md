# Soulé menu backend

A small Cloudflare Worker that receives orders from the website (`../checkout.html`) and forwards them to whichever POS/billing system you end up using. It's built so **no POS is required to test the full flow today** — it defaults to a mock adapter that simulates success.

## Why this exists (and why it can't live on GitHub Pages)

GitHub Pages only serves static files — it can't hold API secrets or run server code, both of which billing integration needs (a real order-push call requires a secret key, and a POS status webhook needs an always-on endpoint to receive it). So the split is:

- **GitHub Pages** — the customer-facing site (`index.html`, `menu.html`, `cart.html`, etc.)
- **This Worker** — order storage + the POS push, deployed separately, holding any real secrets

They're two deployments from one repo, which is the smallest setup that actually works.

## Deploy

```bash
cd backend
npm install
npx wrangler login

npx wrangler d1 create soule_menu_db     # copy the printed database_id into wrangler.toml
npm run db:migrate:remote                # applies schema.sql

npm run deploy                           # prints your Worker URL
```

Set `ALLOWED_ORIGIN` in `wrangler.toml` to your GitHub Pages URL, then set `API_BASE_URL` in `../js/api.js` to the Worker URL you got from `deploy`.

Add at least one table so dine-in orders can resolve:

```bash
npx wrangler d1 execute soule_menu_db --remote --command \
  "INSERT INTO tables (id, label, qr_token, active) VALUES ('t1', 'Table 1', 'REPLACE_WITH_RANDOM_TOKEN', 1)"
```

(Generate the QR code for that token with `../qr-generator.html`.)

## Adding a real POS once you've picked one

1. Copy `src/integrations/pos/templateAdapter.ts` to a new file named after the POS (e.g. `petpoojaAdapter.ts`).
2. Fill in the marked sections using that POS's API docs: request payload, auth headers, response parsing.
3. Add any required secrets: `npx wrangler secret put POS_API_KEY` (name it whatever that POS calls its key).
4. Register the adapter in `src/integrations/pos/registry.ts` (one `case` line).
5. Set `POS_PROVIDER` and `POS_API_BASE_URL` in `wrangler.toml` to match, and redeploy.

Nothing else changes — routes, database, retry logic, and the frontend are all written against the generic `PosAdapter` interface in `src/integrations/pos/types.ts`, not against any specific POS.

## What's here

```
src/
  index.ts                        Worker entry point / router
  types.ts                        Env + request/response types
  lib/response.ts                 JSON + CORS helpers
  routes/orders.ts                Order submission + status lookup
  routes/table.ts                 QR token -> table label
  integrations/
    retrySweep.ts                 Cron job retrying orders stuck pos_sync_status=PENDING
    pos/
      types.ts                    The PosAdapter interface — the contract every POS integration implements
      mockAdapter.ts              Default: simulates success, no real POS needed
      templateAdapter.ts          Copy this when you're ready to wire a real POS
      registry.ts                 Picks which adapter to use based on POS_PROVIDER
db/schema.sql                     D1 schema (tables, orders)
```

## Known trade-off

This backend trusts the prices the frontend sends in the order payload (they originate from the public `js/data.js` file). That's an acceptable trade-off for a simple, static-first setup — but it means someone could technically tamper with the price in a request. If that matters for your setup, move the menu into D1 and re-validate prices server-side before accepting an order (the fuller reference app built earlier in this conversation does this — ask if you want that pattern ported in here).
