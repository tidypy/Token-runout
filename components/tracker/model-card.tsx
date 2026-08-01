"use client"

import * as React from "react"
import { ActivityIcon, FolderGit2Icon, InfoIcon, MoreVerticalIcon, Trash2Icon, ZapIcon } from "lucide-react"
import { toast } from "sonner"

import { Sparkline } from "@/components/tracker/sparkline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { computeForecast, dailyCostSeries, remainingBudget } from "@/lib/tracker/forecast"
import { fmtRunOutDate, fmtRunway, fmtUsd } from "@/lib/tracker/format"
import { getPricing, PROVIDERS } from "@/lib/tracker/pricing"
import type { TrackedModel, UsageEntry } from "@/lib/tracker/types"
import { cn } from "@/lib/utils"

const STATUS_TEXT = {
  ok: "text-primary",
  warning: "text-warning",
  critical: "text-destructive",
} as const

const STATUS_COLOR = {
  ok: "var(--chart-1)",
  warning: "var(--chart-2)",
  critical: "var(--chart-3)",
} as const

const CONFIDENCE_LABEL = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
} as const

export function ModelCard({
  model,
  onRemove,
}: {
  model: TrackedModel
  onRemove: (id: string) => void
  onLogUsage?: (id: string, entry: UsageEntry) => void
}) {
  const forecast = computeForecast(model)
  const pricing = getPricing(model.modelId)
  const remaining = remainingBudget(model)
  const series = dailyCostSeries(model, 14)
  const spentPct = model.budgetUsd > 0 ? Math.min((forecast.spentUsd / model.budgetUsd) * 100, 100) : 0
  const isFreePlan = model.budgetUsd === 0 || model.modelId.includes("free")

  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl transition-all">
      <CardHeader className="flex items-start gap-2 px-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{pricing?.label ?? model.modelId}</span>
            <ForecastInfo model={model} forecast={forecast} />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {PROVIDERS[model.provider]?.label || model.provider}
            </Badge>
            {isFreePlan ? (
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <ZapIcon className="mr-0.5 size-3" /> Free Tier
              </Badge>
            ) : (
              <Badge variant="outline" className="max-w-32 text-[10px]">
                <FolderGit2Icon aria-hidden="true" />
                <span className="truncate">{model.codebase}</span>
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Model actions">
                <MoreVerticalIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  onRemove(model.id)
                  toast(`Removed ${pricing?.label ?? model.modelId}`)
                }}
              >
                <Trash2Icon />
                Remove plan
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Runs out in</span>
            <span className={cn("font-mono text-2xl font-semibold tabular-nums", STATUS_TEXT[forecast.status])}>
              {fmtRunway(forecast.runwayDays)}
            </span>
            <span className="text-xs text-muted-foreground">
              {forecast.runwayMinDays !== null && forecast.runwayMaxDays !== null
                ? `range ${fmtRunway(forecast.runwayMinDays)} – ${fmtRunway(forecast.runwayMaxDays)}`
                : "rolling limit tracking active"}
            </span>
          </div>
          <div className="w-28 shrink-0">
            <Sparkline data={series} color={STATUS_COLOR[forecast.status]} className="h-12 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md border border-border/60 bg-background/40 p-2">
          <BurnStat label="3d burn" value={forecast.burn3} />
          <BurnStat label="7d burn" value={forecast.burn7} />
          <BurnStat label="14d burn" value={forecast.burn14} />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {isFreePlan ? "Free Tier Quota Account" : `${fmtUsd(remaining)} left of ${fmtUsd(model.budgetUsd)}`}
            </span>
            <span className={cn("font-medium", STATUS_TEXT[forecast.status])}>
              {forecast.runOutDate ? fmtRunOutDate(forecast.runOutDate) : "—"}
            </span>
          </div>
          <Progress value={isFreePlan ? 35 : spentPct} aria-label="Plan quota progress" className="h-1.5" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-4">
        <Badge variant={forecast.confidence === "low" ? "outline" : "secondary"} className="text-[10px]">
          {CONFIDENCE_LABEL[forecast.confidence]}
          {forecast.isEstimated ? " · estimated" : ""}
        </Badge>
        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
          <ActivityIcon className="mr-1 size-3" /> Auto-Sync Active
        </Badge>
      </CardFooter>
    </Card>
  )
}

function BurnStat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="font-mono text-xs font-medium tabular-nums">
        {value !== null ? `${fmtUsd(value)}/d` : "—"}
      </span>
    </div>
  )
}

function ForecastInfo({
  model,
  forecast,
}: {
  model: TrackedModel
  forecast: ReturnType<typeof computeForecast>
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="size-5 text-muted-foreground" aria-label="How this forecast works">
            <InfoIcon className="size-3.5" />
          </Button>
        }
      />
      <PopoverContent className="w-72 text-xs" align="start">
        <PopoverHeader>
          <PopoverTitle className="text-sm">How this forecast works</PopoverTitle>
          <PopoverDescription>
            Runway = remaining credits ÷ rolling average burn rate. The 7-day average is preferred, falling back to 3d
            then 14d windows.
          </PopoverDescription>
        </PopoverHeader>
        <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-muted-foreground">
          <li>
            The range comes from the fastest and slowest of your 3d / 7d / 14d burn rates.
          </li>
          <li>
            Confidence is based on how many days of data exist ({forecast.dataDays} logged) and how stable the trend
            is.
          </li>
          {forecast.isEstimated ? (
            <li>No usage is logged yet, so this uses expected daily tokens with a wide ±50% band.</li>
          ) : null}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
