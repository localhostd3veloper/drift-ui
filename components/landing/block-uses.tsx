import Link from "next/link"

export function BlockUses({ uses }: { uses: string[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {uses.map((slug) => (
        <Link
          key={slug}
          href={`/components/${slug}`}
          className="rounded-sm border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
        >
          {slug}
        </Link>
      ))}
    </span>
  )
}
