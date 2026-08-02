"use client"

import * as React from "react"
import {
  CheckIcon,
  DownloadIcon,
  KeyIcon,
  PlusIcon,
  RadioIcon,
  SettingsIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
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
import type { ProviderId } from "@/lib/tracker/types"

export function SettingsSheet({ tracker }: { tracker: Tracker }) {
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [keyInputs, setKeyInputs] = React.useState<Record<string, { name: string; key: string }>>({})

  function handleAddApiKey(providerId: ProviderId, providerName: string) {
    const input = keyInputs[providerId] || { name: "", key: "" }
    if (!input.key.trim()) {
      toast(`Please enter an API key for ${providerName}`)
      return
    }
    const labelName = input.name.trim() || `API Key ${((tracker.quotas.find(q => q.providerId === providerId)?.apiKeys?.length || 0) + 1)}`
    tracker.addApiKey(providerId, labelName, input.key.trim())
    setKeyInputs((prev) => ({ ...prev, [providerId]: { name: "", key: "" } }))
    toast(`Saved ${labelName} for ${providerName}!`)
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
            Manage multiple Direct API Keys or Local Telemetry sync mode per provider. Local-first & secure.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <FieldGroup>
            <div className="flex flex-col gap-1">
              <FieldLabel className="text-sm font-semibold">Provider Telemetry & Multi-Key Auth</FieldLabel>
              <FieldDescription>
                Store multiple API keys per provider (Dev, Staging, Prod) or use Local Telemetry sync.
              </FieldDescription>
            </div>

            <div className="flex flex-col gap-3">
              {tracker.quotas.map((quota) => {
                const keysList = quota.apiKeys || (quota.apiKey ? [{ id: "legacy-1", name: "Primary API Key", key: quota.apiKey, createdAt: "" }] : [])
                const currentInput = keyInputs[quota.providerId] || { name: "", key: "" }

                return (
                  <div
                    key={quota.providerId}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{quota.providerName}</span>
                      <Badge variant={quota.connectionMode === "api-key" ? "default" : "outline"} className="text-[10px]">
                        {quota.connectionMode === "api-key"
                          ? keysList.length > 0
                            ? `🟢 ${keysList.length} API Key${keysList.length > 1 ? "s" : ""}`
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
                        <KeyIcon className="size-3 text-primary" /> Direct API Mode
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

                    {/* Saved Keys List */}
                    {quota.connectionMode === "api-key" && (
                      <div className="flex flex-col gap-2 pt-1 border-t border-border/40">
                        {keysList.length > 0 && (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-medium text-muted-foreground">Saved API Keys:</span>
                            {keysList.map((k) => (
                              <div
                                key={k.id}
                                className="flex items-center justify-between gap-2 rounded border border-border/50 bg-background/60 px-2 py-1 text-[11px]"
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <KeyIcon className="size-3 text-primary shrink-0" />
                                  <span className="font-medium text-foreground truncate">{k.name}</span>
                                  <span className="font-mono text-muted-foreground text-[10px]">
                                    ({k.key.slice(0, 4)}••••{k.key.slice(-4)})
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-5 text-muted-foreground hover:text-destructive p-0"
                                  onClick={() => {
                                    tracker.removeApiKey(quota.providerId, k.id)
                                    toast(`Removed ${k.name}`)
                                  }}
                                  title="Remove API Key"
                                >
                                  <XIcon className="size-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add New Key Form */}
                        <div className="flex flex-col gap-1.5 pt-1">
                          <span className="text-[10px] font-medium text-muted-foreground">+ Add Another API Key:</span>
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="text"
                              placeholder="Label (e.g. Dev Key)"
                              value={currentInput.name}
                              onChange={(e) =>
                                setKeyInputs((prev) => ({
                                  ...prev,
                                  [quota.providerId]: { ...currentInput, name: e.target.value },
                                }))
                              }
                              className="h-7 text-[11px] bg-background w-28 shrink-0"
                            />
                            <Input
                              type="password"
                              placeholder="sk-xxxxxxxx..."
                              value={currentInput.key}
                              onChange={(e) =>
                                setKeyInputs((prev) => ({
                                  ...prev,
                                  [quota.providerId]: { ...currentInput, key: e.target.value },
                                }))
                              }
                              className="h-7 text-[11px] font-mono bg-background flex-1"
                            />
                            <Button
                              type="button"
                              size="xs"
                              variant="default"
                              className="h-7 text-[10px] gap-1 px-2"
                              onClick={() => handleAddApiKey(quota.providerId, quota.providerName)}
                            >
                              <PlusIcon className="size-3" /> Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
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
