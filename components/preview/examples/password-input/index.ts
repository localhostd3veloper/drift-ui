import { PasswordInputCustomRulesPreview } from "@/components/preview/examples/password-input/custom-rules"
import { PasswordInputSignInPreview } from "@/components/preview/examples/password-input/sign-in"
import type { ComponentExample } from "@/lib/component-docs"

export const examples: ComponentExample[] = [
  {
    id: "sign-in",
    title: "Sign in",
    description:
      "For a returning user, skip the meter and set autoComplete to current-password so password managers fill it.",
    Preview: PasswordInputSignInPreview,
  },
  {
    id: "custom-rules",
    title: "Your own rules",
    description:
      "getScore replaces the built-in scoring and labels replaces the words, one for each score from 0 to 4.",
    Preview: PasswordInputCustomRulesPreview,
  },
]
