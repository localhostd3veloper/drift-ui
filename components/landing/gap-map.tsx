import { CATALOG } from "@/lib/catalog"
import { GapWall, type WallItem } from "@/components/landing/gap-wall"
import { SectionHeading } from "@/components/landing/section-heading"

const SHADCN_COMPONENTS = [
  "Accordion",
  "Alert",
  "Alert Dialog",
  "Aspect Ratio",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Button",
  "Button Group",
  "Calendar",
  "Card",
  "Carousel",
  "Chart",
  "Checkbox",
  "Collapsible",
  "Combobox",
  "Command",
  "Context Menu",
  "Data Table",
  "Date Picker",
  "Dialog",
  "Drawer",
  "Dropdown Menu",
  "Empty",
  "Field",
  "Form",
  "Hover Card",
  "Input",
  "Input Group",
  "Input OTP",
  "Item",
  "Kbd",
  "Label",
  "Menubar",
  "Navigation Menu",
  "Pagination",
  "Popover",
  "Progress",
  "Radio Group",
  "Resizable",
  "Scroll Area",
  "Select",
  "Separator",
  "Sheet",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Sonner",
  "Spinner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Toggle",
  "Toggle Group",
  "Tooltip",
]

const DRIFT_COMPONENTS = CATALOG.filter(
  (entry) => entry.category !== "primitives"
)

const WALL: WallItem[] = [
  ...SHADCN_COMPONENTS.map((name) => ({ name })),
  ...DRIFT_COMPONENTS.map(({ name, slug }) => ({ name, slug })),
].sort((a, b) => a.name.localeCompare(b.name))

export function GapMap() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-10 md:py-36">
      <SectionHeading
        title="Same tokens, same primitives, same CLI."
        lead={`drift-ui fills the gaps in shadcn/ui without asking you to adopt another design system. The ${DRIFT_COMPONENTS.length} in blue are ours.`}
      />
      <GapWall items={WALL} />
    </section>
  )
}
