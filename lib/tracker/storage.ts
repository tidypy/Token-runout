import { getDefaultGitHotspots, getDefaultCodebases } from "./git-analytics"
import { getDefaultQuotas } from "./quota"
import type { ProviderId, TrackedModel, TrackerData, UsageEntry } from "./types"

const STORAGE_KEY = "token-runway:v3"
const DAY_MS = 24 * 60 * 60 * 1000

function isoDay(offset: number): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return new Date(d.getTime() - offset * DAY_MS).toISOString().slice(0, 10)
}

/** Generate a plausible usage history for demo/seed data */
function seedUsage(days: number, baseIn: number, baseOut: number, trend = 1): UsageEntry[] {
  const usage: UsageEntry[] = []
  for (let i = days - 1; i >= 0; i--) {
    const jitter = 0.6 + Math.random() * 0.8
    const growth = 1 + (trend - 1) * ((days - 1 - i) / Math.max(days - 1, 1))
    usage.push({
      date: isoDay(i),
      inputTokens: Math.round(baseIn * jitter * growth),
      outputTokens: Math.round(baseOut * jitter * growth),
    })
  }
  return usage
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function seedData(): TrackerData {
  const mk = (
    provider: ProviderId,
    modelId: string,
    codebase: string,
    budgetUsd: number,
    warnDays: number,
    days: number,
    baseIn: number,
    baseOut: number,
    trend = 1,
  ): TrackedModel => ({
    id: makeId(),
    provider,
    modelId,
    codebase,
    budgetUsd,
    warnDays,
    usage: seedUsage(days, baseIn, baseOut, trend),
    createdAt: new Date().toISOString(),
  })

  return {
    version: 1,
    models: [
      mk("google", "google-pro-plan", "Token-runout", 100, 7, 14, 1_800_000, 450_000, 1.3),
      mk("anthropic", "claude-pro-plan", "Token-runout", 120, 7, 14, 900_000, 220_000, 1.4),
      mk("openai", "openai-team-plan", "acme-web", 60, 7, 14, 2_400_000, 600_000),
      mk("google", "gemini-2.5-flash", "docs-pipeline", 40, 5, 10, 3_200_000, 500_000, 1.2),
      mk("deepseek", "deepseek-v3", "batch-jobs", 20, 5, 14, 4_000_000, 900_000, 1.6),
    ],
    quotas: getDefaultQuotas(),
    codebases: getDefaultCodebases(),
    gitHotspots: getDefaultGitHotspots(),
  }
}

export function loadData(): TrackerData {
  if (typeof window === "undefined") {
    return {
      version: 1,
      models: [],
      quotas: getDefaultQuotas(),
      codebases: getDefaultCodebases(),
      gitHotspots: getDefaultGitHotspots(),
    }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedData()
      saveData(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw) as TrackerData
    if (parsed?.version !== 1 || !Array.isArray(parsed.models)) throw new Error("bad shape")
    if (!Array.isArray(parsed.quotas)) parsed.quotas = getDefaultQuotas()
    if (!Array.isArray(parsed.codebases)) parsed.codebases = getDefaultCodebases()
    if (!Array.isArray(parsed.gitHotspots)) parsed.gitHotspots = getDefaultGitHotspots()
    return parsed
  } catch {
    const seeded = seedData()
    saveData(seeded)
    return seeded
  }
}

export function saveData(data: TrackerData): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable; local-first best effort
  }
}

export function exportJson(data: TrackerData): string {
  return JSON.stringify(data, null, 2)
}

export function parseImport(raw: string): TrackerData {
  const parsed = JSON.parse(raw) as TrackerData
  if (parsed?.version !== 1 || !Array.isArray(parsed.models)) {
    throw new Error("Not a valid token-runway export")
  }
  for (const m of parsed.models) {
    if (typeof m.id !== "string" || typeof m.modelId !== "string" || !Array.isArray(m.usage)) {
      throw new Error("Not a valid token-runway export")
    }
  }
  if (!Array.isArray(parsed.quotas)) parsed.quotas = getDefaultQuotas()
  if (!Array.isArray(parsed.codebases)) parsed.codebases = getDefaultCodebases()
  if (!Array.isArray(parsed.gitHotspots)) parsed.gitHotspots = getDefaultGitHotspots()
  return parsed
}

export { makeId, isoDay }
