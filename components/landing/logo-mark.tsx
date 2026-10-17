import { cn } from "@/registry/default/lib/utils"

export function LogoMark({
  className,
  ghost = true,
}: {
  className?: string
  ghost?: boolean
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
    >
      <rect x="3" y="10" width="12" height="12" rx="3" />
      <rect x="3" y="25" width="12" height="12" rx="3" />
      <rect x="18" y="25" width="12" height="12" rx="3" />
      {ghost && (
        <rect
          x="18.75"
          y="10.75"
          width="10.5"
          height="10.5"
          rx="2.25"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      )}
      <rect
        x="25"
        y="3"
        width="12"
        height="12"
        rx="3"
        transform="rotate(10 31 9)"
        className="fill-[#2f6fd8] dark:fill-[#8ab4ff]"
      />
    </svg>
  )
}
