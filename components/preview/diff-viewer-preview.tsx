"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { DiffViewer, type DiffMode } from "@/registry/default/ui/diff-viewer"

const SHARED_SETTINGS = Array.from(
  { length: 14 },
  (_, index) => `  feature_${index + 1}: enabled`
)

const BEFORE = `service: billing
replicas: 2
timeout: 30s
${SHARED_SETTINGS.join("\n")}
region: eu-west-1
log_level: info`

const AFTER = `service: billing
replicas: 4
timeout: 30s
${SHARED_SETTINGS.join("\n")}
region: eu-central-1
log_level: info
tracing: true`

const MODES: DiffMode[] = ["split", "unified"]

export function DiffViewerPreview() {
  const [mode, setMode] = React.useState<DiffMode>("split")

  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <div className="flex gap-1">
        {MODES.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={mode === option ? "secondary" : "ghost"}
            aria-pressed={mode === option}
            onClick={() => setMode(option)}
            className="capitalize"
          >
            {option}
          </Button>
        ))}
      </div>
      <DiffViewer
        aria-label="Changes to billing.yaml"
        oldValue={BEFORE}
        newValue={AFTER}
        mode={mode}
      />
    </div>
  )
}
