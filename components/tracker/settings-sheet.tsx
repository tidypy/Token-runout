"use client"

import * as React from "react"
import {
  CheckIcon,
  DownloadIcon,
  KeyIcon,
  RadioIcon,
  RotateCcwIcon,
  SettingsIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
  const [apiKeys, setApiKeys] = React.useState<Record<string, string>>({})

  function handleSaveApiKey(providerId: string, providerName: string) {
    const keyVal = apiKeys[providerId] ?? ""
    if (!keyVal.trim()) {
      toast(`Please enter an API key for ${providerName}`)
      return
    }
    tracker.toggleQuotaConnectionMode(providerId as any, "api-key", keyVal.trim())
    toast(`Connected & Saved ${providerName} API Key! Dashboard quota sync active.`)
  }

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
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Settings & Telemetry Auth</SheetTitle>
          <SheetDescription>
            Configure Direct API Keys or Local Telemetry sync mode per provider. Local-first & secure.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <FieldGroup>
            <div className="flex flex-col gap-1">
              <FieldLabel className="text-sm font-semibold">Provider Telemetry Auth</FieldLabel>
              <FieldDescription>
                Choose between Direct API Key or Local Telemetry session sync for your providers.
              </FieldDescription>
            </div>

            <div className="flex flex-col gap-3">
              {tracker.quotas.map((quota) => (
                <div
                  key={quota.providerId}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{quota.providerName}</span>
                    <Badge variant={quota.connectionMode === "api-key" ? "default" : "outline"} className="text-[10px]">
                      {quota.connectionMode === "api-key"
                        ? quota.apiKey
                          ? "🟢 Live API Key Saved"
                          : "Direct API Key"
                        : "Local Telemetry"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={quota.connectionMode === "api-key" ? "secondary" : "outline"}
                      size="xs"
                      className="flex-1 gap-1 text-[10px]"
                      onClick={() => {
                        tracker.toggleQuotaConnectionMode(quota.providerId, "api-key")
                        toast(`Set ${quota.providerName} to Direct API Key Mode`)
                      }}
                    >
                      <KeyIcon className="size-3 text-primary" /> Direct API Key
                    </Button>
                    <Button
                      variant={quota.connectionMode === "local-telemetry" ? "secondary" : "outline"}
                      size="xs"
                      className="flex-1 gap-1 text-[10px]"
                      onClick={() => {
                        tracker.toggleQuotaConnectionMode(quota.providerId, "local-telemetry")
                        toast(`Set ${quota.providerName} to Local Telemetry Mode`)
                      }}
                    >
                      <RadioIcon className="size-3 text-secondary-foreground" /> Local Telemetry
                    </Button>
                  </div>

                  {quota.connectionMode === "api-key" && (
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        type="password"
                        placeholder={`Enter ${quota.providerName} API Key...`}
                        value={apiKeys[quota.providerId] ?? quota.apiKey ?? ""}
                        onChange={(e) => {
                          const val = e.target.value
                          setApiKeys((prev) => ({ ...prev, [quota.providerId]: val }))
                        }}
                        className="h-7 text-xs font-mono bg-background flex-1"
                      />
                      <Button
                        type="button"
                        size="xs"
                        variant="default"
                        className="h-7 text-[10px] gap-1"
                        onClick={() => handleSaveApiKey(quota.providerId, quota.providerName)}
                      >
                        <CheckIcon className="size-3" /> Save Key
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <FieldSeparator />

            <Field>
              <FieldLabel>Export data</FieldLabel>
              <FieldDescription>Download all tracked models, quotas, and codebase metrics as JSON.</FieldDescription>
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
              <FieldDescription>Replace everything with fresh sample quotas, models, and Git diff history.</FieldDescription>
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
