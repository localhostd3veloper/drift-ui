import { MentionTextarea } from "@/registry/base/ui/mention-textarea"

const TRIGGERS = {
  "/": [
    { value: "assign", label: "Assign", description: "Give this to someone" },
    { value: "label", label: "Label", description: "Add a label" },
    { value: "close", label: "Close", description: "Close the issue" },
  ],
}

export function MentionTextareaCustomTriggerPreview() {
  return (
    <MentionTextarea
      aria-label="Issue comment"
      placeholder="Type / for commands"
      triggers={TRIGGERS}
      className="max-w-md"
    />
  )
}
