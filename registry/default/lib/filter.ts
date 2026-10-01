import type { ReactNode } from "react"

export type FilterFieldType = "text" | "number" | "select"

export type FilterOperator =
  "contains" | "not-contains" | "is" | "is-not" | "eq" | "gt" | "lt"

export type FilterField = {
  id: string
  label: string
  type: FilterFieldType
  options?: { value: string; label: string }[]
  icon?: ReactNode
}

export type Filter = {
  id: string
  fieldId: string
  operator: FilterOperator
  value: string
}

const OPERATORS_BY_TYPE: Record<FilterFieldType, FilterOperator[]> = {
  text: ["contains", "not-contains", "is", "is-not"],
  number: ["eq", "gt", "lt"],
  select: ["is", "is-not"],
}

const OPERATOR_LABEL: Record<FilterOperator, string> = {
  contains: "contains",
  "not-contains": "does not contain",
  is: "is",
  "is-not": "is not",
  eq: "=",
  gt: ">",
  lt: "<",
}

export function operatorsFor(type: FilterFieldType) {
  return OPERATORS_BY_TYPE[type]
}

export function operatorLabel(operator: FilterOperator) {
  return OPERATOR_LABEL[operator]
}

export function createFilter(field: FilterField): Filter {
  return {
    id: Math.random().toString(36).slice(2),
    fieldId: field.id,
    operator: OPERATORS_BY_TYPE[field.type][0],
    value: "",
  }
}

export function matchesFilter(fieldValue: string | number, filter: Filter) {
  const text = String(fieldValue).toLowerCase()
  const needle = filter.value.toLowerCase()
  if (needle === "") return true

  switch (filter.operator) {
    case "contains":
      return text.includes(needle)
    case "not-contains":
      return !text.includes(needle)
    case "is":
      return text === needle
    case "is-not":
      return text !== needle
    case "eq":
      return Number(fieldValue) === Number(filter.value)
    case "gt":
      return Number(fieldValue) > Number(filter.value)
    case "lt":
      return Number(fieldValue) < Number(filter.value)
  }
}
