import { RecurrenceEditor } from "@/registry/default/ui/recurrence-editor"

export function RecurrenceEditorEndsAfterPreview() {
  return (
    <RecurrenceEditor
      aria-label="Repeat"
      defaultValue="FREQ=DAILY;COUNT=10"
      start={new Date(2026, 10, 2, 8, 30)}
      className="w-full max-w-md"
    />
  )
}
