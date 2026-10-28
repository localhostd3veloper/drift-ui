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
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-10 md:py-36"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-10">
          <SectionHeading
            eyebrow="Install"
            title="Hand it to your agent"
            lead="Copy one prompt and your coding agent reads llms.txt, registers the namespace and installs only what the task needs."
          />
          <div className="flex reveal flex-col gap-4">
            <p className="text-sm font-medium">Or install it yourself</p>
            <div className="overflow-hidden rounded-2xl border">
              <div className="flex h-10 items-center border-b px-4 font-mono text-xs text-muted-foreground">
                components.json
              </div>
              <pre className="overflow-x-auto bg-muted/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                <code>{REGISTRY_CONFIG}</code>
              </pre>
            </div>
            {COMMANDS.map((command) => (
              <CopyCommand key={command} command={command} className="w-full" />
            ))}
            <p className="text-sm text-muted-foreground">
              Needs a project that already ran{" "}
              <code className="font-mono text-foreground">shadcn init</code>.
            </p>
          </div>
        </div>
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <AgentInstallPanel />
        </div>
      </div>
    </section>
  )
}
