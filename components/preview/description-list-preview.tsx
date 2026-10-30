"use client"

import * as React from "react"

import { Badge } from "@/registry/default/ui/badge"
import {
  DescriptionItem,
  DescriptionList,
} from "@/registry/default/ui/description-list"

export function DescriptionListPreview() {
  const [owner, setOwner] = React.useState("Ana Lima")

  return (
    <DescriptionList className="w-full max-w-md">
      <DescriptionItem label="ID" copyable>
        <span className="font-mono">usr_8f2a</span>
      </DescriptionItem>
      <DescriptionItem label="Owner" editable onValueChange={setOwner}>
        {owner}
      </DescriptionItem>
      <DescriptionItem label="Status">
        <Badge variant="secondary">Active</Badge>
      </DescriptionItem>
      <DescriptionItem label="Created">Oct 12, 2026, 09:41</DescriptionItem>
    </DescriptionList>
  )
}
