import type { ProviderId } from "./types"

export interface ModelPricing {
  provider: ProviderId
  modelId: string
  label: string
  /** USD per 1M input tokens */
  inputPerM: number
  /** USD per 1M output tokens */
  outputPerM: number
  /** USD per 1M cached input tokens, when the provider supports prompt caching */
  cachedInputPerM?: number
}

export const PRICING_UPDATED = "2026-08-01"

export const PROVIDERS: Record<ProviderId, { label: string; short: string }> = {
  openai: { label: "OpenAI", short: "GPT" },
  anthropic: { label: "Anthropic", short: "Claude" },
  google: { label: "Google", short: "Gemini" },
  deepseek: { label: "DeepSeek", short: "DS" },
  xai: { label: "xAI", short: "Grok" },
  mistral: { label: "Mistral", short: "Mistral" },
}

export const PRICING_CATALOG: ModelPricing[] = [
  // OpenAI
  { provider: "openai", modelId: "gpt-4.1", label: "GPT-4.1", inputPerM: 2.0, outputPerM: 8.0, cachedInputPerM: 0.5 },
  { provider: "openai", modelId: "gpt-4.1-mini", label: "GPT-4.1 mini", inputPerM: 0.4, outputPerM: 1.6, cachedInputPerM: 0.1 },
  { provider: "openai", modelId: "gpt-4o", label: "GPT-4o", inputPerM: 2.5, outputPerM: 10.0, cachedInputPerM: 1.25 },
  { provider: "openai", modelId: "gpt-4o-mini", label: "GPT-4o mini", inputPerM: 0.15, outputPerM: 0.6, cachedInputPerM: 0.075 },
  { provider: "openai", modelId: "o3", label: "o3", inputPerM: 2.0, outputPerM: 8.0, cachedInputPerM: 0.5 },
  // Anthropic
  { provider: "anthropic", modelId: "claude-opus-4.5", label: "Claude Opus 4.5", inputPerM: 5.0, outputPerM: 25.0, cachedInputPerM: 0.5 },
  { provider: "anthropic", modelId: "claude-sonnet-4.5", label: "Claude Sonnet 4.5", inputPerM: 3.0, outputPerM: 15.0, cachedInputPerM: 0.3 },
  { provider: "anthropic", modelId: "claude-haiku-4.5", label: "Claude Haiku 4.5", inputPerM: 1.0, outputPerM: 5.0, cachedInputPerM: 0.1 },
  // Google
  { provider: "google", modelId: "gemini-2.5-pro", label: "Gemini 2.5 Pro", inputPerM: 1.25, outputPerM: 10.0, cachedInputPerM: 0.31 },
  { provider: "google", modelId: "gemini-2.5-flash", label: "Gemini 2.5 Flash", inputPerM: 0.3, outputPerM: 2.5, cachedInputPerM: 0.075 },
  { provider: "google", modelId: "gemini-2.0-flash", label: "Gemini 2.0 Flash", inputPerM: 0.1, outputPerM: 0.4, cachedInputPerM: 0.025 },
  // DeepSeek
  { provider: "deepseek", modelId: "deepseek-v3", label: "DeepSeek V3", inputPerM: 0.27, outputPerM: 1.1, cachedInputPerM: 0.07 },
  { provider: "deepseek", modelId: "deepseek-r1", label: "DeepSeek R1", inputPerM: 0.55, outputPerM: 2.19, cachedInputPerM: 0.14 },
  // xAI
  { provider: "xai", modelId: "grok-4", label: "Grok 4", inputPerM: 3.0, outputPerM: 15.0, cachedInputPerM: 0.75 },
  { provider: "xai", modelId: "grok-4-fast", label: "Grok 4 Fast", inputPerM: 0.2, outputPerM: 0.5, cachedInputPerM: 0.05 },
  // Mistral
  { provider: "mistral", modelId: "mistral-large", label: "Mistral Large", inputPerM: 2.0, outputPerM: 6.0 },
  { provider: "mistral", modelId: "mistral-small", label: "Mistral Small", inputPerM: 0.1, outputPerM: 0.3 },
]

export function getPricing(modelId: string): ModelPricing | undefined {
  return PRICING_CATALOG.find((p) => p.modelId === modelId)
}

/** Cost in USD for a given token count */
export function costFor(modelId: string, inputTokens: number, outputTokens: number): number {
  const p = getPricing(modelId)
  if (!p) return 0
  return (inputTokens / 1_000_000) * p.inputPerM + (outputTokens / 1_000_000) * p.outputPerM
}
