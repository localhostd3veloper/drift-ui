import type { Metadata } from "next"

import { ContributorCard } from "@/components/contributors/contributor-card"
import { JoinSteps } from "@/components/contributors/join-steps"
import { MaintainerCard } from "@/components/contributors/maintainer-card"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteNav } from "@/components/landing/site-nav"
import { fetchCommunity, MAINTAINERS } from "@/lib/contributors"
import { createPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Contributors",
  description:
    "The people behind drift-ui. Everyone whose pull request is merged gets a place on this page.",
  path: "/contributors",
})

function SectionTitle({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="max-w-[60ch] text-muted-foreground">{lead}</p>
    </div>
  )
}

export default async function ContributorsPage() {
  const community = await fetchCommunity()

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-20 px-4 pt-16 pb-24 md:px-10 md:pt-24">
        <header className="flex flex-col gap-6">
          <span className="rise font-mono text-xs tracking-widest text-brand uppercase">
            Hall of fame
          </span>
          <h1 className="max-w-3xl rise text-5xl leading-[1.02] font-medium tracking-tight [--rise-delay:80ms] md:text-6xl">
            The people
            <br />
            <span className="text-muted-foreground">
              who build <span className="whitespace-nowrap">drift-ui.</span>
            </span>
          </h1>
          <p className="max-w-[52ch] rise text-lg leading-relaxed text-muted-foreground [--rise-delay:160ms]">
            {MAINTAINERS.length + community.length} people. Every merged pull
            request puts its author on this page.
          </p>
        </header>

        <section className="flex reveal flex-col gap-8">
          <SectionTitle
            title="Maintainers"
            lead="They review pull requests, triage issues and keep the registry shipping."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {MAINTAINERS.map((maintainer) => (
              <MaintainerCard key={maintainer.login} maintainer={maintainer} />
            ))}
          </div>
        </section>

        <section className="flex reveal flex-col gap-8">
          <SectionTitle
            title="Contributors"
            lead="Ranked by merged pull requests."
          />
          {community.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {community.map((contributor) => (
                <ContributorCard
                  key={contributor.login}
                  contributor={contributor}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No community pull requests merged yet. The first name here could
              be yours.
            </p>
          )}
        </section>

        <section className="flex reveal flex-col gap-8">
          <SectionTitle
            title="Get on this page"
            lead="Three steps from an open issue to your name on the wall."
          />
          <JoinSteps />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
