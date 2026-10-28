import { NextResponse, type NextRequest } from "next/server"

import {
  componentPath,
  DEFAULT_PRIMITIVE_LIBRARY,
  isPrimitiveLibrary,
  PRIMITIVE_LIBRARY_COOKIE,
} from "@/lib/primitive-library"

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2]
  if (isPrimitiveLibrary(slug)) {
    return NextResponse.redirect(new URL("/components", request.url))
  }

  const preferred = request.cookies.get(PRIMITIVE_LIBRARY_COOKIE)?.value
  const library = isPrimitiveLibrary(preferred)
    ? preferred
    : DEFAULT_PRIMITIVE_LIBRARY

  return NextResponse.redirect(
    new URL(componentPath(slug, library), request.url)
  )
}

export const config = {
  matcher: "/components/:slug",
}
