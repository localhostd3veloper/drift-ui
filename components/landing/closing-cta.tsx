import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"
import { CopyCommand } from "@/components/landing/copy-command"

export function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden border-t">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-[10%] aspect-square w-[44rem] max-w-[120vw] animate-drift rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_18%,transparent),transparent)] will-change-transform motion-reduce:animate-none" />
        <div className="absolute right-[5%] bottom-[-30%] aspect-square w-[36rem] max-w-[100vw] animate-drift rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--foreground)_7%,transparent),transparent)] will-change-transform [animation-delay:-11s] [animation-direction:alternate-reverse] motion-reduce:animate-none" />
      </div>
      <div className="mx-auto flex max-w-7xl reveal flex-col items-center gap-10 px-4 py-24 text-center sm:py-32 md:px-10 md:py-44">
        <h2 className="text-4xl leading-[1.05] font-medium tracking-tighter md:text-6xl">
          Fill the gaps.
          <span className="block text-muted-foreground">Keep your system.</span>
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
