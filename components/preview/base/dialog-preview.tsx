import { Button } from "@/registry/base/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/base/ui/dialog"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/base/ui/label"

export function DialogPreview() {
  return (
    <>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Edit profile
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your display name. Changes apply immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input id="display-name" defaultValue="Ada Lovelace" />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button />}>Save</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
