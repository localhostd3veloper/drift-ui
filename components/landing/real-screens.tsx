import { CreateProjectCard } from "@/components/showcase/cards/create-project-card"
import { DeployActivityCard } from "@/components/showcase/cards/deploy-activity-card"
import { IssueFiltersCard } from "@/components/showcase/cards/issue-filters-card"
import { ProjectFilesCard } from "@/components/showcase/cards/project-files-card"
import { ReleaseWindowCard } from "@/components/showcase/cards/release-window-card"
import { TeamInviteCard } from "@/components/showcase/cards/team-invite-card"
import { ScreensThemePicker } from "@/components/landing/screens-theme-picker"
import { SectionHeading } from "@/components/landing/section-heading"

export function RealScreens() {
  return (
    <section
      id="screens"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-10 md:py-36"
    >
      <SectionHeading
        title="Real screens, in your theme"
        lead="Everything below is running drift-ui components, so click around. Pick a preset and every screen follows, because they read the same CSS variables your app does."
      />
      <div className="mt-14 flex flex-col gap-4 md:mt-20">
        <ScreensThemePicker />
        <div
          data-theme-scope
          className="columns-1 gap-4 rounded-3xl border bg-background p-3 font-sans text-foreground *:mb-4 *:break-inside-avoid *:last:mb-0 sm:p-4 md:columns-2 xl:columns-3"
        >
          <CreateProjectCard />
          <IssueFiltersCard />
          <ProjectFilesCard />
          <TeamInviteCard />
          <DeployActivityCard />
          <ReleaseWindowCard />
        </div>
      </div>
    </section>
  )
}
