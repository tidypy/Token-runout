export type ProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "deepseek"
  | "xai"
  | "mistral"

export interface UsageEntry {
  /** ISO date, e.g. "2026-08-01" */
  date: string
  inputTokens: number
  outputTokens: number
}

export interface TrackedModel {
  id: string
  provider: ProviderId
  /** Key into the pricing catalog */
  modelId: string
  /** Which codebase / project this budget belongs to */
  codebase: string
  /** Remaining credits in USD */
  budgetUsd: number
  /** Warn when runway drops below this many days */
  warnDays: number
  /** Optional expected daily usage, used to bootstrap forecasts before real data exists */
  expectedDailyInputTokens?: number
  expectedDailyOutputTokens?: number
  usage: UsageEntry[]
  createdAt: string
}

export interface TrackerData {
  version: 1
  models: TrackedModel[]
}

export type Confidence = "low" | "medium" | "high"

export type RunwayStatus = "ok" | "warning" | "critical"

export interface Forecast {
  /** Rolling burn rates in USD/day; null when no data in window */
  burn3: number | null
  burn7: number | null
  burn14: number | null
  /** Preferred burn rate used for the headline estimate */
  burnDaily: number | null
  /** Whether the forecast is based on the user's expected usage instead of logged data */
  isEstimated: boolean
  /** Headline runway in days; null when burn is zero/unknown */
  runwayDays: number | null
  /** Confidence band, from fastest to slowest observed burn */
  runwayMinDays: number | null
  runwayMaxDays: number | null
  runOutDate: Date | null
  confidence: Confidence
  /** Distinct days with logged usage */
  dataDays: number
  /** Total spend across logged usage */
  spentUsd: number
  status: RunwayStatus
}
