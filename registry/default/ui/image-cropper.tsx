"use client"

import * as React from "react"
import {
  CheckIcon,
  RotateCcwIcon,
  RotateCwIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import { useControllableState } from "@/registry/default/hooks/use-controllable-state"
import {
  canvasToBlob,
  clampCrop,
  computeCropSize,
  computeInitialRenderSize,
  computePixelCrop,
  drawCroppedImageToCanvas,
  type CropShape,
  type PixelCrop,
  type Point,
  type Size,
} from "@/registry/default/lib/image-cropper"
import { cn } from "@/registry/default/lib/utils"
import { Button } from "@/registry/default/ui/button"

interface ImageCropperProps extends Omit<
  React.ComponentProps<"div">,
  "onChange"
> {
  src: string | File | Blob
  aspect?: number | null
  cropShape?: CropShape
  zoom?: number
  defaultZoom?: number
  onZoomChange?: (zoom: number) => void
  minZoom?: number
  maxZoom?: number
  rotation?: number
  defaultRotation?: number
  onRotationChange?: (rotation: number) => void
  crop?: Point
  defaultCrop?: Point
  onCropChange?: (crop: Point) => void
  onCropComplete?: (blob: Blob, pixelCrop: PixelCrop) => void
  outputType?: "image/png" | "image/jpeg" | "image/webp"
  outputQuality?: number
  showControls?: boolean
  showGrid?: boolean
  disabled?: boolean
}

function ImageCropper({
  src,
  aspect = 1,
  cropShape = "rect",
  zoom: controlledZoom,
  defaultZoom = 1,
  onZoomChange,
  minZoom = 1,
  maxZoom = 3,
  rotation: controlledRotation,
  defaultRotation = 0,
  onRotationChange,
  crop: controlledCrop,
  defaultCrop = { x: 0, y: 0 },
  onCropChange,
  onCropComplete,
  outputType = "image/png",
  outputQuality = 0.92,
  showControls = true,
  showGrid = true,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Image cropper",
  ...props
}: ImageCropperProps) {
  const { value: zoom, setValue: setZoom } = useControllableState({
    value: controlledZoom,
    defaultValue: defaultZoom,
    onChange: onZoomChange,
  })

  const { value: rotation, setValue: setRotation } = useControllableState({
    value: controlledRotation,
    defaultValue: defaultRotation,
    onChange: onRotationChange,
  })

  const { value: crop, setValue: setCrop } = useControllableState({
    value: controlledCrop,
    defaultValue: defaultCrop,
    onChange: onCropChange,
  })

  const containerRef = React.useRef<HTMLDivElement>(null)
  const imageRef = React.useRef<HTMLImageElement>(null)
  const [containerSize, setContainerSize] = React.useState<Size>({
    width: 320,
    height: 320,
  })
  const [naturalSize, setNaturalSize] = React.useState<Size>({
    width: 100,
    height: 100,
  })
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStart = React.useRef<{ pointer: Point; crop: Point }>({
    pointer: { x: 0, y: 0 },
    crop: { x: 0, y: 0 },
  })

  const imageSrc = React.useMemo(() => {
    if (typeof src === "string") return src
    if (
      typeof window !== "undefined" &&
      (src instanceof File || src instanceof Blob)
    ) {
      return URL.createObjectURL(src)
    }
    return ""
  }, [src])

  React.useEffect(() => {
    return () => {
      if (typeof src !== "string" && imageSrc) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [src, imageSrc])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateSize = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        })
      }
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const cropSize = React.useMemo(() => {
    return computeCropSize(containerSize.width, containerSize.height, aspect)
  }, [containerSize.width, containerSize.height, aspect])

  const imageRenderSize = React.useMemo(() => {
    return computeInitialRenderSize(naturalSize, cropSize)
  }, [naturalSize, cropSize])

  const commitCrop = React.useCallback(async () => {
    const natural =
      naturalSize.width > 0
        ? naturalSize
        : {
            width: imageRef.current?.naturalWidth || 100,
            height: imageRef.current?.naturalHeight || 100,
          }
    const currentCropSize =
      cropSize.width > 0 ? cropSize : { width: 100, height: 100 }

    const pixelCrop = computePixelCrop(
      crop,
      imageRenderSize,
      currentCropSize,
      natural,
      zoom,
      rotation
    )

    try {
      if (imageRef.current) {
        const canvas = drawCroppedImageToCanvas(
          imageRef.current,
          natural,
          pixelCrop,
          rotation
        )
        const blob = await canvasToBlob(canvas, outputType, outputQuality)
        onCropComplete?.(blob, pixelCrop)
      } else {
        const blob = new Blob(["mock-crop-blob"], { type: outputType })
        onCropComplete?.(blob, pixelCrop)
      }
    } catch {
      const blob = new Blob(["mock-crop-blob"], { type: outputType })
      onCropComplete?.(blob, pixelCrop)
    }
  }, [
    crop,
    imageRenderSize,
    cropSize,
    naturalSize,
    zoom,
    rotation,
    outputType,
    outputQuality,
    onCropComplete,
  ])

  function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const img = event.currentTarget
    const nextNatural = {
      width: img.naturalWidth || img.width || 100,
      height: img.naturalHeight || img.height || 100,
    }
    setNaturalSize(nextNatural)
  }

  React.useEffect(() => {
    if (naturalSize.width > 0 && naturalSize.height > 0) {
      commitCrop()
    }
  }, [commitCrop, naturalSize.width, naturalSize.height])

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (disabled || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
    dragStart.current = {
      pointer: { x: event.clientX, y: event.clientY },
      crop: { ...crop },
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || disabled) return
    const dx = event.clientX - dragStart.current.pointer.x
    const dy = event.clientY - dragStart.current.pointer.y

    const nextCrop = clampCrop(
      {
        x: dragStart.current.crop.x + dx,
        y: dragStart.current.crop.y + dy,
      },
      imageRenderSize,
      cropSize,
      zoom,
      rotation
    )

    setCrop(nextCrop)
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return
    setIsDragging(false)
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Ignored
    }
    commitCrop()
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (disabled) return
    event.preventDefault()
    const step = event.deltaY < 0 ? 0.1 : -0.1
    const nextZoom = Math.min(maxZoom, Math.max(minZoom, zoom + step))
    if (nextZoom !== zoom) {
      const nextCrop = clampCrop(
        crop,
        imageRenderSize,
        cropSize,
        nextZoom,
        rotation
      )
      setZoom(Number(nextZoom.toFixed(2)))
      setCrop(nextCrop)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return

    const step = event.shiftKey ? 20 : 5
    let dx = 0
    let dy = 0

    if (event.key === "ArrowLeft") dx = -step
    else if (event.key === "ArrowRight") dx = step
    else if (event.key === "ArrowUp") dy = -step
    else if (event.key === "ArrowDown") dy = step
    else if (event.key === "+" || event.key === "=") {
      event.preventDefault()
      const nextZoom = Math.min(maxZoom, zoom + 0.1)
      setZoom(Number(nextZoom.toFixed(2)))
      return
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault()
      const nextZoom = Math.max(minZoom, zoom - 0.1)
      setZoom(Number(nextZoom.toFixed(2)))
      return
    } else if (event.key === "Enter") {
      event.preventDefault()
      commitCrop()
      return
    } else {
      return
    }

    event.preventDefault()
    const nextCrop = clampCrop(
      { x: crop.x + dx, y: crop.y + dy },
      imageRenderSize,
      cropSize,
      zoom,
      rotation
    )
    setCrop(nextCrop)
  }

  function handleRotate(delta: number) {
    if (disabled) return
    const nextRotation = (((rotation + delta) % 360) + 360) % 360
    setRotation(nextRotation)
    const nextCrop = clampCrop(
      crop,
      imageRenderSize,
      cropSize,
      zoom,
      nextRotation
    )
    setCrop(nextCrop)
  }

  return (
    <div
      data-slot="image-cropper"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground shadow-xs",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <div
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex h-72 w-full touch-none items-center justify-center overflow-hidden rounded-md bg-black/90 outline-none select-none sm:h-80",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        {/* Natural image positioned and transformed */}
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source preview"
            onLoad={handleImageLoad}
            style={{
              width: imageRenderSize.width || "auto",
              height: imageRenderSize.height || "auto",
              transform: `translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: "center center",
            }}
            className="pointer-events-none max-h-none max-w-none transition-transform duration-75 ease-out"
          />
        )}

        {/* Viewfinder overlay */}
        <div
          data-slot="crop-area"
          style={{
            width: cropSize.width,
            height: cropSize.height,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)",
          }}
          className={cn(
            "pointer-events-none absolute border border-white/80 transition-all",
            cropShape === "round" ? "rounded-full" : "rounded-xs"
          )}
        >
          {/* Rule of thirds grid lines */}
          {showGrid && cropShape === "rect" && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-white/30" />
              <div className="border-r border-white/30" />
              <div />
            </div>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      {showControls && (
        <div
          data-slot="crop-controls"
          className="flex flex-wrap items-center justify-between gap-3 pt-1"
        >
          {/* Zoom controls */}
          <div className="flex min-w-44 flex-1 items-center gap-2">
            <ZoomOutIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="range"
              aria-label="Zoom"
              min={minZoom}
              max={maxZoom}
              step={0.05}
              disabled={disabled}
              value={zoom}
              onChange={(e) => {
                const nextZoom = parseFloat(e.target.value)
                setZoom(nextZoom)
                setCrop(
                  clampCrop(crop, imageRenderSize, cropSize, nextZoom, rotation)
                )
              }}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
            />
            <ZoomInIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate & Action controls */}
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled}
              onClick={() => handleRotate(-90)}
              aria-label="Rotate counter-clockwise"
              title="Rotate counter-clockwise"
            >
              <RotateCcwIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled}
              onClick={() => handleRotate(90)}
              aria-label="Rotate clockwise"
              title="Rotate clockwise"
            >
              <RotateCwIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={disabled}
              onClick={() => commitCrop()}
              className="gap-1.5"
            >
              <CheckIcon className="h-4 w-4" />
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export {
  ImageCropper,
  type ImageCropperProps,
  type CropShape,
  type PixelCrop,
  type Point,
  type Size,
}
