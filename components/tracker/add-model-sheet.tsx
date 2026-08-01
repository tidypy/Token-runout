"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
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
  const [provider, setProvider] = React.useState<ProviderId>("openai")
  const [modelId, setModelId] = React.useState<string>("gpt-4.1-mini")
  const [codebase, setCodebase] = React.useState("")
  const [budget, setBudget] = React.useState("50")
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
    const budgetUsd = Number(budget)
    if (!modelId || !codebase.trim() || !budgetUsd || budgetUsd <= 0) {
      toast("Fill in model, codebase, and a positive budget")
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
    setCodebase("")
    setExpIn("")
    setExpOut("")
    setOpen(false)
    toast("Model added — forecasting is on")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            Track model
          </Button>
        }
      />
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Track a model</SheetTitle>
          <SheetDescription>
            Every model gets an automatic runway forecast. Add expected daily tokens to bootstrap the estimate before
            real usage exists.
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
              <FieldLabel>Model</FieldLabel>
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
              <FieldDescription>Pricing is pulled from the live catalog automatically.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="codebase">Codebase</FieldLabel>
              <Input
                id="codebase"
                placeholder="e.g. acme-web"
                value={codebase}
                onChange={(e) => setCodebase(e.target.value)}
              />
              <FieldDescription>Budgets are tracked per codebase.</FieldDescription>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="budget">Budget (USD)</FieldLabel>
                <Input
                  id="budget"
                  type="number"
                  min={1}
                  step="0.01"
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
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="exp-in">Est. daily input</FieldLabel>
                <Input
                  id="exp-in"
                  type="number"
                  min={0}
                  placeholder="tokens"
                  value={expIn}
                  onChange={(e) => setExpIn(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="exp-out">Est. daily output</FieldLabel>
                <Input
                  id="exp-out"
                  type="number"
                  min={0}
                  placeholder="tokens"
                  value={expOut}
                  onChange={(e) => setExpOut(e.target.value)}
                />
              </Field>
            </div>
          </FieldGroup>
          <SheetFooter className="px-0">
            <Button type="submit">Start tracking</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
