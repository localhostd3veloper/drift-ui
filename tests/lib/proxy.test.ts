import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

import { proxy } from "@/proxy"

function redirectFor(pathname: string, cookie?: string) {
  const request = new NextRequest(new URL(pathname, "https://drift-ui.dev"), {
    headers: cookie ? { cookie } : undefined,
  })
  return new URL(proxy(request).headers.get("location") ?? "").pathname
}

describe("component page redirect", () => {
  it("sends an unprefixed component URL to Base UI by default", () => {
    expect(redirectFor("/components/stepper")).toBe("/components/base/stepper")
  })

  it("remembers the library picked last", () => {
    expect(
      redirectFor("/components/stepper", "drift-ui-primitives=radix")
    ).toBe("/components/radix/stepper")
  })

  it("ignores an unknown library in the cookie", () => {
    expect(redirectFor("/components/stepper", "drift-ui-primitives=aria")).toBe(
      "/components/base/stepper"
    )
  })

  it("sends a bare library path to the component index", () => {
    expect(redirectFor("/components/radix")).toBe("/components")
  })
})
