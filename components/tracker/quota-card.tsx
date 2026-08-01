"use client"

import * as React from "react"
import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  KeyIcon,
  RadioIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getQuotaStatus } from "@/lib/tracker/quota"
import type { ConnectionMode, ProviderQuota } from "@/lib/tracker/types"
import { cn } from "@/lib/utils"

export function QuotaCard({
  quota,
  onToggleConnectionMode,
}: {
  quota: ProviderQuota
  onToggleConnectionMode?: (mode: ConnectionMode) => void
}) {
  const fiveHourStatus = getQuotaStatus(quota.fiveHourLimit.usedPct)
  const weeklyStatus = getQuotaStatus(quota.weeklyLimit.usedPct)

  const isExhausted = quota.fiveHourLimit.usedPct >= 100 || quota.weeklyLimit.usedPct >= 100
  const isWarning = fiveHourStatus === "warning" || weeklyStatus === "warning"

  const hasApiKey = Boolean(quota.apiKey && quota.apiKey.trim().length > 0)
  const maskedKey = hasApiKey
    ? `${quota.apiKey!.slice(0, 4)}••••${quota.apiKey!.slice(-4)}`
    : null

  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl transition-all hover:border-border/90">
      <CardHeader className="flex items-start justify-between px-4 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">{quota.providerName}</CardTitle>
            <Badge
              variant={isExhausted ? "destructive" : isWarning ? "secondary" : "outline"}
              className="text-[10px] font-mono"
            >
              {isExhausted ? (
                <>
                  <AlertTriangleIcon className="mr-1 size-3 animate-pulse" /> 100% Limit Reached
                </>
              ) : isWarning ? (
                <>
                  <ClockIcon className="mr-1 size-3" /> High Utilization
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="mr-1 size-3 text-primary" /> Normal Quota
                </>
              )}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Live rate limits & quota refresh timers
          </CardDescription>
        </div>

        {/* Connection Mode Selector Pill */}
        <Button
          variant="outline"
          size="xs"
          className="h-6 text-[10px] gap-1 bg-background/50 border-border/60"
          onClick={() =>
            onToggleConnectionMode?.(
              quota.connectionMode === "api-key" ? "local-telemetry" : "api-key",
            )
          }
          title="Click to toggle between Direct API Key and Local Telemetry"
        >
          {quota.connectionMode === "api-key" ? (
            <>
              <KeyIcon className="size-2.5 text-primary" /> Direct API
            </>
          ) : (
            <>
              <RadioIcon className="size-2.5 text-secondary-foreground" /> Local Telemetry
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-4 pt-1">
        {/* API Key Connection Status Banner */}
        {quota.connectionMode === "api-key" && (
          <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheckIcon className="size-3.5 text-primary" />
              <span>
                {hasApiKey ? (
                  <>Direct API Key Connected <span className="font-mono text-muted-foreground">({maskedKey})</span></>
                ) : (
                  <>Direct API Key Mode (Key not set in Settings)</>
                )}
              </span>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono border-primary/40 text-primary">
              {hasApiKey ? "🟢 Live Sync" : "🔑 Needs Key"}
            </Badge>
          </div>
        )}

        {/* Weekly Limit Section */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-background/40 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Weekly Limit</span>
            <span className="font-mono font-semibold tabular-nums text-foreground">
              {quota.weeklyLimit.usedPct}%
            </span>
          </div>

          <Progress
            value={quota.weeklyLimit.usedPct}
            className={cn(
              "h-2",
              quota.weeklyLimit.usedPct >= 95
                ? "[&>div]:bg-destructive"
                : quota.weeklyLimit.usedPct >= 80
                ? "[&>div]:bg-warning"
                : "[&>div]:bg-primary",
            )}
            aria-label={`Weekly Limit ${quota.weeklyLimit.usedPct}% used`}
          />

          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <RefreshCwIcon className="size-3 text-muted-foreground/70" />
            <span>
              Used {quota.weeklyLimit.usedPct}% of weekly limit, fully refreshes in{" "}
              <strong className="font-semibold text-foreground">
                {quota.weeklyLimit.refreshText}
              </strong>
              .
            </span>
          </p>
        </div>

        {/* Five Hour Limit Section */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-background/40 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Five Hour Limit</span>
            <span className="font-mono font-semibold tabular-nums text-foreground">
              {quota.fiveHourLimit.usedPct}%
            </span>
          </div>

          <Progress
            value={quota.fiveHourLimit.usedPct}
            className={cn(
              "h-2",
              quota.fiveHourLimit.usedPct >= 95
                ? "[&>div]:bg-destructive"
                : quota.fiveHourLimit.usedPct >= 80
                ? "[&>div]:bg-warning"
                : "[&>div]:bg-primary",
            )}
            aria-label={`Five Hour Limit ${quota.fiveHourLimit.usedPct}% used`}
          />

          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <ClockIcon className="size-3 text-muted-foreground/70" />
            <span>
              {quota.fiveHourLimit.usedPct >= 100 ? (
                <span className="text-destructive font-medium">
                  5-hour limit exhausted! Refreshes in {quota.fiveHourLimit.refreshText}.
                </span>
              ) : (
                <span>
                  Refreshes in{" "}
                  <strong className="font-semibold text-foreground">
                    {quota.fiveHourLimit.refreshText}
                  </strong>
                  .
                </span>
              )}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
