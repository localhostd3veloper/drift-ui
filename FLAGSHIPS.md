# Flagship components

A proposal for the next stretch of work: hold most new components, and pick five existing ones to take much further.

> [!NOTE]
> This is a proposal for the maintainers to accept or change. Nothing here is committed yet.

## Why

drift-ui has 39 installable components. Twenty open issues ask for more, and all of them are `new component`. Breadth is easy to copy, because the community directory gains new registries most weeks and a coding agent can write a decent `password-input` on request. The hard cases are harder to copy: time zones, IME input, 10,000-node trees, screen reader behaviour.

Copied code also makes first versions matter more. A bug fix only reaches people who reinstall, so each new component is a long-lived commitment across both the Radix and Base UI builds.

## The five

These are the components that people would most want to install and least want to write themselves. Each one is good today and has clear room to grow.

| Component           | Today                                                                                         | Gaps to close                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `filter-builder`    | Flat list of filters on `text`, `number` and `select` fields. 6 UI tests, 5 lib tests         | `date` and multi-select fields, AND/OR groups, URL serialization                         |
| `recurrence-editor` | Parses and writes RRULE with `INTERVAL`, `BYDAY`, `BYMONTHDAY`, `COUNT`, `UNTIL`. 6 UI, 9 lib | `BYSETPOS`, `EXDATE`, time zones and DST, round-trip tests against real calendar exports |
| `date-time-range`   | Calendar plus two native time inputs. 5 UI tests, none for the keyboard                       | Presets, `min` and `max`, time zone display, keyboard tests                              |
| `tree-view`         | Expand, select, arrow keys and type-ahead over a static tree. 6 UI tests                      | Lazy-loaded branches, multi-select with indeterminate parents, virtualization            |
| `mention-textarea`  | Trigger characters mapped to static option lists. 5 UI tests, 4 lib tests                     | Async options with loading state, IME composition, inserted mentions as atomic tokens    |

## What done looks like

A flagship is finished when it passes all of these.

| Check         | Bar                                                                               |
| ------------- | --------------------------------------------------------------------------------- |
| Coverage      | Keyboard paths tested, and lib logic tested separately from rendering             |
| Build parity  | Same behaviour and same test suite on Radix and Base UI                           |
| Screen reader | Tried by hand in VoiceOver and NVDA, with findings written down                   |
| Scale         | Stated limit, measured (for example, tree-view at 10,000 nodes)                   |
| Docs          | Examples cover the awkward cases, with props in `lib/agent-docs/component-api.ts` |
| Demo          | A short recording or linkable demo that shows the hard part working               |

## Order

| Step | Work                | Reason                                                  |
| ---- | ------------------- | ------------------------------------------------------- |
| 1    | `filter-builder`    | Most dashboards need one, and the gaps are well defined |
| 2    | `date-time-range`   | Smallest of the five, and pairs with date filters       |
| 3    | `recurrence-editor` | Largest logic risk, so it needs real calendar data      |
| 4    | `tree-view`         | Can reuse `virtual-list` work                           |
| 5    | `mention-textarea`  | IME work needs testers who type in those languages      |

Post each one on its own when it reaches the bar, with its demo. A single focused post gives people something to react to, and "39 components" doesn't.

## New components in the meantime

Keep the `good first issue` items open (#40 to #43), because contributors need a way in. Hold the larger ones until the five are done, except where a real user asks for one.

> [!TIP]
> One production user reporting back is worth more than the next ten components. Real usage is the only test these APIs haven't had.

<details>
<summary>Why these five and not others</summary>

- `virtual-list`, `sortable-list` and `multi-select` are strong, but they compete with established libraries that have years of use.
- `signature-pad`, `emoji-picker` and `color-picker` get less daily use in the apps this registry targets.
- `diff-viewer` and `json-viewer` were close. They are good candidates for a second round.

</details>
