"use client"

import { useEffect, useState } from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/registry/default/lib/utils"

const ACTIVE_LINE_RATIO = 0.3

type PageSection = { id: string; label: string }

function findActiveSection(sections: PageSection[]) {
  const activeLine = window.innerHeight * ACTIVE_LINE_RATIO

  return sections.findLast(
    (section) =>
      (document.getElementById(section.id)?.getBoundingClientRect().top ??
        Infinity) <= activeLine
  )?.id
}

export function OnThisPage({
  sections,
  sourceUrl,
}: {
  sections: PageSection[]
  sourceUrl: string
}) {
  const [activeId, setActiveId] = useState<string | undefined>()

  useEffect(() => {
    function updateActiveId() {
      setActiveId(findActiveSection(sections))
    }

    const frameId = requestAnimationFrame(updateActiveId)
    window.addEventListener("scroll", updateActiveId, { passive: true })
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", updateActiveId)
    }
  }, [sections])

  return (
    <div className="sticky top-28 flex flex-col gap-8 text-sm">
      <nav aria-label="On this page" className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground">
          On this page
        </p>
        <ul className="flex flex-col border-l border-border/60">
          {sections.map((section) => {
            const isActive = section.id === activeId

            return (
              <li key={section.id} className="relative">
                {isActive && (
                  <motion.span
                    aria-hidden
                    layoutId="on-this-page-marker"
                    transition={{ type: "spring", stiffness: 480, damping: 38 }}
                    className="absolute inset-y-1 -left-px w-px bg-foreground"
                  />
                )}
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "block py-1.5 pl-4 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground focus-visible:underline",
                    isActive && "text-foreground"
                  )}
                >
                  {section.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        View on GitHub
        <ArrowUpRightIcon className="size-3" />
      </a>
    </div>
  )
}
