import { readFile } from "node:fs/promises"
import path from "node:path"

import {
  findEntry,
  findRegistryTitle,
  type CatalogEntry,
  type RegistryFile,
} from "@/lib/catalog"
import { highlight } from "@/lib/highlight"

export type HighlightedFile = { title: string; code: string; html: string }

export type BuildsOn = { label: string; href?: string }

const IMPORT_REWRITES: [RegExp, string][] = [
  [/@\/registry\/default\/lib\/utils/g, "@/lib/utils"],
  [/@\/registry\/default\/ui\//g, "@/components/ui/"],
  [/@\/registry\/default\/lib\//g, "@/lib/"],
  [/@\/registry\/default\/hooks\//g, "@/hooks/"],
]

const NAMESPACE = "@drift-ui/"

async function readProjectFile(relativePath: string) {
  const code = await readFile(path.join(process.cwd(), relativePath), "utf8")

  return IMPORT_REWRITES.reduce(
    (rewritten, [pattern, replacement]) =>
      rewritten.replace(pattern, replacement),
    code
  ).trimEnd()
}

function installPath(file: RegistryFile) {
  const name = path.basename(file.path)

  switch (file.type) {
    case "registry:lib":
      return `lib/${name}`
    case "registry:hook":
      return `hooks/${name}`
    default:
      return `components/ui/${name}`
  }
}

async function toHighlightedFile(title: string, code: string) {
  return { title, code, html: await highlight(code) }
}

export async function loadUsage(entry: CatalogEntry) {
  const source = await readProjectFile(
    `components/preview/${entry.slug}-preview.tsx`
  )
  const code = source.replace(/(\w+)Preview\b/g, "$1Demo")

  return toHighlightedFile(`${entry.slug}-demo.tsx`, code)
}

export function loadSources(entry: CatalogEntry) {
  return Promise.all(
    entry.files.map(async (file) =>
      toHighlightedFile(installPath(file), await readProjectFile(file.path))
    )
  )
}

export function listInstallPaths(entry: CatalogEntry) {
  return entry.files.map(installPath)
}

function toBuildsOn(dependency: string): BuildsOn {
  if (!dependency.startsWith(NAMESPACE)) {
    return { label: `shadcn/ui ${dependency}` }
  }

  const name = dependency.slice(NAMESPACE.length)
  const entry = findEntry(name)
  if (entry) return { label: entry.name, href: `/components/${entry.slug}` }

  return { label: findRegistryTitle(name) ?? name }
}

export function resolveBuildsOn(entry: CatalogEntry) {
  return entry.registryDependencies
    .filter((dependency) => dependency !== "utils")
    .map(toBuildsOn)
}
