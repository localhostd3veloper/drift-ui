import {
  AvatarGroup,
  AvatarGroupItem,
} from "@/registry/default/ui/avatar-group"

const VIEWERS = [
  { name: "Noor Haddad", status: "online" },
  { name: "Kofi Mensah", status: "away" },
  { name: "Ilse Marchetti", status: "busy" },
  { name: "Tomasz Wierzba", status: "offline" },
] as const

export function AvatarGroupStatusPreview() {
  return (
    <AvatarGroup aria-label="Viewing this document">
      {VIEWERS.map((viewer) => (
        <AvatarGroupItem
          key={viewer.name}
          name={viewer.name}
          status={viewer.status}
        />
      ))}
    </AvatarGroup>
  )
}
