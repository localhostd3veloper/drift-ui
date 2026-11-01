"use client"

import * as React from "react"

import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import {
  applyMask,
  calculateCurrencyCaretPosition,
  calculateMaskCaretPosition,
  DEFAULT_MASK_DEFINITIONS,
  formatCurrency,
  formatCurrencyLive,
  getCurrencyInfo,
  isMaskToken,
  parseCurrency,
  unmaskValue,
} from "@/registry/default/lib/masked-input"
import { cn } from "@/registry/default/lib/utils"

interface MaskedInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange"
> {
  mask: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, formattedValue: string) => void
  definitions?: Record<string, RegExp>
}

function MaskedInput({
  mask,
  value,
  defaultValue = "",
  onValueChange,
  definitions = DEFAULT_MASK_DEFINITIONS,
  name,
  disabled,
  className,
  onKeyDown,
  ...props
}: MaskedInputProps) {
  const { value: rawValue, setValue: setRawValue } = useControllableState({
    value,
    defaultValue,
    onChange: (val) => {
      const { formatted } = applyMask(val, mask, definitions)
      onValueChange?.(val, formatted)
    },
  })

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const formattedValue = React.useMemo(
    () => applyMask(rawValue ?? "", mask, definitions).formatted,
    [rawValue, mask, definitions]
  )

  function commit(nextRaw: string) {
    setRawValue(nextRaw)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawInput = event.target.value
    const rawCursorPos = event.target.selectionEnd ?? rawInput.length
    const unmasked = unmaskValue(rawInput, mask, definitions)
    const { formatted: nextFormatted, raw: nextRaw } = applyMask(
      unmasked,
      mask,
      definitions
    )

    const nextCursor = calculateMaskCaretPosition({
      nextFormatted,
      rawInput,
      rawCursorPos,
      mask,
      definitions,
    })

    commit(nextRaw)

    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(nextCursor, nextCursor)
    })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === "Backspace") {
      const input = event.currentTarget
      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0

      if (start === end && start > 0) {
        const maskCharBefore = mask[start - 1]

        if (maskCharBefore && !isMaskToken(maskCharBefore, definitions)) {
          event.preventDefault()
          let deleteIdx = start - 1
          while (
            deleteIdx >= 0 &&
            mask[deleteIdx] &&
            !isMaskToken(mask[deleteIdx], definitions)
          ) {
            deleteIdx--
          }

          if (deleteIdx >= 0) {
            const before = unmaskValue(
              formattedValue.slice(0, deleteIdx),
              mask,
              definitions
            )
            const after = unmaskValue(
              formattedValue.slice(deleteIdx + 1),
              mask,
              definitions
            )
            const newRaw = before + after
            const { formatted: nextFormatted, raw: nextCleanRaw } = applyMask(
              newRaw,
              mask,
              definitions
            )
            const nextCursor = calculateMaskCaretPosition({
              nextFormatted,
              rawInput: formattedValue.slice(0, deleteIdx),
              rawCursorPos: deleteIdx,
              mask,
              definitions,
            })

            commit(nextCleanRaw)
            requestAnimationFrame(() => {
              input.setSelectionRange(nextCursor, nextCursor)
            })
          }
        }
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        data-slot="masked-input"
        disabled={disabled}
        value={formattedValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className
        )}
        {...props}
      />
      {name && <input type="hidden" name={name} value={rawValue ?? ""} />}
    </>
  )
}

interface CurrencyInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange"
> {
  currency?: string
  locale?: string
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null, formattedValue: string) => void
  min?: number
  max?: number
}

function CurrencyInput({
  currency = "USD",
  locale = "en-US",
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  name,
  disabled,
  className,
  onKeyDown,
  ...props
}: CurrencyInputProps) {
  const { value: centsValue, setValue: setCentsValue } = useControllableState<
    number | null
  >({
    value,
    defaultValue,
    onChange: (val) => {
      const formatted = formatCurrency(val, locale, currency)
      onValueChange?.(val, formatted)
    },
  })

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [draft, setDraft] = React.useState<string | null>(null)

  const displayedText =
    draft ??
    (centsValue !== null && centsValue !== undefined
      ? formatCurrency(centsValue, locale, currency)
      : "")

  function commit(nextCents: number | null) {
    if (nextCents === null) {
      setDraft(null)
      setCentsValue(null)
      return
    }
    const clamped = Math.min(
      max ?? Infinity,
      Math.max(min ?? -Infinity, nextCents)
    )
    setDraft(null)
    setCentsValue(clamped)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawInput = event.target.value
    const rawCursorPos = event.target.selectionEnd ?? rawInput.length

    if (!rawInput.trim()) {
      setDraft(null)
      setCentsValue(null)
      onValueChange?.(null, "")
      return
    }

    const { formatted, cents } = formatCurrencyLive(rawInput, locale, currency)

    let finalCents = cents
    let finalFormatted = formatted

    if (finalCents !== null && max !== undefined && finalCents > max) {
      finalCents = max
      finalFormatted = formatCurrency(max, locale, currency)
    }

    setDraft(finalFormatted)
    setCentsValue(finalCents)
    onValueChange?.(finalCents, finalFormatted)

    const nextCursor = calculateCurrencyCaretPosition({
      nextFormatted: finalFormatted,
      rawInput,
      rawCursorPos,
      locale,
      currency,
    })

    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(nextCursor, nextCursor)
    })
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    setDraft(null)
    if (centsValue !== null) {
      const clamped = Math.min(
        max ?? Infinity,
        Math.max(min ?? -Infinity, centsValue)
      )
      if (clamped !== centsValue) {
        setCentsValue(clamped)
        onValueChange?.(clamped, formatCurrency(clamped, locale, currency))
      }
    }
    props.onBlur?.(event)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === "Backspace") {
      const input = event.currentTarget
      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0
      const { group } = getCurrencyInfo(locale, currency)

      if (start === end && start > 0 && displayedText[start - 1] === group) {
        event.preventDefault()
        const before = displayedText.slice(0, start - 2)
        const after = displayedText.slice(start)
        const combined = before + after
        const parsed = parseCurrency(combined, locale, currency)

        commit(parsed)
        const nextFormatted = formatCurrency(parsed, locale, currency)
        const nextCursor = calculateCurrencyCaretPosition({
          nextFormatted,
          rawInput: before,
          rawCursorPos: start - 2,
          locale,
          currency,
        })

        requestAnimationFrame(() => {
          input.setSelectionRange(nextCursor, nextCursor)
        })
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        data-slot="currency-input"
        disabled={disabled}
        value={displayedText}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className
        )}
        {...props}
      />
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            centsValue !== null && centsValue !== undefined ? centsValue : ""
          }
        />
      )}
    </>
  )
}

export {
  MaskedInput,
  CurrencyInput,
  type MaskedInputProps,
  type CurrencyInputProps,
}
