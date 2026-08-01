"use client"

import * as React from "react"
import { PlusIcon, ZapIcon } from "lucide-react"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { NewModelInput } from "@/hooks/use-tracker"
import { PRICING_CATALOG, PROVIDERS } from "@/lib/tracker/pricing"
import type { ProviderId } from "@/lib/tracker/types"

const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[]

export function AddModelSheet({ onAdd }: { onAdd: (input: NewModelInput) => void }) {
  const [open, setOpen] = React.useState(false)
  const [provider, setProvider] = React.useState<ProviderId>("google")
  const [modelId, setModelId] = React.useState<string>("google-pro-plan")
  const [codebase, setCodebase] = React.useState("Token-runout")
  const [budget, setBudget] = React.useState("100")
  const [warnDays, setWarnDays] = React.useState("7")
  const [expIn, setExpIn] = React.useState("")
  const [expOut, setExpOut] = React.useState("")

  const providerModels = PRICING_CATALOG.filter((p) => p.provider === provider)

  function handleProviderChange(value: string | null) {
    if (!value) return
    const next = value as ProviderId
    setProvider(next)
    const first = PRICING_CATALOG.find((p) => p.provider === next)
    if (first) setModelId(first.modelId)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const budgetUsd = Number(budget) || 0
    if (!modelId || !codebase.trim()) {
      toast("Select a provider, plan/model, and codebase")
      return
    }
    onAdd({
      provider,
      modelId,
      codebase: codebase.trim(),
      budgetUsd,
      warnDays: Math.max(Number(warnDays) || 7, 1),
      expectedDailyInputTokens: Number(expIn) || undefined,
      expectedDailyOutputTokens: Number(expOut) || undefined,
    })
    setOpen(false)
    toast("Account plan added — forecasting enabled")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm" className="gap-1">
            <PlusIcon className="size-3.5" />
            <span>Track Plan</span>
          </Button>
        }
      />
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ZapIcon className="size-4 text-warning" />
            Track Subscription Plan / Model
          </SheetTitle>
          <SheetDescription>
            Select your provider subscription tier (e.g. Google Pro Plan, Claude Free Tier, ChatGPT Free Tier) or API model.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Provider</FieldLabel>
              <Select
                value={provider}
                onValueChange={handleProviderChange}
                items={PROVIDER_IDS.map((id) => ({ value: id, label: PROVIDERS[id].label }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PROVIDER_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        {PROVIDERS[id].label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Plan / Model</FieldLabel>
              <Select
                value={modelId}
                onValueChange={(v) => v && setModelId(v as string)}
                items={providerModels.map((p) => ({ value: p.modelId, label: p.label }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {providerModels.map((p) => (
                      <SelectItem key={p.modelId} value={p.modelId}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>Choose your active plan tier (Pro, Free Tier, Team).</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="codebase">Codebase</FieldLabel>
              <Input
                id="codebase"
                placeholder="e.g. Token-runout"
                value={codebase}
                onChange={(e) => setCodebase(e.target.value)}
              />
              <FieldDescription>Codebase or project name for budget allocation.</FieldDescription>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="budget">Budget (USD)</FieldLabel>
                <Input
                  id="budget"
                  type="number"
                  min={0}
                  step="1"
                  placeholder="0 for free plans"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="warn-days">Warn under (days)</FieldLabel>
                <Input
                  id="warn-days"
                  type="number"
                  min={1}
                  value={warnDays}
                  onChange={(e) => setWarnDays(e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
          <SheetFooter className="px-0">
            <Button type="submit">Start Tracking Plan</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
