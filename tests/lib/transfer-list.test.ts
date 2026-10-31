import { describe, expect, it } from "vitest"

import {
  filterTransferItems,
  getTransferAnnouncement,
  moveAll,
  moveItems,
  partitionItems,
  selectRange,
  type TransferItem,
} from "@/registry/default/lib/transfer-list"

const SAMPLE_ITEMS: TransferItem[] = [
  { id: "1", label: "Admin", description: "Full access" },
  { id: "2", label: "Editor", description: "Edit content" },
  { id: "3", label: "Viewer", description: "Read only access" },
  { id: "4", label: "Billing", description: "Manage invoices", disabled: true },
]

describe("transfer-list lib", () => {
  describe("partitionItems", () => {
    it("partitions items into source and target arrays based on selectedIds", () => {
      const { sourceItems, targetItems } = partitionItems(SAMPLE_ITEMS, [
        "2",
        "3",
      ])
      expect(sourceItems.map((i) => i.id)).toEqual(["1", "4"])
      expect(targetItems.map((i) => i.id)).toEqual(["2", "3"])
    })

    it("puts all items in source if selectedIds is empty", () => {
      const { sourceItems, targetItems } = partitionItems(SAMPLE_ITEMS, [])
      expect(sourceItems).toHaveLength(4)
      expect(targetItems).toHaveLength(0)
    })
  })

  describe("filterTransferItems", () => {
    it("filters items by label case-insensitively", () => {
      const filtered = filterTransferItems(SAMPLE_ITEMS, "edit")
      expect(filtered.map((i) => i.id)).toEqual(["2"])
    })

    it("filters items by description case-insensitively", () => {
      const filtered = filterTransferItems(SAMPLE_ITEMS, "access")
      expect(filtered.map((i) => i.id)).toEqual(["1", "3"])
    })

    it("returns all items when query is empty or whitespace", () => {
      expect(filterTransferItems(SAMPLE_ITEMS, "   ")).toHaveLength(4)
    })
  })

  describe("moveItems", () => {
    it("moves items to target (adds to selectedIds)", () => {
      const result = moveItems(["1"], ["2", "3"], "toTarget")
      expect(result).toEqual(["1", "2", "3"])
    })

    it("does not duplicate IDs when moving to target", () => {
      const result = moveItems(["1", "2"], ["2", "3"], "toTarget")
      expect(result).toEqual(["1", "2", "3"])
    })

    it("moves items to source (removes from selectedIds)", () => {
      const result = moveItems(["1", "2", "3"], ["2"], "toSource")
      expect(result).toEqual(["1", "3"])
    })
  })

  describe("moveAll", () => {
    it("moves all non-disabled items to target", () => {
      const result = moveAll(SAMPLE_ITEMS, ["1"], "toTarget")
      expect(result).toEqual(["1", "2", "3"])
      // "4" is disabled so it shouldn't be added
    })

    it("moves all non-disabled items to source", () => {
      const result = moveAll(SAMPLE_ITEMS, ["1", "2", "4"], "toSource")
      // "4" is disabled, so it stays in target
      expect(result).toEqual(["4"])
    })
  })

  describe("selectRange", () => {
    const ids = ["1", "2", "3", "4", "5"]

    it("selects all items between fromId and toId inclusive", () => {
      const result = selectRange(ids, "2", "4", ["1"])
      expect(result.sort()).toEqual(["1", "2", "3", "4"].sort())
    })

    it("works in reverse direction", () => {
      const result = selectRange(ids, "4", "2", [])
      expect(result.sort()).toEqual(["2", "3", "4"].sort())
    })
  })

  describe("getTransferAnnouncement", () => {
    it("generates correct announcement string", () => {
      expect(
        getTransferAnnouncement(1, "toTarget", ["Available", "Assigned"])
      ).toBe("Moved 1 item to Assigned.")
      expect(
        getTransferAnnouncement(3, "toSource", ["Available", "Assigned"])
      ).toBe("Moved 3 items to Available.")
    })
  })
})
