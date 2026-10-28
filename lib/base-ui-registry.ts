import { existsSync, readFileSync } from "node:fs"

import type { RegistryFile } from "@/lib/catalog"

type RegistryItemFiles = { files?: RegistryFile[]; dependencies?: string[] }

export function baseUiSourcePath(radixPath: string) {
  const basePath = radixPath.replace(/^registry\/default\//, "registry/base/")
  return existsSync(basePath) ? basePath : radixPath
}

export function toBaseUiItem<Item extends RegistryItemFiles>(item: Item): Item {
  if (!item.files) return item

  const files = item.files.map((file) => ({
    ...file,
    path: baseUiSourcePath(file.path),
  }))
  const importsBaseUi = files.some((file) =>
    readFileSync(file.path, "utf8").includes('from "@base-ui/react/')
  )
  const dependencies = (item.dependencies ?? []).filter(
    (dependency) => dependency !== "radix-ui"
  )

  return {
    ...item,
    files,
    dependencies: importsBaseUi
      ? ["@base-ui/react", ...dependencies]
      : dependencies,
  }
}
