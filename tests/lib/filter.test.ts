import { describe, expect, it } from "vitest"

import {
  createFilter,
  matchesFilter,
  operatorLabel,
  operatorsFor,
  type Filter,
} from "@/registry/default/lib/filter"

function filterOf(operator: Filter["operator"], value: string): Filter {
  return { id: "f", fieldId: "field", operator, value }
}

describe("filter", () => {
  it("offers operators that fit the field type", () => {
    expect(operatorsFor("text")).toContain("contains")
    expect(operatorsFor("number")).toEqual(["eq", "gt", "lt"])
    expect(operatorsFor("select")).toEqual(["is", "is-not"])
    expect(operatorLabel("not-contains")).toBe("does not contain")
  })

  it("creates a filter with the first operator for the field type", () => {
    const filter = createFilter({
      id: "points",
      label: "Points",
      type: "number",
    })
    expect(filter).toMatchObject({
      fieldId: "points",
      operator: "eq",
      value: "",
    })
    expect(filter.id).not.toBe("")
  })

  it("matches text case insensitively", () => {
    expect(
      matchesFilter("Invoice totals", filterOf("contains", "INVOICE"))
    ).toBe(true)
    expect(
      matchesFilter("Invoice totals", filterOf("not-contains", "invoice"))
    ).toBe(false)
    expect(matchesFilter("Open", filterOf("is", "open"))).toBe(true)
    expect(matchesFilter("Open", filterOf("is-not", "open"))).toBe(false)
  })

  it("compares numbers numerically", () => {
    expect(matchesFilter(5, filterOf("gt", "3"))).toBe(true)
    expect(matchesFilter(10, filterOf("lt", "9"))).toBe(false)
    expect(matchesFilter("3", filterOf("eq", "3"))).toBe(true)
  })

  it("treats an empty value as matching everything", () => {
    expect(matchesFilter("anything", filterOf("is", ""))).toBe(true)
  })
})
