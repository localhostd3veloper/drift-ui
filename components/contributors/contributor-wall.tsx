import { ArrowUpRightIcon } from "lucide-react"

import { ContributorAvatar } from "@/components/contributors/contributor-avatar"
import {
  githubProfileOf,
  openSeatsAfter,
  type GitHubContributor,
} from "@/lib/contributors"
import { cn } from "@/registry/default/lib/utils"

const SEAT_BASE =
  "flex flex-col justify-between gap-6 rounded-2xl p-5 transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-0"
const LEAD_SEAT =
  "min-h-80 bg-brand-solid text-brand-solid-foreground md:min-h-full md:p-8"
const SEAT_SIZE = "min-h-44"

function SeatNumber({ rank, isLead }: { rank: number; isLead: boolean }) {
  return (
    <span
      className={cn(
        "font-display leading-none font-medium tracking-tighter tabular-nums",
        isLead ? "text-8xl md:text-[10rem]" : "text-5xl"
      )}
    >
      {String(rank).padStart(2, "0")}
    </span>
  )
}

function commitLabelOf(count: number) {
  return count === 1 ? "1 commit" : `${count} commits`
}

function TakenSeat({
  contributor,
  rank,
  isLead,
}: {
  contributor: GitHubContributor
  rank: number
  isLead: boolean
}) {
  return (
    <a
      href={githubProfileOf(contributor.login)}
      target="_blank"
      rel="noreferrer"
      className={cn(
        SEAT_BASE,
        "h-full",
        isLead ? LEAD_SEAT : cn(SEAT_SIZE, "border bg-card")
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <SeatNumber rank={rank} isLead={isLead} />
        <ContributorAvatar
          login={contributor.login}
          sizePx={isLead ? 88 : 40}
        />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            "truncate font-display font-medium tracking-tight",
            isLead ? "text-3xl md:text-4xl" : "text-lg"
          )}
        >
          @{contributor.login}
        </span>
        <span
          className={cn(
            "text-sm",
            isLead ? "text-brand-solid-foreground/90" : "text-muted-foreground"
          )}
        >
          {commitLabelOf(contributor.contributions)}
        </span>
      </span>
    </a>
  )
}

function OpenSeat({ rank, isLead }: { rank: number; isLead: boolean }) {
  return (
    <a
      href="#join"
      aria-label={`Seat ${rank} is open. See how to claim it.`}
      className={cn(
        SEAT_BASE,
        "group h-full",
        isLead
          ? LEAD_SEAT
          : cn(
              SEAT_SIZE,
              "border border-dashed border-foreground/25 text-muted-foreground hover:border-foreground/50 hover:text-foreground"
            )
      )}
    >
      <SeatNumber rank={rank} isLead={isLead} />
      <span
        className={cn(
          "flex items-center justify-between gap-3 font-display font-medium tracking-tight",
          isLead ? "text-3xl md:text-4xl" : "text-lg"
        )}
      >
        {isLead ? "The first seat is open" : "Open seat"}
        <ArrowUpRightIcon
          className={cn(
            "shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            isLead ? "size-7" : "size-4"
          )}
        />
      </span>
    </a>
  )
}

export function ContributorWall({
  community,
}: {
  community: GitHubContributor[]
}) {
  const seatCount = community.length + openSeatsAfter(community.length)
  const ranks = Array.from({ length: seatCount }, (_, index) => index + 1)

  return (
    <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {ranks.map((rank) => {
        const contributor = community[rank - 1]
        const isLead = rank === 1

        return (
          <li key={rank} className={cn(isLead && "col-span-2 md:row-span-2")}>
            {contributor ? (
              <TakenSeat
                contributor={contributor}
                rank={rank}
                isLead={isLead}
              />
            ) : (
              <OpenSeat rank={rank} isLead={isLead} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
