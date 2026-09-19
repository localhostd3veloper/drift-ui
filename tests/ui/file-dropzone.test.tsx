import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  FileDropzone,
  FileDropzoneItem,
  FileDropzoneList,
  formatBytes,
} from "@/registry/default/ui/file-dropzone"

function makeFile(name: string, type: string, sizeBytes = 4) {
  return new File([new Uint8Array(sizeBytes)], name, { type })
}

function dropzone() {
  return document.querySelector("[data-slot=file-dropzone]") as HTMLElement
}

describe("FileDropzone", () => {
  it("sorts dropped files into accepted and rejected with a reason", () => {
    const onFilesAccepted = vi.fn()
    const onFilesRejected = vi.fn()
    render(
      <FileDropzone
        accept=".pdf,image/*"
        maxSize={1024}
        onFilesAccepted={onFilesAccepted}
        onFilesRejected={onFilesRejected}
      />
    )
    const pdf = makeFile("contract.pdf", "application/pdf")
    const photo = makeFile("photo.jpg", "image/jpeg")
    const notes = makeFile("notes.txt", "text/plain")
    const huge = makeFile("huge.png", "image/png", 2048)

    fireEvent.drop(dropzone(), {
      dataTransfer: { files: [pdf, photo, notes, huge] },
    })

    expect(onFilesAccepted).toHaveBeenCalledWith([pdf, photo])
    expect(onFilesRejected).toHaveBeenCalledWith([
      { file: notes, reason: "type" },
      { file: huge, reason: "size" },
    ])
  })

  it("rejects files beyond maxFiles and keeps only the first when multiple is off", () => {
    const onFilesAccepted = vi.fn()
    const onFilesRejected = vi.fn()
    const files = [
      makeFile("a.pdf", "application/pdf"),
      makeFile("b.pdf", "application/pdf"),
      makeFile("c.pdf", "application/pdf"),
    ]
    const { rerender } = render(
      <FileDropzone
        maxFiles={2}
        onFilesAccepted={onFilesAccepted}
        onFilesRejected={onFilesRejected}
      />
    )

    fireEvent.drop(dropzone(), { dataTransfer: { files } })
    expect(onFilesAccepted).toHaveBeenLastCalledWith(files.slice(0, 2))
    expect(onFilesRejected).toHaveBeenLastCalledWith([
      { file: files[2], reason: "count" },
    ])

    rerender(
      <FileDropzone multiple={false} onFilesAccepted={onFilesAccepted} />
    )
    fireEvent.drop(dropzone(), { dataTransfer: { files } })
    expect(onFilesAccepted).toHaveBeenLastCalledWith(files.slice(0, 1))
  })

  it("marks the zone while dragging and clears it on drop", () => {
    render(<FileDropzone />)

    fireEvent.dragEnter(dropzone(), { dataTransfer: { files: [] } })
    expect(dropzone()).toHaveAttribute("data-dragging")

    fireEvent.drop(dropzone(), { dataTransfer: { files: [] } })
    expect(dropzone()).not.toHaveAttribute("data-dragging")
  })

  it("accepts files picked through the focusable file input", async () => {
    const user = userEvent.setup()
    const onFilesAccepted = vi.fn()
    render(
      <FileDropzone accept="image/png" onFilesAccepted={onFilesAccepted} />
    )
    const input = document.querySelector("input[type=file]") as HTMLInputElement
    const image = makeFile("logo.png", "image/png")

    await user.upload(input, image)

    expect(onFilesAccepted).toHaveBeenCalledWith([image])
    expect(input.tabIndex).toBe(0)
  })

  it("ignores drops while disabled", () => {
    const onFilesAccepted = vi.fn()
    render(<FileDropzone disabled onFilesAccepted={onFilesAccepted} />)

    fireEvent.drop(dropzone(), {
      dataTransfer: { files: [makeFile("a.pdf", "application/pdf")] },
    })

    expect(onFilesAccepted).not.toHaveBeenCalled()
  })
})

describe("FileDropzoneItem", () => {
  it("shows progress while uploading, then the size, and an error when invalid", () => {
    const { rerender } = render(
      <FileDropzoneList>
        <FileDropzoneItem name="deck.pdf" size={2_516_582} progress={40} />
      </FileDropzoneList>
    )
    expect(
      screen.getByRole("progressbar", { name: "Uploading deck.pdf" })
    ).toHaveAttribute("aria-valuenow", "40")
    expect(screen.getByText("40%")).toBeInTheDocument()

    rerender(
      <FileDropzoneList>
        <FileDropzoneItem name="deck.pdf" size={2_516_582} progress={100} />
        <FileDropzoneItem name="notes.txt" size={12} error="Only PDF files" />
      </FileDropzoneList>
    )
    expect(screen.queryByRole("progressbar")).toBeNull()
    expect(screen.getByText("2.4 MB")).toBeInTheDocument()
    expect(screen.getByText("Only PDF files").closest("li")).toHaveAttribute(
      "data-invalid"
    )
  })

  it("calls onRemove from the labelled remove button", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<FileDropzoneItem name="deck.pdf" size={10} onRemove={onRemove} />)

    await user.click(screen.getByRole("button", { name: "Remove deck.pdf" }))

    expect(onRemove).toHaveBeenCalledOnce()
  })
})

describe("formatBytes", () => {
  it("picks a readable unit", () => {
    expect(formatBytes(0)).toBe("0 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(20 * 1024 * 1024)).toBe("20 MB")
  })
})
