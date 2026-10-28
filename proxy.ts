import { NextResponse, type NextRequest } from "next/server"

import { PRIMITIVE_LIBRARY_COOKIE } from "@/lib/primitive-library"

const BASE_UI_SUFFIX = "/base"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.endsWith(BASE_UI_SUFFIX)) {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -BASE_UI_SUFFIX.length), request.url)
    )
  }

  if (request.cookies.get(PRIMITIVE_LIBRARY_COOKIE)?.value === "base") {
    return NextResponse.rewrite(
      new URL(`${pathname}${BASE_UI_SUFFIX}`, request.url)
    )
  }
}

export const config = {
  matcher: ["/components/:slug", "/components/:slug/base"],
}
