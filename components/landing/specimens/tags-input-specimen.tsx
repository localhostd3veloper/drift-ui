import { TagsInput } from "@/registry/default/ui/tags-input"

const DEFAULT_TAGS = ["billing", "eu-west-1", "canary"]

export function TagsInputSpecimen({
  tags = DEFAULT_TAGS,
  draft = "Add tag",
  className,
}: {
  tags?: string[]
  draft?: string
  className?: string
}) {
  return (
    <TagsInput defaultValue={tags} placeholder={draft} className={className} />
  )
}
