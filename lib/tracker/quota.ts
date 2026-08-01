import type { ProviderId, ProviderQuota } from "./types"

export function getDefaultQuotas(): ProviderQuota[] {
  const now = new Date().toISOString()
  return [
    {
      providerId: "google",
      providerName: "Gemini Models",
      connectionMode: "local-telemetry",
      weeklyLimit: {
        usedPct: 53,
        refreshText: "5 days",
      },
      fiveHourLimit: {
        usedPct: 93,
        refreshText: "2 hours, 1 minute",
      },
      lastSync: now,
    },
    {
      providerId: "anthropic",
      providerName: "Claude & GPT Models",
      connectionMode: "local-telemetry",
      weeklyLimit: {
        usedPct: 9,
        refreshText: "4 days, 19 hours",
      },
      fiveHourLimit: {
        usedPct: 100,
        refreshText: "3 hours, 45 minutes",
      },
      lastSync: now,
    },
    {
      providerId: "openai",
      providerName: "OpenAI Direct API",
      connectionMode: "api-key",
      weeklyLimit: {
        usedPct: 32,
        refreshText: "3 days, 12 hours",
      },
      fiveHourLimit: {
        usedPct: 45,
        refreshText: "1 hour, 30 minutes",
      },
      lastSync: now,
    },
    {
      providerId: "deepseek",
      providerName: "DeepSeek API",
      connectionMode: "api-key",
      weeklyLimit: {
        usedPct: 18,
        refreshText: "6 days",
      },
      fiveHourLimit: {
        usedPct: 25,
        refreshText: "4 hours, 10 minutes",
      },
      lastSync: now,
    },
  ]
}

export function getQuotaStatus(usedPct: number): "ok" | "warning" | "critical" {
  if (usedPct >= 95) return "critical"
  if (usedPct >= 80) return "warning"
  return "ok"
}

export function getQuotaColor(usedPct: number): string {
  if (usedPct >= 95) return "var(--destructive)"
  if (usedPct >= 80) return "var(--warning)"
  return "var(--primary)"
}
