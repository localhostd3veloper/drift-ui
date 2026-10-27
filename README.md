# drift-ui

A shadcn-compatible component registry built on React, Tailwind v4, and Radix.

## Develop

```bash
bun install
bun run registry:build
bun dev
```

The preview lives at http://localhost:3000 and the built registry at http://localhost:3000/r/{name}.json.

## Layout

```
registry.json                 item manifest read by `shadcn build`
registry/default/ui/*.tsx     component source
registry/default/lib/utils.ts cn() helper
components/preview/*          showcase sections for the preview page
public/r/*.json               build output, served as static files
```

## Adding a component

1. Create `registry/default/ui/<name>.tsx` and import helpers from `@/registry/default/...`.
2. Add an item to `registry.json` with its npm `dependencies` and `registryDependencies`.
3. Add `components/preview/<name>-preview.tsx` (it doubles as the usage example on the docs page), register it in `components/docs/preview-registry.tsx`, and give it a category in `lib/catalog.ts`. The `/components/<name>` page is generated from that.
4. Run `bun run registry:build`.

## Consuming

In a project that already ran `npx shadcn init`, register the namespace in `components.json`:

```json
{
  "registries": {
    "@drift-ui": "http://localhost:3000/r/{name}.json"
  }
}
```

Then install the theme and any component:

```bash
npx shadcn add @drift-ui/theme @drift-ui/button @drift-ui/dialog
```

Swap the localhost URL for your deployed domain once the app is hosted.
