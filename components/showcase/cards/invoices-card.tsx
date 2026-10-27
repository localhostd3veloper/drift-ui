"use client"

import * as React from "react"
import { BanIcon, DownloadIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"
import { Badge } from "@/registry/default/ui/badge"
import {
  BulkActionBar,
  BulkActionBarButton,
} from "@/registry/default/ui/bulk-action-bar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"

const INVOICES = [
  { id: "INV-2041", customer: "Northwind Labs", amount: 1280, status: "Paid" },
  { id: "INV-2042", customer: "Atlas Freight", amount: 640, status: "Due" },
  {
    id: "INV-2043",
    customer: "Brightline Co",
    amount: 2150,
    status: "Overdue",
  },
  { id: "INV-2044", customer: "Kestrel Health", amount: 920, status: "Paid" },
  { id: "INV-2045", customer: "Juniper Studio", amount: 310, status: "Due" },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function InvoicesCard() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const clearSelection = React.useCallback(() => setSelectedIds([]), [])
  const isAllSelected = selectedIds.length === INVOICES.length
  const outstanding = INVOICES.filter((invoice) => invoice.status !== "Paid")
    .map((invoice) => invoice.amount)
    .reduce((sum, amount) => sum + amount, 0)

  function toggleInvoice(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selected) => selected !== id)
        : [...current, id]
    )
  }

  function toggleAll() {
    setSelectedIds(isAllSelected ? [] : INVOICES.map((invoice) => invoice.id))
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>October billing run</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="w-8 py-2 text-left font-normal">
                <input
                  type="checkbox"
                  aria-label="Select all invoices"
                  checked={isAllSelected}
                  onChange={toggleAll}
                  className="size-4 align-middle accent-primary"
                />
              </th>
              <th className="py-2 text-left font-normal">Customer</th>
              <th className="py-2 text-left font-normal">Status</th>
              <th className="py-2 text-right font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((invoice) => {
              const isSelected = selectedIds.includes(invoice.id)
              return (
                <tr
                  key={invoice.id}
                  className={cn(
                    "border-b last:border-0",
                    isSelected && "bg-muted/50"
                  )}
                >
                  <td className="py-2">
                    <input
                      type="checkbox"
                      aria-label={`Select ${invoice.id}`}
                      checked={isSelected}
                      onChange={() => toggleInvoice(invoice.id)}
                      className="size-4 align-middle accent-primary"
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex flex-col">
                      <span className="truncate">{invoice.customer}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {invoice.id}
                      </span>
                    </div>
                  </td>
                  <td className="py-2">
                    <Badge
                      variant={
                        invoice.status === "Paid" ? "secondary" : "outline"
                      }
                      className={cn(
                        invoice.status === "Overdue" && "text-destructive"
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    {currency.format(invoice.amount)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="justify-between text-sm">
        <span className="text-muted-foreground">Outstanding</span>
        <span className="font-mono font-medium tabular-nums">
          {currency.format(outstanding)}
        </span>
      </CardFooter>
      <BulkActionBar
        placement="container"
        aria-label="Invoice actions"
        selectedCount={selectedIds.length}
        onClear={clearSelection}
      >
        <BulkActionBarButton onClick={clearSelection}>
          <DownloadIcon />
          Export
        </BulkActionBarButton>
        <BulkActionBarButton
          onClick={clearSelection}
          className="text-destructive hover:text-destructive"
        >
          <BanIcon />
          Void
        </BulkActionBarButton>
      </BulkActionBar>
    </Card>
  )
}
