"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/registry/default/lib/utils"
import { clampUnit, formatRgba, type Hsva } from "@/registry/default/lib/color"

const FINE_STEP = 0.01
const COARSE_STEP = 0.1

const CHECKERBOARD =
  "repeating-conic-gradient(#d4d4d4 0% 25%, #fff 0% 50%) 50% / 8px 8px"

const HUE_GRADIENT =
  "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"

const thumbClassName =
  "block size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.2),0_1px_3px_rgb(0_0_0/0.3)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

function areaKeyDelta(key: string) {
  switch (key) {
    case "ArrowLeft":
      return { saturation: -1, brightness: 0 }
    case "ArrowRight":
      return { saturation: 1, brightness: 0 }
    case "ArrowUp":
      return { saturation: 0, brightness: 1 }
    case "ArrowDown":
      return { saturation: 0, brightness: -1 }
    default:
      return null
  }
}

function ColorArea({
  hsva,
  onHsvaChange,
  className,
}: {
  hsva: Hsva
  onHsvaChange: (hsva: Hsva) => void
  className?: string
}) {
  const areaRef = React.useRef<HTMLDivElement>(null)
  const thumbRef = React.useRef<HTMLDivElement>(null)

  function updateFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    onHsvaChange({
      ...hsva,
      s: clampUnit((event.clientX - rect.left) / rect.width),
      v: 1 - clampUnit((event.clientY - rect.top) / rect.height),
    })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const delta = areaKeyDelta(event.key)
    if (!delta) return
    event.preventDefault()
    const step = event.shiftKey ? COARSE_STEP : FINE_STEP
    onHsvaChange({
      ...hsva,
      s: clampUnit(hsva.s + delta.saturation * step),
      v: clampUnit(hsva.v + delta.brightness * step),
    })
  }

  return (
    <div
      ref={areaRef}
      data-slot="color-area"
      onPointerDown={(event) => {
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        thumbRef.current?.focus()
        updateFromPointer(event)
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          updateFromPointer(event)
      }}
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsva.h} 100% 50%)`,
      }}
      className={cn(
        "relative h-40 w-full cursor-crosshair touch-none rounded-md",
        className
      )}
    >
      <div
        ref={thumbRef}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuenow={Math.round(hsva.s * 100)}
        aria-valuetext={`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`}
        onKeyDown={handleKeyDown}
        style={{
          left: `${hsva.s * 100}%`,
          top: `${(1 - hsva.v) * 100}%`,
          background: formatRgba({ ...hsva, a: 1 }),
        }}
        className={cn(thumbClassName, "absolute -translate-1/2")}
      />
    </div>
  )
}

function ColorSlider({
  value,
  max,
  step,
  trackBackground,
  onValueChange,
  "aria-label": ariaLabel,
}: {
  value: number
  max: number
  step: number
  trackBackground: string
  onValueChange: (value: number) => void
  "aria-label": string
}) {
  return (
    <SliderPrimitive.Root
      data-slot="color-slider"
      value={[value]}
      max={max}
      step={step}
      onValueChange={([next]) => onValueChange(next)}
      className="relative flex h-4 w-full touch-none items-center select-none"
    >
      <SliderPrimitive.Track
        style={{ background: trackBackground }}
        className="relative h-3 w-full grow overflow-hidden rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]"
      />
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        className={thumbClassName}
      />
    </SliderPrimitive.Root>
  )
}

function HueSlider({
  hsva,
  onHsvaChange,
}: {
  hsva: Hsva
  onHsvaChange: (hsva: Hsva) => void
}) {
  return (
    <ColorSlider
      aria-label="Hue"
      value={hsva.h}
      max={359}
      step={1}
      trackBackground={HUE_GRADIENT}
      onValueChange={(h) => onHsvaChange({ ...hsva, h })}
    />
  )
}

function AlphaSlider({
  hsva,
  onHsvaChange,
}: {
  hsva: Hsva
  onHsvaChange: (hsva: Hsva) => void
}) {
  const opaque = formatRgba({ ...hsva, a: 1 })

  return (
    <ColorSlider
      aria-label="Opacity"
      value={hsva.a}
      max={1}
      step={FINE_STEP}
      trackBackground={`linear-gradient(to right, transparent, ${opaque}), ${CHECKERBOARD}`}
      onValueChange={(a) => onHsvaChange({ ...hsva, a })}
    />
  )
}

function ColorSwatch({
  color,
  className,
  ...props
}: React.ComponentProps<"span"> & { color: string }) {
  return (
    <span
      data-slot="color-swatch"
      style={{
        background: `linear-gradient(${color}, ${color}), ${CHECKERBOARD}`,
      }}
      className={cn(
        "inline-block size-5 shrink-0 rounded-sm shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]",
        className
      )}
      {...props}
    />
  )
}

export { AlphaSlider, ColorArea, ColorSwatch, HueSlider }
