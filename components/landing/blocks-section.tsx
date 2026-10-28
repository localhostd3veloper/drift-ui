import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { BlockStage } from "@/components/landing/block-stage"
import { BlockUses } from "@/components/landing/block-uses"
import { BlocksRail } from "@/components/landing/blocks-rail"
import { SectionHeading } from "@/components/landing/section-heading"
import { BLOCKS } from "@/lib/blocks"

export function BlocksSection() {
  return (
    <section
      id="blocks"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-10 md:py-36"
    >
      <SectionHeading
        title="Whole screens, not just parts"
        lead="shadcn ships login, signup and sidebars. These cover the screens after that, composed from the components above."
      />
      <Link
        href="/blocks"
        className="group mt-6 flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Browse all blocks
        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <div className="mt-10 md:mt-14">
        <BlocksRail>
          {BLOCKS.map((block) => (
            <figure
              key={block.kind}
              className="flex w-[85vw] max-w-[36rem] shrink-0 snap-start flex-col gap-5"
            >
              <BlockStage kind={block.kind} />
              <figcaption className="flex flex-wrap items-baseline justify-between gap-3 px-1">
                <span className="font-display text-lg font-semibold tracking-tight">
                  {block.name}
                </span>
                <BlockUses uses={block.uses} />
              </figcaption>
            </figure>
          ))}
        </BlocksRail>
      </div>
    </section>
  )
}
