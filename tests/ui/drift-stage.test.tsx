import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DriftStage } from "@/components/landing/drift-desk"

function stubViewport(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList)
}

describe("DriftStage", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("leaves the desk cards out below the desktop breakpoint", async () => {
    stubViewport(false)
    render(<DriftStage>Hero</DriftStage>)

    expect(screen.getByText("Hero")).toBeInTheDocument()
    await vi.dynamicImportSettled()
    expect(
      screen.queryByRole("group", { name: "Live drift-ui components" })
    ).not.toBeInTheDocument()
  })

  it("loads the desk cards at the desktop breakpoint", async () => {
    stubViewport(true)
    render(<DriftStage>Hero</DriftStage>)

    expect(
      await screen.findByRole("group", { name: "Live drift-ui components" })
    ).toBeInTheDocument()
  })
})
