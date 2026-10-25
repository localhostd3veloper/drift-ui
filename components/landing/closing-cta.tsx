import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { CopyCommand } from "@/components/landing/copy-command"

export function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden border-t">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_50%_100%,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent)]" />
      <div className="mx-auto flex max-w-7xl reveal flex-col gap-10 px-4 py-20 sm:py-28 md:px-10 md:py-40 xl:flex-row xl:items-end xl:justify-between">
        <h2 className="text-4xl leading-none font-medium tracking-tight md:text-6xl">
          Fill the gaps.
          <br />
          <span className="text-muted-foreground">Keep your system.</span>
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="active:scale-[0.98]">
            <Link href="/components">
              Browse components <ArrowRightIcon />
            </Link>
          </Button>
          <CopyCommand command="npx shadcn add @drift-ui/stepper" />
        </div>
      </div>
    </section>
  )
}
