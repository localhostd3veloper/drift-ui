import { RecurrenceEditor } from "@/registry/default/ui/recurrence-editor"

const SPRINT_REVIEW = new Date(2026, 10, 3, 10, 0)

export function RecurrenceEditorPreview() {
  return (
    <RecurrenceEditor
      aria-label="Repeat"
      defaultValue="FREQ=WEEKLY;INTERVAL=2;BYDAY=TU"
      start={SPRINT_REVIEW}
      showPreview={3}
      className="w-full max-w-md"
    />
  )
}
