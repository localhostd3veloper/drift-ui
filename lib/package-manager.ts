export const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

export function isPackageManager(value: unknown): value is PackageManager {
  return PACKAGE_MANAGERS.includes(value as PackageManager)
}

export function shadcnAddCommand(packageManager: PackageManager, slug: string) {
  switch (packageManager) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add @drift-ui/${slug}`
    case "yarn":
      return `yarn dlx shadcn@latest add @drift-ui/${slug}`
    case "bun":
      return `bunx --bun shadcn@latest add @drift-ui/${slug}`
    case "npm":
      return `npx shadcn@latest add @drift-ui/${slug}`
  }
}

export function dependencyInstallCommand(
  packageManager: PackageManager,
  dependencies: string[]
) {
  const list = dependencies.join(" ")

  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${list}`
    case "yarn":
      return `yarn add ${list}`
    case "bun":
      return `bun add ${list}`
    case "npm":
      return `npm install ${list}`
  }
}
