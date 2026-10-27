import type { ComponentType } from "react"

import { AccountSecurityCard } from "@/components/showcase/cards/account-security-card"
import { BrandColorCard } from "@/components/showcase/cards/brand-color-card"
import { CommentCard } from "@/components/showcase/cards/comment-card"
import { CreateProjectCard } from "@/components/showcase/cards/create-project-card"
import { DangerZoneCard } from "@/components/showcase/cards/danger-zone-card"
import { DeployActivityCard } from "@/components/showcase/cards/deploy-activity-card"
import { InvoicesCard } from "@/components/showcase/cards/invoices-card"
import { IssueFiltersCard } from "@/components/showcase/cards/issue-filters-card"
import { ProductTourCard } from "@/components/showcase/cards/product-tour-card"
import { ProjectFilesCard } from "@/components/showcase/cards/project-files-card"
import { QuietHoursCard } from "@/components/showcase/cards/quiet-hours-card"
import { ReleaseWindowCard } from "@/components/showcase/cards/release-window-card"
import { SeatsCard } from "@/components/showcase/cards/seats-card"
import { ShareCard } from "@/components/showcase/cards/share-card"
import { ShortcutsCard } from "@/components/showcase/cards/shortcuts-card"
import { TeamInviteCard } from "@/components/showcase/cards/team-invite-card"
import { UploadAssetsCard } from "@/components/showcase/cards/upload-assets-card"
import { WorkspaceNameCard } from "@/components/showcase/cards/workspace-name-card"
import { CATALOG } from "@/lib/catalog"

export type ShowcaseCard = {
  id: string
  uses: string[]
  Card: ComponentType
}

export const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: "create-project",
    uses: ["stepper", "card", "input", "label", "button"],
    Card: CreateProjectCard,
  },
  { id: "invoices", uses: ["bulk-action-bar"], Card: InvoicesCard },
  { id: "comment", uses: ["mention-textarea"], Card: CommentCard },
  { id: "seats", uses: ["number-input"], Card: SeatsCard },
  { id: "project-files", uses: ["tree-view"], Card: ProjectFilesCard },
  {
    id: "team-invite",
    uses: ["tags-input", "badge"],
    Card: TeamInviteCard,
  },
  {
    id: "release-window",
    uses: ["date-time-range"],
    Card: ReleaseWindowCard,
  },
  { id: "deploy-activity", uses: ["timeline"], Card: DeployActivityCard },
  {
    id: "brand-color",
    uses: ["color-picker", "popover"],
    Card: BrandColorCard,
  },
  { id: "issue-filters", uses: ["filter-builder"], Card: IssueFiltersCard },
  {
    id: "account-security",
    uses: ["password-input"],
    Card: AccountSecurityCard,
  },
  { id: "quiet-hours", uses: ["time-field"], Card: QuietHoursCard },
  { id: "product-tour", uses: ["tour"], Card: ProductTourCard },
  { id: "share", uses: ["popover"], Card: ShareCard },
  { id: "upload-assets", uses: ["file-dropzone"], Card: UploadAssetsCard },
  { id: "workspace-name", uses: ["inline-edit"], Card: WorkspaceNameCard },
  { id: "shortcuts", uses: ["shortcut-recorder"], Card: ShortcutsCard },
  { id: "danger-zone", uses: ["dialog"], Card: DangerZoneCard },
]

const SHOWCASED_SLUGS = new Set(SHOWCASE_CARDS.flatMap((card) => card.uses))

export const UNSHOWCASED_ENTRIES = CATALOG.filter(
  (entry) => !SHOWCASED_SLUGS.has(entry.slug)
)
