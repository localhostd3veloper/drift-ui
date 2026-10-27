import Link from "next/link"

import { cn } from "@/registry/default/lib/utils"
import { ActivePill } from "@/components/docs/active-pill"

export type NavGroup = {
  id: string
  label: string
  entries: { slug: string; name: string }[]
}

function NavLink({
  href,
  isActive,
  pillId,
  onNavigate,
  children,
}: {
  href: string
  isActive: boolean
  pillId: string
  onNavigate?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative isolate flex h-8 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
        isActive && "font-medium text-foreground"
      )}
    >
      {isActive && <ActivePill layoutId={pillId} />}
      {children}
    </Link>
  )
}

export function ComponentNavList({
  groups,
  activeSlug,
  pillId,
  onNavigate,
  className,
}: {
  groups: NavGroup[]
  activeSlug: string | null
  pillId: string
  onNavigate?: () => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-7", className)}>
      <NavLink
        href="/components"
        isActive={activeSlug === null}
        pillId={pillId}
        onNavigate={onNavigate}
      >
        All components
      </NavLink>
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.entries.map((entry) => (
              <li key={entry.slug}>
                <NavLink
                  href={`/components/${entry.slug}`}
                  isActive={activeSlug === entry.slug}
                  pillId={pillId}
                  onNavigate={onNavigate}
                >
                  {entry.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
