const FALLBACK_SITE_URL = "http://localhost:3000"

export const siteConfig = {
  name: "drift-ui",
  title: "drift-ui, the components shadcn left out",
  description:
    "A shadcn-compatible component registry. Tags input, stepper, tree view, file dropzone and more, built on Radix and Tailwind v4 and installed with the shadcn CLI.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL,
  repo: "https://github.com/localhostd3veloper/drift-ui",
  keywords: [
    "shadcn",
    "shadcn registry",
    "shadcn components",
    "React components",
    "Radix UI",
    "Tailwind CSS v4",
    "Next.js",
    "tags input",
    "stepper",
    "tree view",
    "file dropzone",
  ],
  routes: ["/", "/components"],
} as const
