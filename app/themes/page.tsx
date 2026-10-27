import type { Metadata } from "next"

import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { ShowcaseCanvas } from "@/components/showcase/showcase-canvas"
import { ShowcaseWorkbench } from "@/components/showcase/showcase-workbench"
import { CATALOG } from "@/lib/catalog"
import { createPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Themes",
  description:
    "Try every drift-ui component in your own theme. Pick a preset or paste your shadcn globals.css and the whole set restyles to match.",
  path: "/themes",
})

export default function ThemesPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-[110rem] flex-1 flex-col gap-8 px-2 pt-10 pb-24 md:px-4 md:pt-14">
        <header className="flex flex-col gap-3 px-2 md:px-6">
          <h1 className="rise text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl">
            Themes
          </h1>
          <p className="max-w-[60ch] rise text-lg leading-relaxed text-muted-foreground [--rise-delay:80ms]">
            Pick a preset or paste your globals.css and all {CATALOG.length}{" "}
            components restyle to match. Every card here is the real component,
            so try them in your theme before you install.
          </p>
        </header>
        <ShowcaseWorkbench>
          <ShowcaseCanvas />
        </ShowcaseWorkbench>
      </main>
      <SiteFooter />
    </div>
  )
}
