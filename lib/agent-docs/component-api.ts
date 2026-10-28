export type ApiProp = {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export type ApiPart = {
  name: string
  signature?: string
  description: string
  props?: ApiProp[]
  rest?: string
}

const STATE_PROPS = {
  value: (type: string, what: string): ApiProp => ({
    name: "value",
    type,
    description: `Controlled ${what}.`,
  }),
  defaultValue: (type: string, initial: string): ApiProp => ({
    name: "defaultValue",
    type,
    default: initial,
    description: "Initial value when uncontrolled.",
  }),
  onValueChange: (type: string, when: string): ApiProp => ({
    name: "onValueChange",
    type,
    description: `Called ${when}.`,
  }),
}

export const COMPONENT_API: Record<string, ApiPart[]> = {
  "tags-input": [
    {
      name: "TagsInput",
      description:
        "Enter or comma adds a tag. Backspace or ArrowLeft at the start of the field selects the last tag and announces it, and a second Backspace removes it. Pasted text splits on commas, tabs and newlines.",
      props: [
        STATE_PROPS.value("string[]", "list of tags"),
        STATE_PROPS.defaultValue("string[]", "[]"),
        STATE_PROPS.onValueChange(
          "(tags: string[]) => void",
          "after a tag is added or removed"
        ),
        {
          name: "max",
          type: "number",
          description:
            "Most tags allowed. When full the field turns read-only, and tags stay removable by keyboard.",
        },
        {
          name: "validate",
          type: "(tag: string) => boolean",
          description: "Return false to reject a tag.",
        },
        {
          name: "allowDuplicates",
          type: "boolean",
          default: "false",
          description: "Accept a tag that is already in the list.",
        },
        {
          name: "addOnBlur",
          type: "boolean",
          default: "false",
          description:
            "Add the typed text as a tag when the field loses focus.",
        },
      ],
      rest: "<input>",
    },
  ],
  "number-input": [
    {
      name: "NumberInput",
      description:
        "Arrow keys step by step, Shift+Arrow and PageUp/PageDown by ten steps, and Home/End jump to min and max. Typed text is parsed with the locale's separators.",
      props: [
        STATE_PROPS.value("number | null", "number, or null when empty"),
        STATE_PROPS.defaultValue("number | null", "null"),
        STATE_PROPS.onValueChange(
          "(value: number | null) => void",
          "when the parsed number changes"
        ),
        { name: "min", type: "number", description: "Lowest allowed value." },
        { name: "max", type: "number", description: "Highest allowed value." },
        {
          name: "step",
          type: "number",
          default: "1",
          description: "Amount the arrow keys add or subtract.",
        },
        {
          name: "locale",
          type: "string",
          description:
            "Locale for formatting and parsing. Defaults to the browser's.",
        },
        {
          name: "formatOptions",
          type: "Intl.NumberFormatOptions",
          description: "Display format, for example a currency.",
        },
        {
          name: "name",
          type: "string",
          description: "Submits the raw number through a hidden input.",
        },
      ],
      rest: "<input>",
    },
  ],
  "password-input": [
    {
      name: "PasswordInput",
      description:
        "A password field with a button that shows and hides the value. It has no props of its own.",
      rest: "<input>, except type",
    },
    {
      name: "PasswordStrength",
      description:
        "A four segment meter with a polite live region that announces the label.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "The password to score.",
        },
        {
          name: "getScore",
          type: "(value: string) => 0 | 1 | 2 | 3 | 4",
          default: "scorePassword",
          description: "Replaces the built-in scoring.",
        },
        {
          name: "labels",
          type: "[string, string, string, string, string]",
          default: '["Too weak", "Weak", "Fair", "Good", "Strong"]',
          description: "Label for each score from 0 to 4.",
        },
      ],
      rest: "<div>",
    },
  ],
  "date-time-range": [
    {
      name: "DateTimeRangePicker",
      description:
        "A popover with a range calendar and start and end time inputs. Times default to 09:00 and 17:00.",
      props: [
        STATE_PROPS.value("{ from?: Date; to?: Date }", "range"),
        STATE_PROPS.defaultValue("{ from?: Date; to?: Date }", "{}"),
        STATE_PROPS.onValueChange(
          "(range: { from?: Date; to?: Date }) => void",
          "when a day or time changes"
        ),
        {
          name: "locale",
          type: "string",
          description: "Locale for the trigger label.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Pick a date range"',
          description: "Trigger text while no range is set.",
        },
        {
          name: "numberOfMonths",
          type: "number",
          default: "2",
          description: "Months shown side by side.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables the trigger.",
        },
        {
          name: "id",
          type: "string",
          description: "Id of the trigger, so a Label can point at it.",
        },
        {
          name: "className",
          type: "string",
          description: "Classes for the trigger.",
        },
      ],
    },
  ],
  "time-field": [
    {
      name: "TimeField",
      description:
        "Segmented hour and minute input. The root has role=group, so pass aria-label or aria-labelledby.",
      props: [
        STATE_PROPS.value("string", 'time as "HH:mm" in 24 hour time'),
        STATE_PROPS.defaultValue("string", '""'),
        STATE_PROPS.onValueChange(
          "(value: string) => void",
          'with "HH:mm", or an empty string when cleared'
        ),
        {
          name: "hourCycle",
          type: "12 | 24",
          default: "24",
          description: "12 adds an AM/PM segment.",
        },
        {
          name: "minuteStep",
          type: "number",
          default: "1",
          description: "Amount the arrow keys change the minutes by.",
        },
        {
          name: "name",
          type: "string",
          description: "Submits the value through a hidden input.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables every segment.",
        },
      ],
      rest: "<div>",
    },
  ],
  "color-picker": [
    {
      name: "ColorPicker",
      description:
        "A trigger button that opens a saturation and brightness area, hue and alpha sliders, a hex field, an oklch readout and, where the browser has it, the EyeDropper.",
      props: [
        STATE_PROPS.value("string", 'hex color, "#rrggbb" or "#rrggbbaa"'),
        STATE_PROPS.defaultValue("string", '"#000000"'),
        STATE_PROPS.onValueChange(
          "(hex: string) => void",
          "with the new hex color"
        ),
        {
          name: "showAlpha",
          type: "boolean",
          default: "true",
          description: "Show the opacity slider.",
        },
        {
          name: "swatches",
          type: "string[]",
          description: "Preset hex colors shown as buttons.",
        },
        {
          name: "variant",
          type: "Button variant",
          default: '"outline"',
          description: "Style of the trigger button.",
        },
        {
          name: "size",
          type: "Button size",
          description: "Size of the trigger button.",
        },
      ],
      rest: "trigger <button>",
    },
  ],
  "mention-textarea": [
    {
      name: "MentionTextarea",
      description:
        "Opens a suggestion list when the caret follows a trigger character. Arrow keys move through it, Enter or Tab inserts the trigger, the option's value and a space, and Escape closes it.",
      props: [
        STATE_PROPS.value("string", "text"),
        STATE_PROPS.defaultValue("string", '""'),
        STATE_PROPS.onValueChange(
          "(value: string) => void",
          "when the text changes"
        ),
        {
          name: "triggers",
          type: "Record<string, MentionOption[]>",
          required: true,
          description:
            'Maps a trigger character to its options, for example { "@": people, "#": channels }.',
        },
      ],
      rest: "<textarea>",
    },
    {
      name: "MentionOption",
      description: "One suggestion.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description:
            "Text inserted after the trigger. Typing filters on value and label.",
        },
        {
          name: "label",
          type: "string",
          required: true,
          description: "Text shown in the list.",
        },
        {
          name: "description",
          type: "string",
          description: "Second line under the label.",
        },
      ],
    },
  ],
  "shortcut-recorder": [
    {
      name: "ShortcutRecorder",
      description:
        'Click, then press a combination. The value is portable, such as "Mod+Shift+K", where Mod is Cmd on macOS and Ctrl elsewhere.',
      props: [
        STATE_PROPS.value("string", "shortcut"),
        STATE_PROPS.defaultValue("string", '""'),
        STATE_PROPS.onValueChange(
          "(shortcut: string) => void",
          "with the recorded shortcut"
        ),
        {
          name: "placeholder",
          type: "string",
          default: '"Record shortcut"',
          description: "Text while nothing is recorded.",
        },
        {
          name: "requireModifier",
          type: "boolean",
          default: "true",
          description:
            "Ignore keys pressed without a modifier, except function keys.",
        },
      ],
      rest: "<button>",
    },
    {
      name: "ShortcutKeys",
      description:
        "Renders a stored shortcut as kbd elements for the current platform.",
      props: [
        {
          name: "shortcut",
          type: "string",
          required: true,
          description: 'A shortcut string such as "Mod+K".',
        },
      ],
      rest: "<span>",
    },
    {
      name: "matchesShortcut",
      signature:
        "matchesShortcut(event: KeyboardEvent, shortcut: string, isMac: boolean): boolean",
      description:
        "Import from @/lib/shortcut. Returns true when a keyboard event matches a stored shortcut.",
    },
  ],
  "file-dropzone": [
    {
      name: "FileDropzone",
      description:
        "Validates dropped or picked files and reports them. It does not upload or store anything, so keep the list in your own state.",
      props: [
        {
          name: "accept",
          type: "string",
          description:
            "Comma separated extensions, MIME types or wildcards such as image/*.",
        },
        {
          name: "maxSize",
          type: "number",
          description: "Largest file in bytes.",
        },
        {
          name: "maxFiles",
          type: "number",
          description: "Most files accepted from one drop or pick.",
        },
        {
          name: "multiple",
          type: "boolean",
          default: "true",
          description: "Allow more than one file at a time.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Ignore drops and clicks.",
        },
        {
          name: "onFilesAccepted",
          type: "(files: File[]) => void",
          description: "Called with the files that passed validation.",
        },
        {
          name: "onFilesRejected",
          type: "(rejections: FileRejection[]) => void",
          description:
            'Called with { file, reason } for each rejected file, where reason is "type", "size" or "count".',
        },
      ],
      rest: "<label>",
    },
    {
      name: "FileDropzoneItem",
      description:
        "One row of a FileDropzoneList. A progress bar shows while progress is below 100.",
      props: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "File name.",
        },
        {
          name: "size",
          type: "number",
          required: true,
          description: "File size in bytes.",
        },
        {
          name: "progress",
          type: "number",
          description: "Upload progress from 0 to 100.",
        },
        {
          name: "error",
          type: "string",
          description: "Marks the row invalid and shows the message.",
        },
        {
          name: "onRemove",
          type: "() => void",
          description: "Shows a remove button that calls it.",
        },
      ],
      rest: "<li>",
    },
  ],
  "inline-edit": [
    {
      name: "InlineEdit",
      description:
        "Text that turns into an input on click. Enter or blur saves and Escape cancels. Pass aria-label to describe the field.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "The saved text.",
        },
        {
          name: "onSave",
          type: "(value: string) => void | Promise<void>",
          required: true,
          description:
            "Called with the edited text. While a returned promise is pending the field is read-only, and a rejection marks it invalid and keeps it open.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Empty"',
          description: "Text shown while value is empty.",
        },
        { name: "disabled", type: "boolean", description: "Prevents editing." },
      ],
      rest: "<div>",
    },
  ],
  "tree-view": [
    {
      name: "TreeView",
      description:
        "A WAI-ARIA tree. Arrow keys move and expand, Home and End jump, Enter or Space selects, and typing jumps to the next matching node. Always pass aria-label.",
      props: [
        {
          name: "items",
          type: "TreeNode[]",
          required: true,
          description: "Nodes to render.",
        },
        {
          name: "expanded",
          type: "string[]",
          description: "Controlled ids of open branches.",
        },
        {
          name: "defaultExpanded",
          type: "string[]",
          default: "[]",
          description: "Initially open branches when uncontrolled.",
        },
        {
          name: "onExpandedChange",
          type: "(expanded: string[]) => void",
          description:
            "Called when a branch opens or closes. Load lazy children here.",
        },
        {
          name: "selected",
          type: "string | null",
          description: "Controlled id of the selected node.",
        },
        {
          name: "defaultSelected",
          type: "string | null",
          default: "null",
          description: "Initially selected node when uncontrolled.",
        },
        {
          name: "onSelectedChange",
          type: "(id: string) => void",
          description: "Called when a node is selected.",
        },
      ],
      rest: "<ul>",
    },
    {
      name: "TreeNode",
      description:
        "One node. A node with isBranch and no children shows a loading row while open, so you can fetch its children in onExpandedChange.",
      props: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Unique id.",
        },
        {
          name: "label",
          type: "ReactNode",
          required: true,
          description: "Content of the row.",
        },
        {
          name: "textValue",
          type: "string",
          description: "Text for typeahead when label is not a string.",
        },
        {
          name: "icon",
          type: "ReactNode",
          description: "Shown before the label.",
        },
        { name: "children", type: "TreeNode[]", description: "Child nodes." },
        {
          name: "isBranch",
          type: "boolean",
          description: "Treat the node as a branch before its children load.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Skip the node when moving and selecting.",
        },
      ],
    },
  ],
  stepper: [
    {
      name: "Stepper",
      description:
        "Compose StepperList > StepperItem > StepperTrigger > StepperIndicator + StepperTitle, with StepperSeparator between items and a StepperContent for each step. Steps are zero-based.",
      props: [
        STATE_PROPS.value("number", "step"),
        STATE_PROPS.defaultValue("number", "0"),
        STATE_PROPS.onValueChange(
          "(step: number) => void",
          "when the step changes"
        ),
        {
          name: "linear",
          type: "boolean",
          default: "false",
          description: "Disable steps past the furthest one reached.",
        },
        {
          name: "stepCount",
          type: "number",
          description:
            "Number of steps, so StepperNext disables on the last one.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Layout direction.",
        },
      ],
      rest: "Tabs root",
    },
    {
      name: "StepperItem",
      description:
        'Wraps one step and sets data-state to "completed", "active" or "upcoming" for its children.',
      props: [
        {
          name: "step",
          type: "number",
          required: true,
          description: "The step this item stands for.",
        },
      ],
      rest: "<div>",
    },
    {
      name: "StepperContent",
      description: "Panel shown while its step is active.",
      props: [
        {
          name: "step",
          type: "number",
          required: true,
          description: "The step this panel belongs to.",
        },
      ],
      rest: "Tabs panel",
    },
    {
      name: "StepperPrevious, StepperNext",
      description:
        "Buttons that move one step back or forward. They disable on the first step and, with stepCount, on the last.",
      props: [
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description:
            "Render the child element, such as a Button, instead of a button.",
        },
      ],
      rest: "<button>",
    },
    {
      name: "useStepper",
      signature:
        "useStepper(): { activeStep: number; setActiveStep: (step: number) => void }",
      description: "For custom controls rendered inside Stepper.",
    },
  ],
  timeline: [
    {
      name: "Timeline",
      description:
        "Compose Timeline > TimelineItem > TimelineIndicator + TimelineContent, with TimelineHeader holding TimelineTitle and TimelineTime, then TimelineDescription. Every part spreads its props onto its element, and none needs client JavaScript.",
      rest: "<ol>",
    },
    {
      name: "TimelineIndicator",
      description: "The dot next to an item.",
      props: [
        {
          name: "variant",
          type: '"default" | "current" | "success" | "destructive"',
          default: '"default"',
          description: "Color and ring of the dot.",
        },
      ],
      rest: "<span>",
    },
  ],
  "filter-builder": [
    {
      name: "FilterBuilder",
      description:
        "A row of filter chips with an Add filter menu. Each chip edits its operator and value in place.",
      props: [
        {
          name: "fields",
          type: "FilterField[]",
          required: true,
          description:
            'Filterable fields: { id, label, type: "text" | "number" | "select", options?, icon? }.',
        },
        STATE_PROPS.value("Filter[]", "filters"),
        STATE_PROPS.defaultValue("Filter[]", "[]"),
        STATE_PROPS.onValueChange(
          "(filters: Filter[]) => void",
          "when a filter is added, changed or removed"
        ),
        {
          name: "aria-label",
          type: "string",
          default: '"Filters"',
          description: "Name of the filter group.",
        },
      ],
      rest: "<div>",
    },
    {
      name: "matchesFilter",
      signature:
        "matchesFilter(fieldValue: string | number, filter: Filter): boolean",
      description:
        "Import from @/lib/filter to apply a Filter ({ id, fieldId, operator, value }) to your rows. An empty filter value matches everything. Text fields use contains, not-contains, is and is-not, numbers use eq, gt and lt, and selects use is and is-not.",
    },
  ],
  "bulk-action-bar": [
    {
      name: "BulkActionBar",
      description:
        "A floating toolbar that springs in while something is selected. Put BulkActionBarButton children inside. Needs the motion package.",
      props: [
        {
          name: "selectedCount",
          type: "number",
          required: true,
          description:
            "Number of selected items. The bar shows while it is above 0.",
        },
        {
          name: "onClear",
          type: "() => void",
          required: true,
          description: "Called by the clear button and by Escape.",
        },
        {
          name: "placement",
          type: '"viewport" | "container"',
          default: '"viewport"',
          description:
            "viewport portals the bar to the bottom of the screen, container positions it inside the nearest relative parent.",
        },
        {
          name: "aria-label",
          type: "string",
          default: '"Bulk actions"',
          description: "Name of the toolbar.",
        },
      ],
      rest: "Toolbar root",
    },
    {
      name: "BulkActionBarButton",
      description: "A Button that joins the toolbar's arrow key navigation.",
      props: [
        {
          name: "variant",
          type: "Button variant",
          default: '"ghost"',
          description: "Button style.",
        },
        {
          name: "size",
          type: "Button size",
          default: '"sm"',
          description: "Button size.",
        },
      ],
      rest: "Button",
    },
  ],
  tour: [
    {
      name: "Tour",
      description:
        "Wrap the page in Tour and mark elements with TourTarget. Arrow keys move between steps and Escape ends the tour. Focus stays in the card and returns to the opener when it closes.",
      props: [
        {
          name: "steps",
          type: "TourStep[]",
          required: true,
          description:
            'Steps in order: { target, title, description?, side? }, where side is "top", "right", "bottom" or "left".',
        },
        {
          name: "open",
          type: "boolean",
          description: "Controlled open state.",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial open state when uncontrolled.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Called when the tour starts or ends.",
        },
        {
          name: "step",
          type: "number",
          description: "Controlled zero-based step.",
        },
        {
          name: "defaultStep",
          type: "number",
          default: "0",
          description: "Initial step when uncontrolled.",
        },
        {
          name: "onStepChange",
          type: "(step: number) => void",
          description: "Called when the step changes.",
        },
        {
          name: "onComplete",
          type: "() => void",
          description: "Called after Finish on the last step.",
        },
      ],
    },
    {
      name: "TourTarget",
      description:
        "Marks its single child as a tour target without adding an element.",
      props: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "Matches a step's target.",
        },
      ],
    },
  ],
}
