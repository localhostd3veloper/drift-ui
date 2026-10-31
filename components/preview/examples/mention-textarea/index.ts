import { MentionTextareaControlledPreview as BaseUiMentionTextareaControlledPreview } from "@/components/preview/base/examples/mention-textarea/controlled"
import { MentionTextareaControlledPreview } from "@/components/preview/examples/mention-textarea/controlled"
import { MentionTextareaCustomTriggerPreview as BaseUiMentionTextareaCustomTriggerPreview } from "@/components/preview/base/examples/mention-textarea/custom-trigger"
import { MentionTextareaCustomTriggerPreview } from "@/components/preview/examples/mention-textarea/custom-trigger"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "controlled",
    title: "Controlled",
    description:
      "value is plain text with the trigger and value inserted, so reading mentions back is one regular expression.",
    Preview: MentionTextareaControlledPreview,
    BasePreview: BaseUiMentionTextareaControlledPreview,
  },
  {
    id: "custom-trigger",
    title: "Any trigger character",
    description:
      "triggers takes any character as a key, so / can open a command list.",
    Preview: MentionTextareaCustomTriggerPreview,
    BasePreview: BaseUiMentionTextareaCustomTriggerPreview,
  },
]
