"use client"

import * as React from "react"
import {
  ActivityIcon,
  AlertTriangleIcon,
  ClockIcon,
  DollarSignIcon,
  FlameIcon,
  FolderGit2Icon,
  GaugeIcon,
  GitCommitIcon,
  Maximize2Icon,
  Minimize2Icon,
  RadioIcon,
  SearchIcon,
  SparklesIcon,
  TrendingDownIcon,
} from "lucide-react"

import { AddCodebaseModal } from "@/components/tracker/add-codebase-modal"
import { AddModelSheet } from "@/components/tracker/add-model-sheet"
import { CompactWidget } from "@/components/tracker/compact-widget"
import { ForecastPanel } from "@/components/tracker/forecast-panel"
import { GitHotspots } from "@/components/tracker/git-hotspots"
import { GithubAuthCard } from "@/components/tracker/github-auth-card"
import { ModelCard } from "@/components/tracker/model-card"
import { PricingTable } from "@/components/tracker/pricing-table"
import { QuotaCard } from "@/components/tracker/quota-card"
import { SettingsSheet } from "@/components/tracker/settings-sheet"
import { TipsCard } from "@/components/tracker/tips-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTracker } from "@/hooks/use-tracker"
import { computeForecast, remainingBudget } from "@/lib/tracker/forecast"
import { fmtUsd } from "@/lib/tracker/format"
import { PROVIDERS } from "@/lib/tracker/pricing"

export default function Page() {
  const tracker = useTracker()
  const [selectedCodebase, setSelectedCodebase] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [activeTab, setActiveTab] = React.useState<"forecast" | "models" | "pricing" | "tips">("forecast")
  const [widgetMode, setWidgetMode] = React.useState<boolean>(false)

  const {
    hydrated,
    models,
    quotas,
    codebases,
    gitHotspots,
    addModel,
    removeModel,
    logUsage,
    addCodebase,
    toggleQuotaConnectionMode,
  } = tracker

  // Extract list of unique codebases combining tracked models & added codebases
  const allCodebases = React.useMemo(() => {
    const set = new Set<string>()
    models.forEach((m) => {
      if (m.codebase) set.add(m.codebase)
    })
    codebases.forEach((cb) => {
      if (cb.name) set.add(cb.name)
    })
    return Array.from(set).sort()
  }, [models, codebases])

  // Filter models by search query and selected codebase
  const filteredModels = React.useMemo(() => {
    return models.filter((m) => {
      const matchesCodebase = selectedCodebase === "all" || m.codebase === selectedCodebase
      const matchesQuery =
        !searchQuery.trim() ||
        m.modelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.codebase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        PROVIDERS[m.provider]?.label.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCodebase && matchesQuery
    })
  }, [models, selectedCodebase, searchQuery])

  // Combined metrics
  const metrics = React.useMemo(() => {
    let totalBudget = 0
    let totalRemaining = 0
    let totalDailyBurn = 0
    let criticalCount = 0
    let warningCount = 0

    models.forEach((m) => {
      const rem = remainingBudget(m)
      const forecast = computeForecast(m)
      totalBudget += m.budgetUsd
      totalRemaining += rem
      totalDailyBurn += forecast.burnDaily ?? 0

      if (forecast.status === "critical") criticalCount++
      else if (forecast.status === "warning") warningCount++
    })

    const highQuotaCount = quotas.filter(
      (q) => q.fiveHourLimit.usedPct >= 80 || q.weeklyLimit.usedPct >= 80,
    ).length

    return {
      totalBudget,
      totalRemaining,
      totalDailyBurn,
      criticalCount,
      warningCount,
      highQuotaCount,
      activeCount: models.length,
    }
  }, [models, quotas])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 px-6 py-4 shadow-xl backdrop-blur-xl">
          <GaugeIcon className="size-6 animate-pulse text-primary" />
          <span className="text-sm font-medium">Loading Token Runway Tracker...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <header className="sticky top-4 z-40 mb-8 rounded-2xl border border-border/60 bg-card/75 p-4 shadow-md backdrop-blur-2xl transition-all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
              <GaugeIcon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight">Runway</h1>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  Local-First
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Provider Quota Telemetry (5-Hour & Weekly Limits) & Git Token Hotspots
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={widgetMode ? "secondary" : "outline"}
              size="sm"
              onClick={() => setWidgetMode(!widgetMode)}
              className="gap-1.5"
            >
              {widgetMode ? (
                <>
                  <Maximize2Icon className="size-3.5" />
                  <span>Full View</span>
                </>
              ) : (
                <>
                  <Minimize2Icon className="size-3.5" />
                  <span>Floating Widget</span>
                </>
              )}
            </Button>
            <AddModelSheet onAdd={addModel} />
            <SettingsSheet tracker={tracker} />
          </div>
        </div>
      </header>

      {/* Overview Stat Cards */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Provider Quotas</span>
            <RadioIcon className="size-4 text-primary" />
          </div>
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
            {quotas.length} Active
          </span>
          <span className="text-[11px] text-muted-foreground">
            5-Hour & Weekly Telemetry Sync
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Combined Daily Burn</span>
            <FlameIcon className="size-4 text-warning" />
          </div>
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
            {fmtUsd(metrics.totalDailyBurn)}
            <span className="text-xs font-normal text-muted-foreground">/d</span>
          </span>
          <span className="text-[11px] text-muted-foreground">
            Rolling weighted burn rate
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Codebases Tracked</span>
            <FolderGit2Icon className="size-4 text-primary" />
          </div>
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
            {allCodebases.length}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Git diff hotspots & line counts
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Quota Warnings</span>
            <AlertTriangleIcon
              className={metrics.highQuotaCount > 0 ? "size-4 text-warning animate-pulse" : "size-4 text-muted-foreground"}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono text-2xl font-bold tabular-nums ${
                metrics.highQuotaCount > 0 ? "text-warning" : "text-foreground"
              }`}
            >
              {metrics.highQuotaCount}
            </span>
            <span className="text-xs text-muted-foreground">near limit</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {metrics.highQuotaCount > 0 ? "Quotas > 80% capacity" : "All limits healthy"}
          </span>
        </div>
      </section>

      {/* Filter and Tab Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Codebase Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-2.5 py-1 text-xs text-muted-foreground">
            <FolderGit2Icon className="size-3.5 text-primary" />
            <span className="font-medium">Codebase:</span>
          </div>

          <Button
            variant={selectedCodebase === "all" ? "secondary" : "ghost"}
            size="xs"
            onClick={() => setSelectedCodebase("all")}
          >
            All ({models.length})
          </Button>

          {allCodebases.map((cb) => {
            const count = models.filter((m) => m.codebase === cb).length
            return (
              <Button
                key={cb}
                variant={selectedCodebase === cb ? "secondary" : "ghost"}
                size="xs"
                onClick={() => setSelectedCodebase(cb)}
              >
                {cb} ({count})
              </Button>
            )
          })}

          <AddCodebaseModal onAddCodebase={addCodebase} />
        </div>

        {/* Search Bar & Tabs */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by model or codebase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-card/50 border-border/60"
            />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="h-8 p-0.5 bg-card/60 border border-border/60">
              <TabsTrigger value="forecast" className="text-xs px-2.5 py-1 gap-1">
                <TrendingDownIcon className="size-3 text-primary" /> Forecast
              </TabsTrigger>
              <TabsTrigger value="models" className="text-xs px-2.5 py-1">
                Models
              </TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs px-2.5 py-1">
                Live Pricing
              </TabsTrigger>
              <TabsTrigger value="tips" className="text-xs px-2.5 py-1">
                Tips
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* FORECAST TAB (Primary View) */}
      {activeTab === "forecast" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Provider Quota Telemetry (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadioIcon className="size-4 text-primary" />
                <h2 className="text-base font-semibold tracking-tight">Provider Rate Limit & Quota Telemetry</h2>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Auto-Refreshing
              </Badge>
            </div>

            {/* Quotas Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quotas.map((quota) => (
                <QuotaCard
                  key={quota.providerId}
                  quota={quota}
                  onToggleConnectionMode={(mode) =>
                    toggleQuotaConnectionMode(quota.providerId, mode)
                  }
                />
              ))}
            </div>

            {/* Git File Hotspots ("Where tokens were spent") */}
            <GitHotspots
              hotspots={gitHotspots}
              selectedCodebase={selectedCodebase}
            />

            {/* GitHub Auth & Remote Sync Card */}
            <GithubAuthCard repoUrl="https://github.com/tidypy/Token-runout.git" />
          </div>

          {/* Forecast & Tips Sidebar (1 Col) */}
          <div className="flex flex-col gap-6">
            <ForecastPanel models={models} />
            <TipsCard />
          </div>
        </div>
      )}

      {/* MODELS TAB */}
      {activeTab === "models" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {filteredModels.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 bg-card/30 p-8 text-center backdrop-blur-xl">
                <SparklesIcon className="size-8 text-muted-foreground/60" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold">No models found</h3>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery || selectedCodebase !== "all"
                      ? "Try adjusting your search or codebase filter."
                      : "Add a model to start forecasting runway."}
                  </p>
                </div>
                {models.length === 0 ? (
                  <Button variant="outline" size="sm" onClick={() => tracker.resetDemo()}>
                    Load Sample Demo Data
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCodebase("all")
                      setSearchQuery("")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onRemove={removeModel}
                    onLogUsage={logUsage}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <ForecastPanel models={models} />
            <TipsCard />
          </div>
        </div>
      )}

      {/* PRICING TAB */}
      {activeTab === "pricing" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PricingTable />
          </div>
          <div className="flex flex-col gap-6">
            <TipsCard />
          </div>
        </div>
      )}

      {/* TIPS TAB */}
      {activeTab === "tips" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TipsCard />
          </div>
          <div className="flex flex-col gap-6">
            <ForecastPanel models={models} />
          </div>
        </div>
      )}

      {/* Floating Widget Mode Overlay */}
      {widgetMode && (
        <CompactWidget models={models} onExpand={() => setWidgetMode(false)} />
      )}
    </div>
  )
}
