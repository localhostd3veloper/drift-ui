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
    body: "A workflow adds you to contributors.json with the components you touched. Add your name and website to your entry any time.",
    link: {
      href: `${siteConfig.repo}/blob/main/contributors.json`,
      label: "contributors.json",
    },
  },
]

export function JoinSteps() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {STEPS.map((step, index) => (
        <li
          key={step.title}
          className="flex flex-col gap-3 rounded-2xl border p-6"
        >
          <span className="font-mono text-xs text-muted-foreground">
            0{index + 1}
          </span>
          <h3 className="text-lg font-medium tracking-tight">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {step.body}
          </p>
          <a
            href={step.link.href}
            target="_blank"
            rel="noreferrer"
            className="mt-auto w-fit text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            {step.link.label}
          </a>
        </li>
      ))}
    </ol>
  )
}
