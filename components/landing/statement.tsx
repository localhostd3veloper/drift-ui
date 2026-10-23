import { cn } from "@/registry/default/lib/utils"
import { FigArt, type FigArtKind } from "@/components/landing/fig-art"
import { ScrollFillText } from "@/components/landing/scroll-fill-text"

const FIGURES: {
  figure: string
  art: FigArtKind
  title: string
  description: string
  className?: string
}[] = [
  {
    figure: "FIG 0.1",
    art: "tokens",
    title: "Reads the tokens you have",
    description:
      "Every color, radius and ring comes from the CSS variables shadcn init wrote. Retheme once, everything follows.",
    className: "md:row-span-2 md:min-h-[34rem]",
  },
  {
    figure: "FIG 0.2",
    art: "keyboard",
    title: "Radix underneath",
    description:
      "Focus, roving tabindex and screen reader labels are handled before styling starts.",
  },
  {
    figure: "FIG 0.3",
    art: "anatomy",
    title: "A data-slot on every part",
    description: "Target any piece from your own CSS without forking the file.",
  },
]

export function Statement() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:py-28 md:px-10 md:py-40">
      <ScrollFillText
        text="Same tokens, same Radix internals, same CLI. drift-ui fills the gaps in shadcn without asking you to adopt another design system."
        className="max-w-5xl text-3xl leading-[1.12] font-medium tracking-tight md:text-5xl"
      />
      <div className="mt-20 grid gap-4 md:mt-28 md:grid-cols-[1.35fr_1fr] md:grid-rows-2">
        {FIGURES.map((figure) => (
          <article
            key={figure.figure}
            className={cn(
              "flex min-h-80 reveal flex-col rounded-2xl border bg-card/30 p-8",
              figure.className
            )}
          >
            <span className="font-mono text-xs text-muted-foreground">
              {figure.figure}
            </span>
            <FigArt kind={figure.art} className="flex-1 py-10" />
            <h3 className="font-medium">{figure.title}</h3>
            <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
              {figure.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
