export type BlockKind =
  | "onboarding"
  | "team-invite"
  | "security"
  | "file-manager"
  | "release"
  | "audit-log"

export type Block = {
  kind: BlockKind
  name: string
  description: string
  uses: string[]
}

export const BLOCKS: Block[] = [
  {
    kind: "onboarding",
    name: "Onboarding",
    description:
      "A first-run flow that sets up a workspace step by step, with its teams and seat count.",
    uses: ["stepper", "tags-input", "number-input"],
  },
  {
    kind: "team-invite",
    name: "Team invite",
    description:
      "Invite several people in one go by typing or pasting emails, with one role for the batch.",
    uses: ["tags-input"],
  },
  {
    kind: "security",
    name: "Security settings",
    description:
      "Change a password against a strength meter and see the sessions it will sign out.",
    uses: ["password-input"],
  },
  {
    kind: "file-manager",
    name: "File manager",
    description:
      "Browse a folder tree next to a dropzone for uploading into the open folder.",
    uses: ["tree-view", "file-dropzone"],
  },
  {
    kind: "release",
    name: "Release scheduler",
    description:
      "Pick a deploy window and follow the release through its timeline.",
    uses: ["date-time-range", "timeline"],
  },
  {
    kind: "audit-log",
    name: "Audit log",
    description:
      "Account activity as a timeline, narrowed by actor and action filters.",
    uses: ["tags-input", "timeline"],
  },
]
