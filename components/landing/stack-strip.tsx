import {
  siRadixui,
  siReact,
  siShadcnui,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons"

const STACK: SimpleIcon[] = [
  siShadcnui,
  siRadixui,
  siReact,
  siTailwindcss,
  siTypescript,
]

export function StackStrip() {
  return (
    <section
      aria-label="Built on"
      className="border-y border-border/60 bg-muted/30"
    >
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-4 py-8 sm:grid-cols-3 md:px-10 lg:flex lg:items-center lg:justify-between">
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
            <span aria-hidden className="text-base font-medium tracking-tight">
              {icon.title}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
