import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import path from "node:path"
import type { ComponentType } from "react"

import {
  findEntry,
  findRegistryTitle,
  type CatalogEntry,
  type RegistryFile,
} from "@/lib/catalog"
import { highlight } from "@/lib/highlight"
import { componentPath, type PrimitiveLibrary } from "@/lib/primitive-library"

export type HighlightedFile = { title: string; code: string; html: string }

export type BuildsOn = { label: string; href?: string }

export type ComponentExample = {
  id: string
  title: string
  description: string
  Preview: ComponentType
  BasePreview?: ComponentType
}

export type LoadedExample = Pick<
  ComponentExample,
  "id" | "title" | "description" | "Preview"
> & { usage: HighlightedFile }

const IMPORT_REWRITES: [RegExp, string][] = [
  [/@\/registry\/[^/]+\/lib\/utils/g, "@/lib/utils"],
  [/@\/registry\/[^/]+\/ui\//g, "@/components/ui/"],
  [/@\/registry\/[^/]+\/lib\//g, "@/lib/"],
  [/@\/registry\/[^/]+\/hooks\//g, "@/hooks/"],
]

const NAMESPACE = "@drift-ui/"

const PREVIEW_DIR = "components/preview/"
const REGISTRY_DIR = "registry/"

function absoluteProjectPath(relativePath: string) {
  if (relativePath.startsWith(PREVIEW_DIR)) {
    return path.join(
      process.cwd(),
      "components/preview",
      relativePath.slice(PREVIEW_DIR.length)
    )
  }
  return path.join(
    process.cwd(),
    "registry",
    relativePath.slice(REGISTRY_DIR.length)
  )
}

async function readProjectFile(relativePath: string) {
  const code = await readFile(absoluteProjectPath(relativePath), "utf8")

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

function previewPath(slug: string, library: PrimitiveLibrary) {
  const basePreviewPath = `components/preview/base/${slug}-preview.tsx`
  if (library === "base" && existsSync(basePreviewPath)) return basePreviewPath
  return `components/preview/${slug}-preview.tsx`
}

async function toHighlightedFile(title: string, code: string) {
  return { title, code, html: await highlight(code) }
}

async function loadDemo(filePath: string, title: string) {
  const source = await readProjectFile(filePath)

  return toHighlightedFile(title, source.replace(/(\w+)Preview\b/g, "$1Demo"))
}

export function loadUsage(entry: CatalogEntry, library: PrimitiveLibrary) {
  return loadDemo(previewPath(entry.slug, library), `${entry.slug}-demo.tsx`)
}

function examplePath(slug: string, id: string, library: PrimitiveLibrary) {
  const basePath = `components/preview/base/examples/${slug}/${id}.tsx`
  if (library === "base" && existsSync(basePath)) return basePath
  return `components/preview/examples/${slug}/${id}.tsx`
}

export async function loadExamples(
  slug: string,
  library: PrimitiveLibrary
): Promise<LoadedExample[]> {
  if (!existsSync(`components/preview/examples/${slug}/index.ts`)) return []

  const { examples }: { examples: ComponentExample[] } = await import(
    `@/components/preview/examples/${slug}/index`
  )

  return Promise.all(
    examples.map(async ({ id, title, description, Preview, BasePreview }) => ({
      id: `${slug}-${id}`,
      title,
      description,
      Preview: (library === "base" && BasePreview) || Preview,
      usage: await loadDemo(
        examplePath(slug, id, library),
        `${slug}-${id}.tsx`
      ),
    }))
  )
}

export function loadUsageSnippet(entry: CatalogEntry, code: string) {
  return toHighlightedFile(`${entry.slug}-usage.tsx`, code)
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

function toBuildsOn(dependency: string, library: PrimitiveLibrary): BuildsOn {
  if (!dependency.startsWith(NAMESPACE)) {
    return { label: `shadcn/ui ${dependency}` }
  }

  const name = dependency.slice(NAMESPACE.length)
  const entry = findEntry(name)
  if (entry)
    return { label: entry.name, href: componentPath(entry.slug, library) }

  return { label: findRegistryTitle(name) ?? name }
}

export function resolveBuildsOn(
  entry: CatalogEntry,
  library: PrimitiveLibrary
) {
  return entry.registryDependencies
    .filter((dependency) => dependency !== "utils")
    .map((dependency) => toBuildsOn(dependency, library))
}
