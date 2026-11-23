const BASE = "https://api.paystack.co";

type PaystackResponse<T> = { status: boolean; message: string; data: T };

async function paystack<T>(path: string, init?: RequestInit): Promise<PaystackResponse<T>> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = (await res.json().catch(() => null)) as PaystackResponse<T> | null;
  if (!json) throw new Error(`Paystack returned an unreadable response (${res.status})`);
  return json;
}

export async function initializeTransaction(input: {
  email: string;
  /** Amount in the currency's minor unit (kobo or cents). */
  amount: number;
  currency: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}) {
  return paystack<{ authorization_url: string; access_code: string; reference: string }>(
    "/transaction/initialize",
    {
      method: "POST",
      body: JSON.stringify({
        email: input.email,
        amount: input.amount,
        currency: input.currency,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    }
  );
}

export type VerifiedTransaction = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata: { songId?: string } | null;
};

export async function verifyTransaction(reference: string) {
  return paystack<VerifiedTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
}
