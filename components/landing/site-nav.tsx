import Link from "next/link"

import { GithubStarLink } from "@/components/landing/github-star-link"
import { LogoMark } from "@/components/landing/logo-mark"
import { MobileNav } from "@/components/landing/mobile-nav"
import { ThemeToggle } from "@/components/landing/theme-toggle"

const NAV_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/#blocks", label: "Blocks" },
  { href: "/#install", label: "Install" },
  { href: "/r/registry.json", label: "Registry" },
]

export function SiteNav() {
  return (
    <header className="pointer-events-none sticky top-0 z-40 px-2 pt-2 md:px-4">
      <nav className="pointer-events-auto relative mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 shadow-[0_12px_32px_-16px] shadow-black/20 backdrop-blur-md md:px-6 dark:shadow-black/70">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-medium tracking-tight"
        >
          <LogoMark />
          drift-ui
        </Link>
        <div className="flex items-center gap-1 sm:gap-6">
          <ul className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1">
            <GithubStarLink />
            <ThemeToggle />
          </div>
          <MobileNav links={NAV_LINKS} className="sm:hidden" />
        </div>
      </nav>
    </header>
  )
}
