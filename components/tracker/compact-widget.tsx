"use client"

import * as React from "react"
import { GaugeIcon, Maximize2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { computeForecast, remainingBudget } from "@/lib/tracker/forecast"
import { fmtRunway } from "@/lib/tracker/format"
import { getPricing } from "@/lib/tracker/pricing"
import type { TrackedModel } from "@/lib/tracker/types"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    pywebview?: {
      api?: {
        set_mode?: (mode: string) => void
        set_always_on_top?: (onTop: boolean) => void
      }
    }
  }
}

export function CompactWidget({
  models,
  onExpand,
}: {
  models: TrackedModel[]
  onExpand: () => void
}) {
  const rows = models
    .map((m) => ({ model: m, forecast: computeForecast(m), remaining: remainingBudget(m) }))
    .sort((a, b) => (a.forecast.runwayDays ?? Infinity) - (b.forecast.runwayDays ?? Infinity))

  const handleExpand = () => {
    if (typeof window !== "undefined" && window.pywebview?.api?.set_mode) {
      window.pywebview.api.set_mode("expanded")
    }
    onExpand()
  }

  return (
    <aside
      aria-label="Token runway widget"
      className="fixed right-4 bottom-4 z-50 w-72 rounded-xl border border-border/60 bg-card/90 shadow-2xl backdrop-blur-xl transition-all"
    >
      <header
        className="flex items-center justify-between border-b border-border/60 px-3 py-2 cursor-grab active:cursor-grabbing select-none"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <div className="flex items-center gap-1.5">
          <GaugeIcon className="size-3.5 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold">Runway</span>
        </div>
        <div style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
          <Button variant="ghost" size="icon-xs" onClick={handleExpand} aria-label="Expand to full view">
            <Maximize2Icon />
          </Button>
        </div>
      </header>
      <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto p-3">
        {rows.length === 0 ? (
          <li className="py-2 text-center text-xs text-muted-foreground">No models tracked</li>
        ) : (
          rows.map(({ model, forecast, remaining }) => {
            const pct = model.budgetUsd > 0 ? (remaining / model.budgetUsd) * 100 : 0
            return (
              <li key={model.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs">{getPricing(model.modelId)?.label ?? model.modelId}</span>
                  <Badge
                    variant={forecast.status === "critical" ? "destructive" : "secondary"}
                    className={cn(
                      "shrink-0 font-mono text-[10px] tabular-nums",
                      forecast.status === "warning" && "bg-warning/15 text-warning-foreground",
                    )}
                  >
                    {fmtRunway(forecast.runwayDays)}
                  </Badge>
                </div>
                <Progress
                  value={pct}
                  className="h-1"
                  aria-label={`${getPricing(model.modelId)?.label ?? model.modelId}: ${Math.round(pct)}% budget remaining`}
                />
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}

