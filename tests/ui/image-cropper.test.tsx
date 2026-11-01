import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ImageCropper } from "@/registry/default/ui/image-cropper"

describe("ImageCropper", () => {
  const sampleSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='blue'/%3E%3C/svg%3E"

  beforeEach(() => {
    HTMLCanvasElement.prototype.toBlob = vi.fn(function (
      this: HTMLCanvasElement,
      callback: (blob: Blob | null) => void,
      type = "image/png"
    ) {
      callback(new Blob(["mock-canvas-content"], { type }))
    }) as unknown as typeof HTMLCanvasElement.prototype.toBlob
  })

  it("renders with accessible region, source image, and keyboard instructions", () => {
    render(<ImageCropper src={sampleSrc} aria-label="Avatar cropper" />)

    const region = screen.getByRole("region", { name: "Avatar cropper" })
    expect(region).toBeInTheDocument()
    expect(region).toHaveAttribute("aria-describedby")

    const img = screen.getByAltText("Source preview")
    expect(img).toHaveAttribute("src", sampleSrc)
    expect(img).toHaveAttribute("crossorigin", "anonymous")
  })

  it("applies rounded-full mask class when cropShape is round", () => {
    const { container } = render(
      <ImageCropper src={sampleSrc} cropShape="round" />
    )

    const cropArea = container.querySelector('[data-slot="crop-area"]')
    expect(cropArea).toHaveClass("rounded-full")
  })

  it("supports zoom slider interaction and reports zoom change value", async () => {
    const onZoomChange = vi.fn()

    render(
      <ImageCropper
        src={sampleSrc}
        defaultZoom={1}
        onZoomChange={onZoomChange}
      />
    )

    const slider = screen.getByRole("slider", { name: "Zoom level" })
    expect(slider).toHaveValue("1")
    expect(slider).toHaveAttribute("aria-valuetext", "100%")

    fireEvent.change(slider, { target: { value: "1.5" } })
    expect(onZoomChange).toHaveBeenCalledWith(1.5)
    expect(slider).toHaveAttribute("aria-valuetext", "150%")
  })

  it("rotates image clockwise and counter-clockwise with buttons and keyboard", async () => {
    const user = userEvent.setup()
    const onRotationChange = vi.fn()

    render(
      <ImageCropper
        src={sampleSrc}
        defaultRotation={0}
        onRotationChange={onRotationChange}
      />
    )

    const rotateCw = screen.getByRole("button", { name: "Rotate clockwise" })
    await user.click(rotateCw)
    expect(onRotationChange).toHaveBeenCalledWith(90)

    const rotateCcw = screen.getByRole("button", {
      name: "Rotate counter-clockwise",
    })
    await user.click(rotateCcw)
    expect(onRotationChange).toHaveBeenCalledWith(0)

    const region = screen.getByRole("region", { name: "Image cropper" })
    region.focus()
    await user.keyboard("r")
    expect(onRotationChange).toHaveBeenCalledWith(90)
  })

  it("handles keyboard panning with 10x multiplier on Shift key", async () => {
    const user = userEvent.setup()
    const onCropChange = vi.fn()

    render(
      <ImageCropper
        src={sampleSrc}
        defaultZoom={2}
        onCropChange={onCropChange}
      />
    )

    const region = screen.getByRole("region", { name: "Image cropper" })
    region.focus()

    await user.keyboard("{ArrowRight}")
    expect(onCropChange).toHaveBeenCalledWith(expect.objectContaining({ x: 5 }))

    await user.keyboard("{Shift>}{ArrowRight}{/Shift}")
    expect(onCropChange).toHaveBeenCalledWith(
      expect.objectContaining({ x: 55 })
    )
  })

  it("handles keyboard zoom shortcuts (+, -, [, ])", async () => {
    const user = userEvent.setup()
    const onZoomChange = vi.fn()

    render(
      <ImageCropper
        src={sampleSrc}
        defaultZoom={1.5}
        onZoomChange={onZoomChange}
      />
    )

    const region = screen.getByRole("region", { name: "Image cropper" })
    region.focus()

    await user.keyboard("+")
    expect(onZoomChange).toHaveBeenCalledWith(1.6)

    fireEvent.keyDown(region, { key: "[" })
    expect(onZoomChange).toHaveBeenCalledWith(1.5)

    fireEvent.keyDown(region, { key: "]" })
    expect(onZoomChange).toHaveBeenCalledWith(1.6)

    await user.keyboard("-")
    expect(onZoomChange).toHaveBeenCalledWith(1.5)
  })

  it("re-clamps crop when zooming out after panning", async () => {
    const onCropChange = vi.fn()

    render(
      <ImageCropper
        src={sampleSrc}
        defaultZoom={2}
        onCropChange={onCropChange}
      />
    )

    const img = screen.getByAltText("Source preview")
    Object.defineProperty(img, "naturalWidth", {
      value: 400,
      configurable: true,
    })
    Object.defineProperty(img, "naturalHeight", {
      value: 400,
      configurable: true,
    })
    fireEvent.load(img)

    // Pan right while zoomed in
    const region = screen.getByRole("region", { name: "Image cropper" })
    region.focus()
    fireEvent.keyDown(region, { key: "ArrowRight", shiftKey: true })

    expect(onCropChange).toHaveBeenCalledWith(
      expect.objectContaining({ x: 50 })
    )

    // Now zoom back out to 1 using slider
    const slider = screen.getByRole("slider", { name: "Zoom level" })
    fireEvent.change(slider, { target: { value: "1" } })

    // At zoom 1 with 1:1 aspect, maxPanX is 0, so crop must be clamped back to 0
    expect(onCropChange).toHaveBeenLastCalledWith({ x: 0, y: 0 })
  })

  it("does not call onCropComplete on mount, only on Apply button click or Enter key", async () => {
    const user = userEvent.setup()
    const onCropComplete = vi.fn()

    render(<ImageCropper src={sampleSrc} onCropComplete={onCropComplete} />)

    const img = screen.getByAltText("Source preview")
    Object.defineProperty(img, "naturalWidth", {
      value: 200,
      configurable: true,
    })
    Object.defineProperty(img, "naturalHeight", {
      value: 200,
      configurable: true,
    })
    fireEvent.load(img)

    // Verify it did NOT auto-trigger on mount or load
    expect(onCropComplete).not.toHaveBeenCalled()

    const applyButton = screen.getByRole("button", { name: "Apply" })
    await user.click(applyButton)

    await waitFor(() => {
      expect(onCropComplete).toHaveBeenCalledTimes(1)
      expect(onCropComplete).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.objectContaining({
          width: expect.any(Number),
          height: expect.any(Number),
        })
      )
    })

    // Test Enter key triggers commitCrop
    const region = screen.getByRole("region", { name: "Image cropper" })
    region.focus()
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(onCropComplete).toHaveBeenCalledTimes(2)
    })
  })

  it("handles image load failure by calling onCropError", () => {
    const onCropError = vi.fn()
    render(<ImageCropper src="invalid-url" onCropError={onCropError} />)

    const img = screen.getByAltText("Source preview")
    fireEvent.error(img)

    expect(onCropError).toHaveBeenCalledWith(expect.any(Error))
  })

  it("disables interaction when disabled is true", () => {
    render(<ImageCropper src={sampleSrc} disabled />)

    const slider = screen.getByRole("slider", { name: "Zoom level" })
    expect(slider).toBeDisabled()

    const applyButton = screen.getByRole("button", { name: "Apply" })
    expect(applyButton).toBeDisabled()

    const region = screen.getByRole("region", { name: "Image cropper" })
    expect(region).toHaveAttribute("tabindex", "-1")
  })
})
