import { DiffViewer } from "@/registry/default/ui/diff-viewer"

const BEFORE = `export function total(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}`

const AFTER = `export function total(items, tax = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  return subtotal * (1 + tax)
}`

export function DiffViewerUnifiedPreview() {
  return (
    <DiffViewer
      aria-label="Changes to total.ts"
      oldValue={BEFORE}
      newValue={AFTER}
      mode="unified"
      className="w-full max-w-2xl"
    />
  )
}
