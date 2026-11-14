import { diffWords, type DiffSegment } from "@/registry/default/lib/diff.ts"

export type MergeFieldChoice = "ours" | "theirs" | "custom"

export type MergeField = {
  name: string
  label?: string
  ours: string
  theirs: string
  base?: string
}

export type MergeFieldResolution = {
  choice: MergeFieldChoice
  customValue?: string
}

export type MergeResolutions = Record<string, MergeFieldResolution>

export type MergedRecord = Record<string, string>

export type FieldDiff = {
  identical: boolean
  oursSegments: DiffSegment[]
  theirsSegments: DiffSegment[]
}

export function isFieldConflict(field: MergeField): boolean {
  return field.ours !== field.theirs
}

export function getFieldDiff(ours: string, theirs: string): FieldDiff {
  if (ours === theirs) {
    return {
      identical: true,
      oursSegments: ours.length > 0 ? [{ text: ours, changed: false }] : [],
      theirsSegments:
        theirs.length > 0 ? [{ text: theirs, changed: false }] : [],
    }
  }

  const diff = diffWords(ours, theirs)
  if (diff) {
    return {
      identical: false,
      oursSegments: diff.old,
      theirsSegments: diff.new,
    }
  }

  return {
    identical: false,
    oursSegments: ours.length > 0 ? [{ text: ours, changed: true }] : [],
    theirsSegments: theirs.length > 0 ? [{ text: theirs, changed: true }] : [],
  }
}

export function isFieldResolved(resolution?: MergeFieldResolution): boolean {
  if (!resolution) return false
  if (resolution.choice === "ours" || resolution.choice === "theirs")
    return true
  if (resolution.choice === "custom")
    return typeof resolution.customValue === "string"
  return false
}

export function getUnresolvedCount(
  fields: MergeField[],
  resolutions: MergeResolutions
): number {
  return fields.filter(
    (field) =>
      isFieldConflict(field) && !isFieldResolved(resolutions[field.name])
  ).length
}

export function isAllResolved(
  fields: MergeField[],
  resolutions: MergeResolutions
): boolean {
  return getUnresolvedCount(fields, resolutions) === 0
}

export function getMergedRecord(
  fields: MergeField[],
  resolutions: MergeResolutions
): MergedRecord {
  const record: MergedRecord = {}
  for (const field of fields) {
    const res = resolutions[field.name]
    if (res?.choice === "theirs") {
      record[field.name] = field.theirs
    } else if (res?.choice === "custom") {
      record[field.name] = res.customValue ?? ""
    } else {
      record[field.name] = field.ours
    }
  }
  return record
}

export function resolveAll(
  fields: MergeField[],
  choice: "ours" | "theirs",
  existing: MergeResolutions = {}
): MergeResolutions {
  const result: MergeResolutions = { ...existing }
  for (const field of fields) {
    if (isFieldConflict(field)) {
      result[field.name] = { choice }
    }
  }
  return result
}

export function getConflictAnnouncement(unresolvedCount: number): string {
  if (unresolvedCount === 0) return "All conflicts resolved"
  if (unresolvedCount === 1) return "1 unresolved conflict remaining"
  return `${unresolvedCount} unresolved conflicts remaining`
}
