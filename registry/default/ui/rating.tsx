"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import { cn } from "@/registry/default/lib/utils"

function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  step = 1,
  icon = <StarIcon />,
  readOnly = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  step?: 1 | 0.5
  icon?: React.ReactNode
  readOnly?: boolean
  disabled?: boolean
}) {
  const { value: rating, setValue } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [hovered, setHovered] = React.useState<number | null>(null)
  const options = Array.from(
    { length: Math.round(max / step) },
    (_, index) => (index + 1) * step
  )
  const shown = hovered ?? rating
  const tabStop = options.includes(rating) ? rating : options[0]

  function choose(option: number, from: HTMLElement) {
    setValue(option)
    from
      .closest('[data-slot="rating"]')
      ?.querySelector<HTMLElement>(`[data-value="${option}"]`)
      ?.focus()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    const index = options.indexOf(rating)
    const from = event.currentTarget
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        choose(options[Math.min(index + 1, options.length - 1)], from)
        break
      case "ArrowLeft":
      case "ArrowDown":
        choose(options[Math.max(index - 1, 0)], from)
        break
      case "Home":
        choose(options[0], from)
        break
      case "End":
        choose(options.at(-1)!, from)
        break
      case " ":
      case "Enter":
        choose(Number(event.currentTarget.dataset.value), from)
        break
      default:
        return
    }
    setHovered(null)
    event.preventDefault()
  }

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      data-slot="rating"
      aria-label={
        readOnly
          ? [ariaLabel, `${rating} out of ${max}`].filter(Boolean).join(": ")
          : ariaLabel
      }
      aria-disabled={disabled || undefined}
      onPointerLeave={() => setHovered(null)}
      className={cn(
        "inline-flex items-center gap-0.5 text-primary",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const fill = Math.min(Math.max(shown - index, 0), 1)

        return (
          <span
            key={index}
            data-slot="rating-item"
            className="relative inline-flex [&_svg]:size-5 [&_svg]:shrink-0"
          >
            <span aria-hidden className="inline-flex text-muted-foreground/40">
              {icon}
            </span>
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 inline-flex overflow-hidden [&_svg]:fill-current"
              style={{ width: `${fill * 100}%` }}
            >
              {icon}
            </span>
            {!readOnly &&
              options
                .filter((option) => Math.ceil(option) === index + 1)
                .map((option) => (
                  <span
                    key={option}
                    role="radio"
                    data-value={option}
                    aria-checked={option === rating}
                    aria-label={`${option} out of ${max}`}
                    tabIndex={!disabled && option === tabStop ? 0 : -1}
                    onClick={(event) => choose(option, event.currentTarget)}
                    onKeyDown={handleKeyDown}
                    onPointerEnter={() => setHovered(option)}
                    className={cn(
                      "absolute inset-y-0 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      step === 1
                        ? "inset-x-0"
                        : option % 1
                          ? "left-0 w-1/2"
                          : "right-0 w-1/2"
                    )}
                  />
                ))}
          </span>
        )
      })}
    </div>
  )
}

export { Rating }
