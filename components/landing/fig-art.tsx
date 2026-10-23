import { cn } from "@/registry/default/lib/utils"
import { AnatomyArt } from "@/components/landing/fig-art-anatomy"
import { KeyboardArt } from "@/components/landing/fig-art-keyboard"
import { TokensArt } from "@/components/landing/fig-art-tokens"

export type FigArtKind = "tokens" | "keyboard" | "anatomy"

const ART_BY_KIND: Record<FigArtKind, () => React.ReactNode> = {
  tokens: TokensArt,
  keyboard: KeyboardArt,
  anatomy: AnatomyArt,
}

export function FigArt({
  kind,
  className,
}: {
  kind: FigArtKind
  className?: string
}) {
  const Art = ART_BY_KIND[kind]

  return (
    <div
      className={cn(
        "flex items-center justify-center stroke-muted-foreground text-muted-foreground [&_svg]:stroke-[1.25]",
        className
      )}
    >
      <Art />
    </div>
  )
}
