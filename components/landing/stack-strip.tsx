import {
  siBaseui,
  siRadixui,
  siReact,
  siShadcnui,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons"

import { cn } from "@/registry/default/lib/utils"

const STACK: SimpleIcon[] = [
  siShadcnui,
  siRadixui,
  siBaseui,
  siReact,
  siTailwindcss,
  siTypescript,
]

const MARQUEE_COPIES = 4

export function StackStrip() {
  return (
    <section
      aria-label="Built on"
      className="border-y border-border/60 bg-muted/30"
    >
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:[mask-image:none]">
        <div
          style={{ "--marquee-copies": MARQUEE_COPIES } as React.CSSProperties}
          className="flex w-max animate-marquee py-8 hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center"
        >
          {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 || undefined}
              className={cn(
                "flex shrink-0 items-center gap-16 pr-16 motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-12 motion-reduce:gap-y-6 motion-reduce:px-4",
                copy > 0 && "motion-reduce:hidden"
              )}
            >
              {STACK.map((icon) => (
                <li
                  key={icon.slug}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <svg
                    role="img"
                    aria-label={icon.title}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 shrink-0"
                  >
                    <path d={icon.path} />
                  </svg>
                  <span
                    aria-hidden
                    className="text-base font-medium tracking-tight whitespace-nowrap"
                  >
                    {icon.title}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
