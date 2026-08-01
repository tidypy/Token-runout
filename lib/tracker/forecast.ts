import { costFor } from "./pricing"
import type { Confidence, Forecast, RunwayStatus, TrackedModel, UsageEntry } from "./types"

const DAY_MS = 24 * 60 * 60 * 1000

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function entryCost(modelId: string, e: UsageEntry): number {
  return costFor(modelId, e.inputTokens, e.outputTokens)
}

/** Average USD/day over the trailing `windowDays`, or null if no usage falls in the window */
function rollingBurn(model: TrackedModel, windowDays: number): number | null {
  const cutoff = startOfToday() - (windowDays - 1) * DAY_MS
  const inWindow = model.usage.filter((e) => new Date(e.date + "T00:00:00").getTime() >= cutoff)
  if (inWindow.length === 0) return null
  const total = inWindow.reduce((sum, e) => sum + entryCost(model.modelId, e), 0)
  return total / windowDays
}

/** Expected USD/day from the user-provided estimate, if any */
function expectedBurn(model: TrackedModel): number | null {
  const { expectedDailyInputTokens: inTok, expectedDailyOutputTokens: outTok } = model
  if (!inTok && !outTok) return null
  const burn = costFor(model.modelId, inTok ?? 0, outTok ?? 0)
  return burn > 0 ? burn : null
}

export function computeForecast(model: TrackedModel): Forecast {
  const burn3 = rollingBurn(model, 3)
  const burn7 = rollingBurn(model, 7)
  const burn14 = rollingBurn(model, 14)

  const dataDays = new Set(model.usage.map((e) => e.date)).size
  const spentUsd = model.usage.reduce((sum, e) => sum + entryCost(model.modelId, e), 0)

  // Prefer the 7-day average, then 3-day, then 14-day, then the user's expectation.
  let burnDaily = burn7 ?? burn3 ?? burn14
  let isEstimated = false
  if (burnDaily === null || burnDaily <= 0) {
    burnDaily = expectedBurn(model)
    isEstimated = burnDaily !== null
  }

  const budget = Math.max(model.budgetUsd - spentUsd, 0)

  const runwayDays = burnDaily && burnDaily > 0 ? budget / burnDaily : null

  // Confidence band: fastest observed burn -> shortest runway, slowest -> longest.
  const burns = [burn3, burn7, burn14].filter((b): b is number => b !== null && b > 0)
  let runwayMinDays: number | null = null
  let runwayMaxDays: number | null = null
  if (burns.length > 0) {
    runwayMinDays = budget / Math.max(...burns)
    runwayMaxDays = budget / Math.min(...burns)
  } else if (runwayDays !== null) {
    // Estimated forecasts get a wide +/-50% band.
    runwayMinDays = runwayDays * 0.5
    runwayMaxDays = runwayDays * 1.5
  }

  let confidence: Confidence = "low"
  if (!isEstimated && dataDays >= 10) confidence = "high"
  else if (!isEstimated && dataDays >= 5) confidence = "medium"

  // Wide spread between windows means the trend is unstable; cap confidence.
  if (
    confidence === "high" &&
    runwayMinDays !== null &&
    runwayMaxDays !== null &&
    runwayMinDays > 0 &&
    runwayMaxDays / runwayMinDays > 2
  ) {
    confidence = "medium"
  }

  const runOutDate = runwayDays !== null ? new Date(Date.now() + runwayDays * DAY_MS) : null

  let status: RunwayStatus = "ok"
  if (runwayDays !== null) {
    if (runwayDays <= model.warnDays / 2) status = "critical"
    else if (runwayDays <= model.warnDays) status = "warning"
  }

  return {
    burn3,
    burn7,
    burn14,
    burnDaily,
    isEstimated,
    runwayDays,
    runwayMinDays,
    runwayMaxDays,
    runOutDate,
    confidence,
    dataDays,
    spentUsd,
    status,
  }
}

/** Remaining budget in USD after logged spend */
export function remainingBudget(model: TrackedModel): number {
  const spent = model.usage.reduce((sum, e) => sum + entryCost(model.modelId, e), 0)
  return Math.max(model.budgetUsd - spent, 0)
}

/** Daily cost series for sparklines, over the trailing `days` days */
export function dailyCostSeries(model: TrackedModel, days = 14): { date: string; cost: number }[] {
  const today = startOfToday()
  const byDate = new Map<string, number>()
  for (const e of model.usage) {
    byDate.set(e.date, (byDate.get(e.date) ?? 0) + entryCost(model.modelId, e))
  }
  const series: { date: string; cost: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today - i * DAY_MS)
    const key = d.toISOString().slice(0, 10)
    series.push({ date: key, cost: byDate.get(key) ?? 0 })
  }
  return series
}
