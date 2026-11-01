import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  ResourcesBrowser,
  type ResourceListing,
} from "@/components/resources/resources-browser"

const TAGS = ["Accessibility", "Students"]

const LISTINGS: ResourceListing[] = [
  {
    slug: "tree",
    tags: ["Accessibility"],
    searchText: "fixing the tree accessibility",
    row: <a href="/tree">Tree row</a>,
  },
  {
    slug: "semester",
    tags: ["Students"],
    searchText: "one semester students",
    row: <a href="/semester">Semester row</a>,
  },
  {
    slug: "license",
    tags: ["Students"],
    searchText: "what a license means students",
    row: <a href="/license">License row</a>,
  },
]

function renderBrowser() {
  return render(
    <ResourcesBrowser
      tags={TAGS}
      feature={<a href="/tree">Featured post</a>}
      listings={LISTINGS}
    />
  )
}

const link = (name: string) => screen.queryByRole("link", { name })

afterEach(() => {
  vi.useRealTimers()
  window.history.replaceState(null, "", "/")
})

describe("ResourcesBrowser", () => {
  it("shows the newest post as the feature and the rest as rows", () => {
    renderBrowser()

    expect(link("Featured post")).toBeInTheDocument()
    expect(link("Tree row")).not.toBeInTheDocument()
    expect(link("Semester row")).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("3 posts")
  })

  it("filters by tag, swapping the feature for rows", async () => {
    const user = userEvent.setup()
    renderBrowser()

    await user.click(screen.getByRole("radio", { name: /Accessibility/ }))

    expect(link("Featured post")).not.toBeInTheDocument()
    expect(link("Tree row")).toBeInTheDocument()
    expect(link("Semester row")).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("1 post")
  })

  it("combines search with the active tag", async () => {
    const user = userEvent.setup()
    renderBrowser()

    await user.click(screen.getByRole("radio", { name: /Students/ }))
    await user.type(screen.getByRole("searchbox"), "LICENSE")

    expect(link("License row")).toBeInTheDocument()
    expect(link("Semester row")).not.toBeInTheDocument()
  })

  it("counts tags against the search", async () => {
    const user = userEvent.setup()
    renderBrowser()

    await user.type(screen.getByRole("searchbox"), "semester")

    expect(screen.getByRole("radio", { name: /Students/ })).toHaveTextContent(
      "Students1"
    )
    expect(
      screen.getByRole("radio", { name: /Accessibility/ })
    ).toHaveTextContent("Accessibility0")
  })

  it("resets from the empty state", async () => {
    const user = userEvent.setup()
    renderBrowser()

    await user.type(screen.getByRole("searchbox"), "nothing here")
    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Show all posts" }))
    expect(link("Featured post")).toBeInTheDocument()
  })

  it("reads the tag and query from the url", () => {
    window.history.replaceState(null, "", "/resources?tag=Students&q=license")
    renderBrowser()

    expect(link("License row")).toBeInTheDocument()
    expect(link("Semester row")).not.toBeInTheDocument()
    expect(screen.getByRole("searchbox")).toHaveValue("license")
  })

  it("ignores an unknown tag in the url", () => {
    window.history.replaceState(null, "", "/resources?tag=Nope")
    renderBrowser()

    expect(link("Featured post")).toBeInTheDocument()
  })

  it("writes filters back to the url", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderBrowser()

    await user.click(screen.getByRole("radio", { name: /Students/ }))
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(window.location.search).toBe("?tag=Students")
  })
})
