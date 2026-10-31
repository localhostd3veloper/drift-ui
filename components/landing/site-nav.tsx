import Link from "next/link"

import { GithubStarLink } from "@/components/landing/github-star-link"
import { LogoMark } from "@/components/landing/logo-mark"
import { MobileNav } from "@/components/landing/mobile-nav"
import { ThemeScopeBadge } from "@/components/landing/theme-scope-badge"
import { ThemeToggle } from "@/components/landing/theme-toggle"

const NAV_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/blocks", label: "Blocks" },
  { href: "/themes", label: "Themes" },
  { href: "/#install", label: "Install" },
  { href: "/contributors", label: "Contributors" },
]

export function SiteNav({ search }: { search?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
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
            {search}
            <ThemeScopeBadge className="mr-1 hidden sm:flex" />
            <GithubStarLink />
            <ThemeToggle />
          </div>
          <MobileNav links={NAV_LINKS} className="sm:hidden" />
        </div>
      </nav>
    </header>
  )
}
