import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { MissingPathCommand } from "@/components/not-found/missing-path-command"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist on drift-ui.",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="dark flex min-h-dvh flex-col bg-background text-foreground scheme-dark">
      <SiteNav />
      <main className="relative isolate flex flex-1 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_100%,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent)]" />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-8 -bottom-16 -z-10 font-mono text-[14rem] leading-none font-medium tracking-tighter text-foreground/[0.04] select-none md:text-[24rem]"
        >
          404
        </span>
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-center gap-10 px-4 py-20 md:px-10 md:py-32">
          <p className="rise font-mono text-xs text-muted-foreground">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-destructive align-middle" />
            error 404, page not found
          </p>
          <h1 className="max-w-3xl rise text-5xl leading-[1.02] font-medium tracking-tight [--rise-delay:80ms] md:text-[4rem]">
            This page is not
            <br />
            <span className="text-muted-foreground">in the registry.</span>
          </h1>
          <p className="max-w-[46ch] rise text-base leading-relaxed text-muted-foreground [--rise-delay:160ms] md:text-lg">
            The link may be broken, or the page may have moved. Head back to the
            start or browse the components that do exist.
          </p>
          <MissingPathCommand className="rise [--rise-delay:240ms]" />
          <div className="flex rise flex-col gap-3 [--rise-delay:320ms] sm:flex-row sm:items-center">
            <Button asChild size="lg" className="active:scale-[0.98]">
              <Link href="/">
                <ArrowLeftIcon /> Back home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="active:scale-[0.98]"
            >
              <Link href="/components">
                Browse components <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
