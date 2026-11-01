import Link from "next/link"

import { LogoMark } from "@/components/landing/logo-mark"
import { siteConfig } from "@/lib/site-config"

const COLUMNS = [
  {
    title: "Registry",
    links: [
      { href: "/components", label: "Components" },
      { href: "/blocks", label: "Blocks" },
      { href: "/themes", label: "Themes" },
      { href: "/#install", label: "Install" },
    ],
  },
  {
    title: "For agents",
    links: [
      { href: "/llms.txt", label: "llms.txt" },
      { href: "/llms-full.txt", label: "llms-full.txt" },
      { href: "/r/registry.json", label: "registry.json" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: siteConfig.repo, label: "GitHub" },
      { href: siteConfig.discord, label: "Discord" },
      { href: "/contributors", label: "Contributors" },
      { href: "/resources", label: "Resources" },
      {
        href: `${siteConfig.repo}/issues/new/choose`,
        label: "Report an issue",
      },
      { href: `${siteConfig.repo}/blob/main/LICENSE`, label: "MIT license" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[minmax(0,1fr)_auto] md:px-10">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex w-fit items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
          >
            <LogoMark />
            drift-ui
          </Link>
          <p className="max-w-[36ch] text-sm text-muted-foreground">
            The components shadcn left out, built on Radix or Base UI, Tailwind
            v4 and React 19.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <span className="text-sm font-medium">{column.title}</span>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p
        aria-hidden
        className="mb-[-0.22em] text-center font-display text-[clamp(5rem,23vw,22rem)] leading-none font-semibold tracking-tighter text-[color-mix(in_oklab,var(--foreground)_7%,var(--background))] select-none"
      >
        drift-ui
      </p>
    </footer>
  )
}
