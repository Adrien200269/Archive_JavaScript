const KHALTI_API = process.env.KHALTI_LIVE === "true"
  ? "https://khalti.com/api/v2"
  : "https://dev.khalti.com/api/v2";

function authHeaders() {
  return {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY || ""}`,
    "Content-Type": "application/json",
  };
}

export interface KhaltiInitiateParams {
  returnUrl: string;
  websiteUrl: string;
  amount: number;
  purchaseOrderId: string;
  purchaseOrderName: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  total_amount: number;
}

export async function initiatePayment(
  params: KhaltiInitiateParams
): Promise<KhaltiInitiateResponse> {
  const res = await fetch(`${KHALTI_API}/epayment/initiate/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      return_url: params.returnUrl,
      website_url: params.websiteUrl,
      amount: Math.round(params.amount * 100),
      purchase_order_id: params.purchaseOrderId,
      purchase_order_name: params.purchaseOrderName,
      customer_info: params.customerInfo,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Khalti initiate failed: ${err}`);
  }

  return res.json();
}

export interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded" | "Cancelled";
  transaction_id: string | null;
}

export async function lookupPayment(pidx: string): Promise<KhaltiLookupResponse> {
  const res = await fetch(`${KHALTI_API}/epayment/lookup/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ pidx }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Khalti lookup failed: ${err}`);
  }

  return res.json();
}
