"use client"

import * as React from "react"
import { FolderGit2Icon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function AddCodebaseModal({
  onAddCodebase,
}: {
  onAddCodebase: (input: {
    name: string
    path: string
    fileCount?: number
    totalLines?: number
    gitBranch?: string
  }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [path, setPath] = React.useState("")
  const [gitBranch, setGitBranch] = React.useState("main")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !path.trim()) {
      toast("Please enter a codebase name and folder path")
      return
    }
    onAddCodebase({
      name: name.trim(),
      path: path.trim(),
      gitBranch: gitBranch.trim() || "main",
    })
    setName("")
    setPath("")
    setOpen(false)
    toast(`Added codebase ${name}`)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 border-border/60 bg-card/50">
            <FolderGit2Icon className="size-3.5 text-primary" />
            <span>Add Codebase</span>
          </Button>
        }
      />
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FolderGit2Icon className="size-4 text-primary" />
            Point to Codebase
          </SheetTitle>
          <SheetDescription>
            Point the Token Runway Tracker to your local project folder to track Git diffs and token hotspots.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="cb-name">Codebase Name</FieldLabel>
              <Input
                id="cb-name"
                placeholder="e.g. acme-web or backend-api"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldDescription>Identifier used to group token runway metrics.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="cb-path">Folder Path / Local Directory</FieldLabel>
              <Input
                id="cb-path"
                placeholder="e.g. C:\Users\dev\projects\acme-web"
                value={path}
                onChange={(e) => setPath(e.target.value)}
              />
              <FieldDescription>Local directory path on your filesystem.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="cb-branch">Default Git Branch</FieldLabel>
              <Input
                id="cb-branch"
                placeholder="main"
                value={gitBranch}
                onChange={(e) => setGitBranch(e.target.value)}
              />
            </Field>
          </FieldGroup>

          <SheetFooter className="px-0">
            <Button type="submit">Start Tracking Codebase</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
