import Link from "next/link"

import {
  BlockPreview,
  type BlockKind,
} from "@/components/landing/block-preview"
import { BlocksRail } from "@/components/landing/blocks-rail"
import { SectionHeading } from "@/components/landing/section-heading"

const BLOCKS: {
  kind: BlockKind
  name: string
  uses: string[]
}[] = [
  {
    kind: "onboarding",
    name: "Onboarding",
    uses: ["stepper", "tags-input", "number-input"],
  },
  {
    kind: "team-invite",
    name: "Team invite",
    uses: ["tags-input"],
  },
  {
    kind: "security",
    name: "Security settings",
    uses: ["password-input"],
  },
  {
    kind: "file-manager",
    name: "File manager",
    uses: ["tree-view", "file-dropzone"],
  },
  {
    kind: "release",
    name: "Release scheduler",
    uses: ["date-time-range", "timeline"],
  },
  {
    kind: "audit-log",
    name: "Audit log",
    uses: ["tags-input", "timeline"],
  },
]

export function BlocksSection() {
  return (
    <section
      id="blocks"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:py-28 md:px-10 md:py-36"
    >
      <SectionHeading
        title="Whole screens, not just parts"
        lead="shadcn ships login, signup and sidebars. These cover the screens after that, composed from the components above."
      />
      <div className="mt-10 md:mt-14">
        <BlocksRail>
          {BLOCKS.map((block) => (
            <figure
              key={block.kind}
              className="flex w-[85vw] max-w-[36rem] shrink-0 snap-start flex-col gap-5"
            >
              <div className="flex h-[26rem] items-end justify-center overflow-hidden rounded-2xl border bg-[radial-gradient(80%_70%_at_50%_0%,color-mix(in_oklab,var(--brand)_10%,transparent),transparent)] px-6 pt-10 md:px-10">
                <div
                  aria-hidden
                  inert
                  className="@container w-full max-w-lg rounded-t-xl border border-b-0 bg-card p-5 shadow-[0_-24px_48px_-32px] shadow-black/15 dark:shadow-black"
                >
                  <BlockPreview kind={block.kind} />
                </div>
              </div>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-3 px-1">
                <span className="font-medium">{block.name}</span>
                <span className="flex flex-wrap gap-1.5">
                  {block.uses.map((slug) => (
                    <Link
                      key={slug}
                      href={`/components/${slug}`}
                      className="rounded-sm border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
                    >
                      {slug}
                    </Link>
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </BlocksRail>
      </div>
    </section>
  )
}
