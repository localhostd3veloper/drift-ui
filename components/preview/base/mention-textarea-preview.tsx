import { MentionTextarea } from "@/registry/base/ui/mention-textarea"

const MENTION_TRIGGERS = {
  "@": [
    { value: "noor", label: "Noor Haddad", description: "Platform" },
    { value: "kofi", label: "Kofi Mensah", description: "Design" },
    { value: "ilse", label: "Ilse Marchetti", description: "Support" },
    { value: "tomasz", label: "Tomasz Wierzba", description: "Billing" },
  ],
  "#": [
    { value: "incidents", label: "incidents" },
    { value: "releases", label: "releases" },
    { value: "design-review", label: "design-review" },
  ],
}

export function MentionTextareaPreview() {
  return (
    <>
      <MentionTextarea
        aria-label="Comment"
        placeholder="Type @ to mention someone or # for a channel"
        triggers={MENTION_TRIGGERS}
        className="max-w-md"
      />
    </>
  )
}
