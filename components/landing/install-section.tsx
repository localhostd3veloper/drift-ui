import { AgentInstallPanel } from "@/components/landing/agent-install-panel"
import { CopyCommand } from "@/components/landing/copy-command"
import { SectionHeading } from "@/components/landing/section-heading"
import { registryUrl } from "@/lib/agent-docs/build-docs"

const REGISTRY_CONFIG = `{
  "registries": {
    "@drift-ui": "${registryUrl()}"
  }
}`

const COMMANDS = [
  "npx shadcn add @drift-ui/tags-input",
  "npx shadcn add @drift-ui/stepper @drift-ui/tree-view",
]

export function InstallSection() {
  return (
    <section
      id="install"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        eyebrow="Install"
        title={["Hand it to", "your agent"]}
        lead="Copy one prompt and your coding agent reads llms.txt, registers the namespace and installs only what the task needs. Prefer to do it yourself? Two commands below."
      />
      <div className="mt-16 md:mt-24">
        <AgentInstallPanel />
      </div>
      <p className="mt-12 font-mono text-xs text-muted-foreground">
        Or install it yourself
      </p>
      <div className="mt-4 grid reveal overflow-hidden rounded-2xl border lg:grid-cols-[1.2fr_1fr]">
        <div className="flex min-w-0 flex-col border-b lg:border-r lg:border-b-0">
          <div className="flex h-11 items-center gap-2 border-b px-5 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            components.json
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            <code>{REGISTRY_CONFIG}</code>
          </pre>
        </div>
        <div className="flex min-w-0 flex-col gap-3 bg-card/30 p-5">
          <span className="font-mono text-xs text-muted-foreground">
            terminal
          </span>
          {COMMANDS.map((command) => (
            <CopyCommand key={command} command={command} className="w-full" />
          ))}
          <p className="mt-auto pt-6 text-sm text-muted-foreground">
            Needs a project that already ran{" "}
            <code className="font-mono text-foreground">shadcn init</code>.
          </p>
        </div>
      </div>
    </section>
  )
}
