import { after } from "next/server";

export type OrderNotificationPayload = {
  orderId: string;
  customerName: string;
  customerPhone?: string | null;
  items: {
    name: string;
    size?: string | null;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  address: {
    line1: string;
    city: string;
    postalCode?: string | null;
    country: string;
  };
};

const GRAPH_API_VERSION = "v21.0";

// Sends the store owner a WhatsApp message for a real order via Meta's
// official WhatsApp Business Cloud API — see CONTEXT_HANDOFF.md for the
// Meta Developer/Business setup steps and how to create+get approval for
// the message template this calls. Replaces the earlier unofficial Baileys
// notifier (whatsapp-notifier/, src/lib/notify-order.ts's prior version),
// which was dropped 2026-08-07 after fighting WhatsApp's anti-bot
// rate-limiting; that service is left in the repo unused rather than
// deleted, in case this is ever revisited.
//
// Business-initiated messages (i.e. not a reply within 24h of the owner
// texting the number first) must use a pre-approved template — free-form
// text isn't allowed here. Entirely optional: if the env vars aren't set,
// this silently does nothing, same as the push notification it runs
// alongside (src/lib/push-notify.ts). Scheduled with Next's `after()` (see
// that file's comment for why, over a bare unawaited promise) — errors here
// are caught and logged, never thrown, since a WhatsApp outage must never
// fail a real checkout.
export function notifyOwnerOfOrder(payload: OrderNotificationPayload) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ownerNumber = process.env.WHATSAPP_OWNER_NUMBER;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  if (!accessToken || !phoneNumberId || !ownerNumber || !templateName) return;

  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANG || "en_US";
  const itemsSummary = payload.items
    .map(
      (item) =>
        `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ""}`
    )
    .join(", ");

  after(async () => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: ownerNumber,
            type: "template",
            template: {
              name: templateName,
              language: { code: templateLanguage },
              components: [
                {
                  type: "body",
                  parameters: [
                    { type: "text", text: payload.customerName },
                    { type: "text", text: itemsSummary },
                    { type: "text", text: `$${payload.total.toFixed(2)}` },
                    { type: "text", text: payload.orderId },
                  ],
                },
              ],
            },
          }),
          signal: AbortSignal.timeout(15_000),
        }
      );
      if (!res.ok) {
        console.error(
          "[notify-order] WhatsApp Cloud API returned",
          res.status,
          await res.text().catch(() => "")
        );
      }
    } catch (err) {
      console.error("[notify-order] failed to reach WhatsApp Cloud API:", err);
    }
  });
}
