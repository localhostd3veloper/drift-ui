"use client"

import { useState } from "react"
import Link from "next/link"
import { MenuIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/default/lib/utils"

export function MobileNav({
  links,
  className,
}: {
  links: { href: string; label: string }[]
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      onKeyDown={(event) => event.key === "Escape" && setIsOpen(false)}
      className={cn("flex", className)}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="-mr-2 flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {isOpen ? (
          <XIcon className="size-5" />
        ) : (
          <MenuIcon className="size-5" />
        )}
      </button>
      <ul
        id="mobile-nav"
        className={cn(
          "absolute inset-x-0 top-full mt-2 flex flex-col rounded-2xl border border-border/60 bg-background px-4 py-2 shadow-[0_12px_32px_-16px] shadow-black/20 dark:shadow-black/70",
          !isOpen && "hidden"
        )}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
