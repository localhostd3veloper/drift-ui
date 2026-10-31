import { TagsInputAddOnBlurPreview } from "@/components/preview/examples/tags-input/add-on-blur"
import { TagsInputDuplicatesPreview } from "@/components/preview/examples/tags-input/duplicates"
import { TagsInputValidatePreview } from "@/components/preview/examples/tags-input/validate"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "validate",
    title: "Validation",
    description:
      "Return false from validate to reject a tag. Here only email addresses are accepted.",
    Preview: TagsInputValidatePreview,
  },
  {
    id: "add-on-blur",
    title: "Add on blur",
    description:
      "addOnBlur keeps what was typed when focus leaves the field, so a half entered tag is not lost on submit.",
    Preview: TagsInputAddOnBlurPreview,
  },
  {
    id: "duplicates",
    title: "Allow duplicates",
    description:
      "Tags are unique by default. allowDuplicates accepts repeats, which helps when order matters, such as a list of pipeline steps.",
    Preview: TagsInputDuplicatesPreview,
  },
]
