export type ProviderId =
  | "openai"
  | "anthropic"
  | "google"
  | "deepseek"
  | "xai"
  | "mistral"

export type ConnectionMode = "api-key" | "local-telemetry"

export interface ApiKeyEntry {
  id: string
  name: string
  key: string
  createdAt: string
}

export interface ProviderQuota {
  providerId: ProviderId
  providerName: string
  connectionMode: ConnectionMode
  weeklyLimit: {
    usedPct: number
    refreshText: string
  }
  fiveHourLimit: {
    usedPct: number
    refreshText: string
  }
  apiKey?: string
  apiKeys?: ApiKeyEntry[]
  realBalanceUsd?: number
  lastSync: string
}

export interface GitFileHotspot {
  id: string
  filePath: string
  codebase: string
  changeCount: number
  linesAdded: number
  linesDeleted: number
  estimatedTokens: number
  lastModified: string
}

export interface CodebaseInfo {
  id: string
  name: string
  path: string
  fileCount: number
  totalLines: number
  gitBranch: string
  createdAt: string
}

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
  quotas: ProviderQuota[]
  codebases: CodebaseInfo[]
  gitHotspots: GitFileHotspot[]
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
