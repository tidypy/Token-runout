"use client"

import { TrendingDownIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { computeForecast, remainingBudget } from "@/lib/tracker/forecast"
import { fmtRunway, fmtUsd } from "@/lib/tracker/format"
import { getPricing } from "@/lib/tracker/pricing"
import type { TrackedModel } from "@/lib/tracker/types"
import { cn } from "@/lib/utils"

const STATUS_TEXT = {
  ok: "text-primary",
  warning: "text-warning",
  critical: "text-destructive",
} as const

export function ForecastPanel({ models }: { models: TrackedModel[] }) {
  const rows = models
    .map((m) => ({ model: m, forecast: computeForecast(m), remaining: remainingBudget(m) }))
    .sort((a, b) => (a.forecast.runwayDays ?? Infinity) - (b.forecast.runwayDays ?? Infinity))

  const totalRemaining = rows.reduce((s, r) => s + r.remaining, 0)
  const totalBurn = rows.reduce((s, r) => s + (r.forecast.burnDaily ?? 0), 0)
  const soonest = rows.find((r) => r.forecast.runwayDays !== null)

  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingDownIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          Runway forecast
        </CardTitle>
        <CardDescription className="text-xs">Across all tracked models, sorted by urgency.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5 rounded-md border border-border/60 bg-background/40 p-2.5">
            <span className="text-[10px] text-muted-foreground">Credits remaining</span>
            <span className="font-mono text-lg font-semibold tabular-nums">{fmtUsd(totalRemaining)}</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md border border-border/60 bg-background/40 p-2.5">
            <span className="text-[10px] text-muted-foreground">Combined burn</span>
            <span className="font-mono text-lg font-semibold tabular-nums">{fmtUsd(totalBurn)}/d</span>
          </div>
        </div>

        {soonest ? (
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 p-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">First to run out</span>
              <span className="text-xs font-medium">
                {getPricing(soonest.model.modelId)?.label ?? soonest.model.modelId}
                <span className="text-muted-foreground"> · {soonest.model.codebase}</span>
              </span>
            </div>
            <span
              className={cn(
                "font-mono text-sm font-semibold tabular-nums",
                STATUS_TEXT[soonest.forecast.status],
              )}
            >
              {fmtRunway(soonest.forecast.runwayDays)}
            </span>
          </div>
        ) : null}

        <Separator />

        <ul className="flex flex-col gap-2.5">
          {rows.map(({ model, forecast, remaining }) => {
            const pct = model.budgetUsd > 0 ? (remaining / model.budgetUsd) * 100 : 0
            return (
              <li key={model.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate">
                    {getPricing(model.modelId)?.label ?? model.modelId}
                    <span className="text-muted-foreground"> · {model.codebase}</span>
                  </span>
                  <Badge
                    variant={forecast.status === "ok" ? "secondary" : "destructive"}
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
                  aria-label={`${getPricing(model.modelId)?.label ?? model.modelId}: ${Math.round(pct)}% of budget remaining`}
                />
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
