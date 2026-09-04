export interface Env {
  DB: D1Database;

  ALLOWED_ORIGIN: string;
  POS_PROVIDER: string; // "mock" | whatever you name your real adapter
  POS_API_BASE_URL: string;
  ADMIN_PASSWORD: string; // secret, set via `wrangler secret put ADMIN_PASSWORD`

  // Add POS-specific secrets here once you pick a provider, e.g.:
  // POS_API_KEY: string;
}

export interface PlaceOrderItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  qty: number;
}

export interface PlaceOrderBody {
  idempotencyKey: string;
  orderType: "DINE_IN" | "TAKEAWAY";
  tableToken?: string;
  customerName?: string;
  customerPhone?: string;
  items: PlaceOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}
