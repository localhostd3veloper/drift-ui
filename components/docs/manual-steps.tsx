import Link from "next/link"

import { CopyCommand } from "@/components/landing/copy-command"
import type { BuildsOn } from "@/lib/component-docs"
import {
  dependencyInstallCommand,
  type PackageManager,
} from "@/lib/package-manager"

function Step({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="relative flex flex-col gap-3 pb-8 pl-10 [counter-increment:step] before:absolute before:top-0 before:left-0 before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:border before:bg-background before:font-mono before:text-[11px] before:text-muted-foreground before:content-[counter(step)] after:absolute after:top-7 after:bottom-1 after:left-3 after:w-px after:bg-border last:pb-0 last:after:hidden">
      <span className="text-sm leading-6 font-medium">{title}</span>
      {children}
    </li>
  )
}

export function ManualSteps({
  packageManager,
  dependencies,
  buildsOn,
  installPaths,
}: {
  packageManager: PackageManager
  dependencies: string[]
  buildsOn: BuildsOn[]
  installPaths: string[]
}) {
  return (
    <ol className="[counter-reset:step]">
      {dependencies.length > 0 && (
        <Step title="Install the npm packages">
          <CopyCommand
            command={dependencyInstallCommand(packageManager, dependencies)}
            className="w-full"
          />
        </Step>
      )}
      {buildsOn.length > 0 && (
        <Step title="Add the components it builds on">
          <ul className="flex flex-wrap gap-2">
            {buildsOn.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex h-7 items-center rounded-md border px-2.5 text-xs transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex h-7 items-center rounded-md border border-dashed px-2.5 text-xs text-muted-foreground">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Step>
      )}
      <Step title="Copy the source into your project">
        <p className="text-sm text-muted-foreground">
          Paste each file from{" "}
          <a
            href="#source"
            className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Source
          </a>{" "}
          into these paths:
        </p>
        <ul className="flex flex-col gap-1 font-mono text-xs">
          {installPaths.map((installPath) => (
            <li key={installPath} className="text-foreground">
              {installPath}
            </li>
          ))}
        </ul>
      </Step>
      <Step title="Match your import aliases">
        <p className="text-sm text-muted-foreground">
          The source imports from{" "}
          <code className="font-mono text-xs text-foreground">
            @/components/ui
          </code>{" "}
          and <code className="font-mono text-xs text-foreground">@/lib</code>.
          Change them if your components.json uses different aliases.
        </p>
      </Step>
    </ol>
  )
}
