import { siteConfig } from "@/lib/site-config"

const GOOD_FIRST_ISSUES = `${siteConfig.repo}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`

const STEPS = [
  {
    title: "Pick an issue",
    body: "Start with a good first issue, or propose a component the registry is missing.",
    link: { href: GOOD_FIRST_ISSUES, label: "Good first issues" },
  },
  {
    title: "Open a pull request",
    body: "Follow the contributing guide, link the issue with Closes #number and fill in the template.",
    link: {
      href: `${siteConfig.repo}/blob/main/CONTRIBUTING.md`,
      label: "Contributing guide",
    },
  },
  {
    title: "Get merged",
    body: "This page reads GitHub's contributor list, so your handle shows up here within a few hours of the merge.",
    link: {
      href: `${siteConfig.repo}/graphs/contributors`,
      label: "Contributor graph",
    },
  },
]

export function JoinSteps() {
  return (
    <ol className="flex flex-col gap-8">
      {STEPS.map((step) => (
        <li
          key={step.title}
          className="grid gap-3 border-t pt-6 md:grid-cols-12 md:gap-6"
        >
          <h3 className="font-display text-3xl font-medium tracking-tight md:col-span-5 md:text-4xl">
            {step.title}
          </h3>
          <p className="max-w-[52ch] leading-relaxed text-muted-foreground md:col-span-5">
            {step.body}
          </p>
          <a
            href={step.link.href}
            target="_blank"
            rel="noreferrer"
            className="w-fit text-sm font-medium text-brand underline-offset-4 hover:underline md:col-span-2 md:justify-self-end"
          >
            {step.link.label}
          </a>
        </li>
      ))}
    </ol>
  )
}
