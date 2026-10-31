"use client"

import * as React from "react"

import {
  DescriptionItem,
  DescriptionList,
} from "@/registry/default/ui/description-list"

export function DescriptionListPlaceholderPreview() {
  const [billingEmail, setBillingEmail] = React.useState("")

  return (
    <DescriptionList className="w-full max-w-md">
      <DescriptionItem
        label="Billing email"
        editable
        placeholder="Add an email"
        onValueChange={setBillingEmail}
      >
        {billingEmail}
      </DescriptionItem>
    </DescriptionList>
  )
}
