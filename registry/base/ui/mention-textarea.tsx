"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { flushSync } from "react-dom"

import { cn } from "@/registry/default/lib/utils"
import {
  filterMentionOptions,
  findActiveMention,
  insertMention,
  type MentionOption,
} from "@/registry/default/lib/mention"
import { useControllableState } from "@/registry/default/hooks/use-controllable-state"

function MentionTextarea({
  value,
  defaultValue = "",
  onValueChange,
  triggers,
  onKeyDown,
  className,
  ...props
}: Omit<
  React.ComponentProps<"textarea">,
  "value" | "defaultValue" | "onChange" | "onSelect"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  triggers: Record<string, MentionOption[]>
}) {
  const listId = React.useId()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const { value: text, setValue: setText } = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [caret, setCaret] = React.useState(0)
  const [dismissedStart, setDismissedStart] = React.useState<number | null>(
    null
  )
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  const mention = findActiveMention(text, caret, Object.keys(triggers))
  const options = mention
    ? filterMentionOptions(triggers[mention.trigger], mention.query)
    : []
  const isOpen =
    mention !== null && options.length > 0 && mention.start !== dismissedStart
  const mentionKey = mention ? `${mention.start}:${mention.query}` : ""
  const [previousMentionKey, setPreviousMentionKey] = React.useState(mentionKey)

  if (mentionKey !== previousMentionKey) {
    setPreviousMentionKey(mentionKey)
    setHighlightedIndex(0)
  }

  function selectOption(option: MentionOption) {
    if (!mention) return
    const next = insertMention(text, mention, caret, option)
    flushSync(() => {
      setText(next.text)
      setCaret(next.caret)
    })
    textareaRef.current?.setSelectionRange(next.caret, next.caret)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event)
    if (!isOpen || event.defaultPrevented) return

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault()
        const delta = event.key === "ArrowDown" ? 1 : -1
        setHighlightedIndex(
          (highlightedIndex + delta + options.length) % options.length
        )
        return
      }
      case "Enter":
      case "Tab":
        event.preventDefault()
        selectOption(options[highlightedIndex])
        return
      case "Escape":
        event.preventDefault()
        setDismissedStart(mention.start)
        return
    }
  }

  return (
    <PopoverPrimitive.Root
      open={isOpen}
      onOpenChange={(open, { event }) => {
        if (open || !mention || event.target === textareaRef.current) return
        setDismissedStart(mention.start)
      }}
    >
      <textarea
        ref={textareaRef}
        data-slot="mention-textarea"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={
          isOpen ? `${listId}-${highlightedIndex}` : undefined
        }
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          setCaret(event.target.selectionStart)
        }}
        onSelect={(event) => setCaret(event.currentTarget.selectionStart)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          className
        )}
        {...props}
      />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={textareaRef}
          align="start"
          sideOffset={4}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            initialFocus={false}
            finalFocus={false}
            className="z-50 w-64 origin-(--transform-origin) rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95"
          >
            <ul id={listId} role="listbox" data-slot="mention-textarea-list">
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onPointerDown={(event) => event.preventDefault()}
                  onPointerMove={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(option)}
                  className="flex cursor-default flex-col rounded-sm px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { MentionTextarea }
