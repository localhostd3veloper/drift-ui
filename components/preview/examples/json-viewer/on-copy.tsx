"use client"

import * as React from "react"

import { JsonViewer } from "@/registry/default/ui/json-viewer"

const CONFIG = {
  service: "billing",
  replicas: 3,
  regions: ["eu-west-1", "us-east-1"],
}

export function JsonViewerOnCopyPreview() {
  const [copied, setCopied] = React.useState("")

  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      <JsonViewer
        aria-label="Service config"
        data={CONFIG}
        defaultExpandDepth={2}
        onCopy={(path, _value, target) => setCopied(`${target}: ${path}`)}
        className="h-56"
      />
      <p className="font-mono text-xs text-muted-foreground">
        {copied || "Nothing copied yet"}
      </p>
    </div>
  )
}
