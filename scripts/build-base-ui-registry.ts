import { writeFileSync } from "node:fs"

import registry from "@/registry.json"
import { toBaseUiItem } from "@/lib/base-ui-registry"

writeFileSync(
  "registry.base.json",
  `${JSON.stringify({ ...registry, items: registry.items.map(toBaseUiItem) }, null, 2)}\n`
)
