import { Router } from "itty-router";
import type { Env } from "./types";
import { corsHeaders, json } from "./lib/response";
import { handleGetTable } from "./routes/table";
import { handlePlaceOrder, handleGetOrderStatus } from "./routes/orders";
import {
  handleAdminListOrders,
  handleAdminUpdateOrderStatus,
  handleAdminCreateTable,
  handleAdminListTables,
} from "./routes/admin";
import { runPosSyncRetrySweep } from "./integrations/retrySweep";

const router = Router();

router.get("/api/table/:token", (req: any, env: Env) => handleGetTable(req, env, req.params));
router.post("/api/orders", handlePlaceOrder);
router.get("/api/orders/:orderId/status", (req: any, env: Env) => handleGetOrderStatus(req, env, req.params));

router.get("/api/admin/orders", handleAdminListOrders);
router.patch("/api/admin/orders/:orderId/status", (req: any, env: Env) =>
  handleAdminUpdateOrderStatus(req, env, req.params),
);
router.post("/api/admin/tables", handleAdminCreateTable);
router.get("/api/admin/tables", handleAdminListTables);

router.all("*", () => json({ error: "Not found" }, { status: 404 }));

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = corsHeaders(env.ALLOWED_ORIGIN);
    if (req.method === "OPTIONS") return new Response(null, { headers: origin });

    const res = await router.fetch(req, env, ctx);
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(origin)) headers.set(k, v);
    return new Response(res.body, { status: res.status, headers });
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runPosSyncRetrySweep(env));
  },
};
