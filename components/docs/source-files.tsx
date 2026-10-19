"use client"

import { useState } from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { CodeFrame } from "@/components/docs/code-frame"
import { TabsRail } from "@/components/docs/tabs-rail"
import type { HighlightedFile } from "@/lib/component-docs"

function fileName(title: string) {
  return title.split("/").pop() ?? title
}

export function SourceFiles({ files }: { files: HighlightedFile[] }) {
  const [activeFile, setActiveFile] = useState(files[0]?.title ?? "")

  if (files.length === 1) return <CodeFrame {...files[0]} collapsible />

  return (
    <TabsPrimitive.Root value={activeFile} onValueChange={setActiveFile}>
      <TabsRail
        items={files.map((file) => ({
          value: file.title,
          label: fileName(file.title),
        }))}
        value={activeFile}
        label="Source files"
        triggerClassName="font-mono text-xs"
        className="overflow-x-auto"
      />
      {files.map((file) => (
        <TabsPrimitive.Content
          key={file.title}
          value={file.title}
          className="mt-3 outline-none"
        >
          <CodeFrame {...file} collapsible />
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
