/**
 * Live client-side API fetcher for AI provider balances & rate limits.
 */

export interface DeepSeekBalanceResponse {
  is_available: boolean
  balance_infos?: Array<{
    currency: string
    total_balance: string
    granted_balance: string
    topped_up_balance: string
  }>
}

export async function fetchDeepSeekRealBalance(apiKey: string): Promise<{
  totalBalanceUsd: number
  isAvailable: boolean
} | null> {
  try {
    const res = await fetch("https://api.deepseek.com/user/balance", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      console.warn(`[DeepSeek API] Balance check status: ${res.status}`)
      return null
    }

    const data: DeepSeekBalanceResponse = await res.json()
    if (data && Array.isArray(data.balance_infos) && data.balance_infos.length > 0) {
      const usdItem = data.balance_infos.find((b) => b.currency.toUpperCase() === "USD") || data.balance_infos[0]
      const totalBalanceUsd = parseFloat(usdItem.total_balance) || 0
      return {
        totalBalanceUsd,
        isAvailable: data.is_available ?? true,
      }
    }
  } catch (err) {
    console.warn("[DeepSeek API] Direct fetch failed or CORS restricted:", err)
  }
  return null
}
