import { RecurrenceEditor } from "@/registry/default/ui/recurrence-editor"

export function RecurrenceEditorMonthlyPreview() {
  return (
    <RecurrenceEditor
      aria-label="Repeat"
      defaultValue="FREQ=MONTHLY;BYDAY=1MO"
      start={new Date(2026, 10, 2, 9, 0)}
      showPreview={3}
      className="w-full max-w-md"
    />
  )
}
