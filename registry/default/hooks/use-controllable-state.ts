"use client"

import * as React from "react"

type StateUpdate<T> = T | ((previous: T) => T)

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = React.useCallback(
    (update: StateUpdate<T>) => {
      const next =
        typeof update === "function"
          ? (update as (previous: T) => T)(currentValue)
          : update
      if (Object.is(next, currentValue)) return
      if (!isControlled) setUncontrolledValue(next)
      onChange?.(next)
    },
    [currentValue, isControlled, onChange]
  )

  return { value: currentValue, setValue }
}
