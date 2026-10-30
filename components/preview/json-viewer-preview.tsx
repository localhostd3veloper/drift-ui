import { JsonViewer } from "@/registry/default/ui/json-viewer"

const WEBHOOK_PAYLOAD = {
  id: "evt_1Qx8",
  type: "invoice.paid",
  livemode: false,
  created: 1793350800,
  data: {
    invoice: {
      number: "INV-0042",
      amount_due: 4900,
      currency: "usd",
      customer: { id: "cus_93kd", email: "ana@example.com", tax_id: null },
      lines: [
        { description: "Pro plan", quantity: 1, amount: 4900 },
        { description: "Extra seats", quantity: 0, amount: 0 },
      ],
    },
  },
  retries: Array.from({ length: 240 }, (_, attempt) => ({
    attempt,
    status: attempt % 7 === 0 ? 500 : 200,
  })),
}

export function JsonViewerPreview() {
  return (
    <JsonViewer
      aria-label="Webhook payload"
      data={WEBHOOK_PAYLOAD}
      defaultExpandDepth={2}
      className="h-96 w-full max-w-lg"
    />
  )
}
