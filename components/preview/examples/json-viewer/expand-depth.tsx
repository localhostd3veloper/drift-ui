import { JsonViewer } from "@/registry/default/ui/json-viewer"

const RESPONSE = {
  status: 200,
  headers: { "content-type": "application/json", "x-request-id": "req_8841" },
  body: { user: { id: "usr_8f2a", roles: ["admin", "billing"] } },
}

export function JsonViewerExpandDepthPreview() {
  return (
    <JsonViewer
      aria-label="API response"
      data={RESPONSE}
      defaultExpandDepth={0}
      className="h-56 w-full max-w-lg"
    />
  )
}
