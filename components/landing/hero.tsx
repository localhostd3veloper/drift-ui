import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { ComponentWall } from "@/components/landing/component-wall"
import { CopyCommand } from "@/components/landing/copy-command"
import { HeroPanel } from "@/components/landing/hero-panel"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <ComponentWall className="absolute inset-x-0 top-0 -z-10 h-275" />
      <div className="absolute inset-x-0 top-0 -z-10 h-275 bg-[linear-gradient(to_right,var(--background)_40%,color-mix(in_oklab,var(--background)_75%,transparent)_58%,transparent_78%),linear-gradient(to_top,var(--background)_10%,transparent_45%)]" />
      <div className="mx-auto flex max-w-7xl flex-col px-4 pt-28 md:px-10 md:pt-44">
        <p className="mb-6 rise font-mono text-xs text-muted-foreground">
          <span className="mr-2 inline-block size-1.5 rounded-full bg-emerald-400 align-middle" />
          shadcn registry, namespace @drift-ui
        </p>
        <h1 className="max-w-3xl rise text-5xl leading-[1.02] font-medium tracking-tight [--rise-delay:80ms] md:text-[4rem]">
          The components
          <br />
          shadcn left out
        </h1>
        <p className="mt-8 max-w-[46ch] rise text-base leading-relaxed text-muted-foreground [--rise-delay:160ms] md:text-lg">
          Tags input, stepper, tree view and five more, plus blocks that put
          them to work. Built on Radix, styled with the tokens your shadcn app
          already has, installed with the CLI you already use.
        </p>
        <div className="mt-10 flex rise flex-col gap-3 [--rise-delay:240ms] sm:flex-row sm:items-center">
          <Button asChild size="lg" className="active:scale-[0.98]">
            <Link href="/components">
              Browse components <ArrowRightIcon />
            </Link>
          </Button>
          <CopyCommand command="npx shadcn add @drift-ui/tags-input" />
        </div>
        <HeroPanel className="mt-20 rise [--rise-delay:360ms] md:mt-28" />
      </div>
    </section>
  )
}
