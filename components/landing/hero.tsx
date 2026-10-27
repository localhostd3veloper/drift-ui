import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { ComponentWall } from "@/components/landing/component-wall"
import { CopyCommand } from "@/components/landing/copy-command"
import { HeroPanel } from "@/components/landing/hero-panel"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <ComponentWall className="absolute inset-0 -z-10 hidden lg:block" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--background)_28%,color-mix(in_oklab,var(--background)_70%,transparent)_48%,transparent_72%),linear-gradient(to_top,var(--background),transparent_28%)]" />
      <div className="absolute top-[-20%] right-[-10%] -z-10 aspect-square w-280 max-w-[140vw] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_14%,transparent),transparent)]" />
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pt-14 pb-20 md:px-10 md:pt-20 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-12 lg:pt-12 lg:pb-16">
        <div className="flex flex-col">
          <p className="mb-6 rise font-mono text-xs text-muted-foreground">
            shadcn registry, namespace{" "}
            <span className="text-brand">@drift-ui</span>
          </p>
          <h1 className="rise text-5xl leading-[1.02] font-medium tracking-tighter [--rise-delay:80ms] md:text-6xl lg:text-5xl xl:text-6xl">
            <span className="block sm:whitespace-nowrap">The components</span>
            <span className="block sm:whitespace-nowrap">shadcn left out</span>
          </h1>
          <p className="mt-6 max-w-[40ch] rise text-base leading-relaxed text-muted-foreground [--rise-delay:160ms] md:text-lg">
            Tags input, stepper, tree view and 13 more. Built on Radix, styled
            by your tokens, installed with the shadcn CLI.
          </p>
          <div className="mt-10 flex rise flex-col gap-3 [--rise-delay:240ms] sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild size="lg" className="active:scale-[0.98]">
              <Link href="/components">
                Browse components <ArrowRightIcon />
              </Link>
            </Button>
            <CopyCommand command="npx shadcn add @drift-ui/tags-input" />
          </div>
        </div>
        <HeroPanel className="rise [--rise-delay:360ms]" />
      </div>
    </section>
  )
}
