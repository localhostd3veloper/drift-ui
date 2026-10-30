import {
  AvatarGroup,
  AvatarGroupItem,
} from "@/registry/default/ui/avatar-group"

const REVIEWERS = [
  {
    id: "1",
    name: "Ana Lima",
    image: "https://github.com/shadcn.png",
    status: "online",
  },
  { id: "2", name: "Kenji Sato", status: "busy" },
  { id: "3", name: "Priya Nair", status: "away" },
  { id: "4", name: "Tomás Ruiz" },
  { id: "5", name: "Lea Becker", status: "online" },
  { id: "6", name: "Omar Haddad", status: "offline" },
] as const

export function AvatarGroupPreview() {
  return (
    <AvatarGroup aria-label="Reviewers" max={4}>
      {REVIEWERS.map((reviewer) => (
        <AvatarGroupItem
          key={reviewer.id}
          name={reviewer.name}
          src={"image" in reviewer ? reviewer.image : undefined}
          status={"status" in reviewer ? reviewer.status : undefined}
        />
      ))}
    </AvatarGroup>
  )
}
