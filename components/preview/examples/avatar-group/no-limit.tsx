import {
  AvatarGroup,
  AvatarGroupItem,
} from "@/registry/default/ui/avatar-group"

const MEMBERS = ["Noor Haddad", "Kofi Mensah", "Ilse Marchetti"]

export function AvatarGroupNoLimitPreview() {
  return (
    <AvatarGroup aria-label="Project members">
      {MEMBERS.map((name) => (
        <AvatarGroupItem key={name} name={name} />
      ))}
    </AvatarGroup>
  )
}
