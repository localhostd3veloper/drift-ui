import { cn } from "@/registry/default/lib/utils"
import {
  BlockPreview,
  type BlockKind,
} from "@/components/landing/block-preview"
import { SectionHeading } from "@/components/landing/section-heading"

const BLOCKS: {
  kind: BlockKind
  name: string
  uses: string[]
  className: string
}[] = [
  {
    kind: "onboarding",
    name: "Onboarding",
    uses: ["stepper", "tags-input", "number-input"],
    className: "lg:col-span-7",
  },
  {
    kind: "team-invite",
    name: "Team invite",
    uses: ["tags-input"],
    className: "lg:col-span-5",
  },
  {
    kind: "security",
    name: "Security settings",
    uses: ["password-input"],
    className: "lg:col-span-5",
  },
  {
    kind: "file-manager",
    name: "File manager",
    uses: ["tree-view", "file-dropzone"],
    className: "lg:col-span-7",
  },
  {
    kind: "release",
    name: "Release scheduler",
    uses: ["date-time-range", "timeline"],
    className: "lg:col-span-6",
  },
  {
    kind: "audit-log",
    name: "Audit log",
    uses: ["tags-input", "timeline"],
    className: "lg:col-span-6",
  },
]

export function BlocksSection() {
  return (
    <section
      id="blocks"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        eyebrow="Blocks"
        title={["Whole screens,", "not just parts"]}
        lead="shadcn ships login, signup and sidebars. These cover the screens after that, composed from the components above."
      />
      <div className="mt-16 grid gap-x-4 gap-y-12 md:mt-24 lg:grid-cols-12">
        {BLOCKS.map((block) => (
          <figure
            key={block.kind}
            className={cn(
              "flex min-w-0 reveal flex-col gap-5",
              block.className
            )}
          >
            <div className="flex flex-1 items-end justify-center overflow-hidden rounded-[1.75rem] border bg-[radial-gradient(80%_70%_at_50%_0%,color-mix(in_oklab,var(--foreground)_6%,transparent),transparent)] px-6 pt-8 md:px-10 md:pt-12 lg:min-h-96">
              <div
                aria-hidden
                inert
                className="@container w-full max-w-lg rounded-t-xl border border-b-0 bg-card p-5 shadow-[0_-24px_48px_-32px] shadow-black/15 dark:shadow-black"
              >
                <BlockPreview kind={block.kind} />
              </div>
            </div>
            <figcaption className="flex flex-col gap-2 px-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{block.name}</span>
                <code className="font-mono text-[11px] text-muted-foreground">
                  @drift-ui/{block.kind}
                </code>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {block.uses.map((slug) => (
                  <span
                    key={slug}
                    className="rounded-sm border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {slug}
                  </span>
                ))}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
