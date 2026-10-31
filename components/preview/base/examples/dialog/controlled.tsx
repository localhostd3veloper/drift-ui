"use client"

import * as React from "react"

import { Button } from "@/registry/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/base/ui/dialog"

export function DialogControlledPreview() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Show details
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deployment details</DialogTitle>
            <DialogDescription>
              Version 2.14.0 finished in 3 minutes and 12 seconds.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
