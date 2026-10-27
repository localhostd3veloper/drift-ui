# Contributing to drift-ui

Thanks for taking the time to help. This guide covers local setup, how a component is put together, and what a pull request needs before it can be merged.

## Setup

You need [Bun](https://bun.sh) 1.2 or newer. [Fork the repo](https://github.com/localhostd3veloper/drift-ui/fork), then clone your fork:

```bash
git clone https://github.com/<your-username>/drift-ui.git
cd drift-ui
bun install
bun run registry:build
bun dev
```

The site runs at <http://localhost:3000>. Every registry item is served from <http://localhost:3000/r/{name}.json>.

## Scripts

| Command                  | What it does                                   |
| ------------------------ | ---------------------------------------------- |
| `bun dev`                | Start the Next.js dev server                   |
| `bun run registry:build` | Rebuild `public/r/*.json` from `registry.json` |
| `bun run test`           | Run the Vitest suite once                      |
| `bun run test:watch`     | Run Vitest in watch mode                       |
| `bun run typecheck`      | Type-check the project with `tsc --noEmit`     |
| `bun run lint`           | Run ESLint                                     |
| `bun run format`         | Format `.ts` and `.tsx` files with Prettier    |
| `bun run build`          | Build the registry, then the production site   |

## Adding a component

1. Write the source in `registry/default/ui/<name>.tsx`. Pure logic (parsing, math, state machines) goes in `registry/default/lib/<name>.ts` so it can be tested without rendering.
2. Import helpers through `@/registry/default/...`. The docs site rewrites these paths to `@/components/ui/...` and `@/lib/...` when it shows the source to users.
3. Add an item to `registry.json` with its npm `dependencies` and its `registryDependencies`. Use the `@drift-ui/` prefix for items from this registry.
4. Add `components/preview/<name>-preview.tsx`. It is the live demo and the usage example on the docs page, so keep it short and realistic.
5. Register the preview in `components/docs/preview-registry.tsx` and give it a category in `lib/catalog.ts`. The `/components/<name>` page is generated from those two entries.
6. Add usage notes to `lib/agent-docs/component-usage.ts`. They feed `/llms.txt` and `/llms-full.txt`.
7. Add tests in `tests/ui/<name>.test.tsx`, plus `tests/lib/<name>.test.ts` if you added a lib file.
8. Run `bun run registry:build` and commit the regenerated `public/r` files.

### Component guidelines

- Support controlled and uncontrolled use. `use-controllable-state` handles the `value`, `defaultValue` and `onValueChange` trio.
- Spread remaining props onto the element a user expects to style, and accept `className`.
- Follow the WAI-ARIA pattern for the widget and test keyboard interaction, not only clicks.
- Read colors from the theme tokens in `app/globals.css`. Do not hard-code colors.
- If shadcn/ui already ships a component, keep its API identical.

## Code style

Prettier and ESLint settle formatting. Run `bun run format` and `bun run lint` before you push. Tailwind classes are sorted by `prettier-plugin-tailwindcss`, so do not reorder them by hand.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org):

```text
feat(registry): add tags input
fix(tree-view): keep focus on the collapsed branch
test(time-field): cover segment editing
```

Use the component name as the scope when the change is limited to one component. Keep one logical change per commit.

## Pull requests

1. Branch from `main` in your fork, for example `feature/color-picker-eyedropper` or `fix/stepper-focus-ring`.
2. Make sure `bun run typecheck`, `bun run lint` and `bun run test` pass.
3. Open the pull request and fill in the template. Add a screenshot or a short recording for visual changes.

## Reporting bugs and requesting components

Use the [issue templates](https://github.com/localhostd3veloper/drift-ui/issues/new/choose). For a bug, include the component, the browser, and the smallest steps that reproduce it. For a new component, describe the job it does on a real screen and link any prior art.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
