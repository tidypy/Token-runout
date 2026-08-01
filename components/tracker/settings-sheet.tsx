"use client"

import * as React from "react"
import { DownloadIcon, RotateCcwIcon, SettingsIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Tracker } from "@/hooks/use-tracker"

export function SettingsSheet({ tracker }: { tracker: Tracker }) {
  const fileRef = React.useRef<HTMLInputElement>(null)

  function handleExport() {
    const blob = new Blob([tracker.exportData()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `token-runway-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast("Exported tracker data")
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        tracker.importData(String(reader.result))
        toast("Imported tracker data")
      } catch {
        toast("Import failed — not a valid export file")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Settings">
            <SettingsIcon />
          </Button>
        }
      />
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            All data lives in this browser — local-first, nothing leaves your machine.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Export data</FieldLabel>
              <FieldDescription>Download all tracked models and usage as JSON.</FieldDescription>
              <Button variant="outline" size="sm" onClick={handleExport} className="w-fit">
                <DownloadIcon data-icon="inline-start" />
                Export JSON
              </Button>
            </Field>
            <Field>
              <FieldLabel>Import data</FieldLabel>
              <FieldDescription>Restore from a previous export. Replaces current data.</FieldDescription>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="sr-only"
                onChange={handleImportFile}
                aria-label="Import JSON file"
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="w-fit">
                <UploadIcon data-icon="inline-start" />
                Import JSON
              </Button>
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Demo data</FieldLabel>
              <FieldDescription>Replace everything with fresh sample models and usage history.</FieldDescription>
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => {
                  tracker.resetDemo()
                  toast("Demo data restored")
                }}
              >
                <RotateCcwIcon data-icon="inline-start" />
                Reset demo data
              </Button>
            </Field>
            <Field>
              <FieldLabel>Danger zone</FieldLabel>
              <FieldDescription>Remove all tracked models and usage. This cannot be undone.</FieldDescription>
              <Button
                variant="destructive"
                size="sm"
                className="w-fit"
                onClick={() => {
                  tracker.clearAll()
                  toast("All data cleared")
                }}
              >
                <Trash2Icon data-icon="inline-start" />
                Clear everything
              </Button>
            </Field>
          </FieldGroup>
        </div>
      </SheetContent>
    </Sheet>
  )
}
