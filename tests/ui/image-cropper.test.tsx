import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ImageCropper } from "@/registry/default/ui/image-cropper"

describe("ImageCropper", () => {
  const sampleSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='blue'/%3E%3C/svg%3E"

  it("renders with accessible region and source image", () => {
    render(<ImageCropper src={sampleSrc} aria-label="Avatar cropper" />)

    const region = screen.getByRole("region", { name: "Avatar cropper" })
    expect(region).toBeInTheDocument()

    const img = screen.getByAltText("Source preview")
    expect(img).toHaveAttribute("src", sampleSrc)
  })

  it("applies rounded-full mask class when cropShape is round", () => {
    const { container } = render(
      <ImageCropper src={sampleSrc} cropShape="round" />
    )

    const cropArea = container.querySelector('[data-slot="crop-area"]')
    expect(cropArea).toHaveClass("rounded-full")
  })

  it("supports zoom slider interaction", async () => {
    const user = userEvent.setup()
    const onZoomChange = vi.fn()

    render(
      <ImageCropper
        src={sampleSrc}
        defaultZoom={1}
        onZoomChange={onZoomChange}
      />
    )

    const slider = screen.getByRole("slider", { name: "Zoom" })
    expect(slider).toHaveValue("1")

    // Update slider value
    await user.click(slider)
    expect(slider).toBeInTheDocument()
  })

  it("rotates image clockwise and counter-clockwise", async () => {
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
  })

  it("handles keyboard panning with arrow keys", async () => {
    const user = userEvent.setup()
    const onCropChange = vi.fn()

    render(
      <ImageCropper
        src={sampleSrc}
        defaultZoom={2} // Zoomed in so pan boundaries > 0
        onCropChange={onCropChange}
      />
    )

    const region = screen.getByRole("region", { name: "Image cropper" })
    region.focus()

    await user.keyboard("{ArrowRight}")
    expect(onCropChange).toHaveBeenCalled()

    await user.keyboard("{ArrowDown}")
    expect(onCropChange).toHaveBeenCalled()
  })

  it("calls onCropComplete when clicking Apply button", async () => {
    const user = userEvent.setup()
    const onCropComplete = vi.fn()

    render(<ImageCropper src={sampleSrc} onCropComplete={onCropComplete} />)

    const applyButton = screen.getByRole("button", { name: "Apply" })
    await user.click(applyButton)

    await waitFor(() => {
      expect(onCropComplete).toHaveBeenCalled()
    })
  })

  it("disables interaction when disabled is true", () => {
    render(<ImageCropper src={sampleSrc} disabled />)

    const slider = screen.getByRole("slider", { name: "Zoom" })
    expect(slider).toBeDisabled()

    const applyButton = screen.getByRole("button", { name: "Apply" })
    expect(applyButton).toBeDisabled()

    const region = screen.getByRole("region", { name: "Image cropper" })
    expect(region).toHaveAttribute("tabindex", "-1")
  })
})
