export function fmtUsd(n: number, opts?: { compact?: boolean }): string {
  if (opts?.compact && n >= 1000) {
    return `$${(n / 1000).toFixed(1)}k`
  }
  if (n < 1 && n > 0) return `$${n.toFixed(3)}`
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return `${n}`
}

/** "~36 h" under 2 days, "~12.4 d" otherwise */
export function fmtRunway(days: number | null): string {
  if (days === null) return "—"
  if (days < 2) {
    const hours = Math.max(Math.round(days * 24), 1)
    return `~${hours} h`
  }
  if (days > 365) return ">1 yr"
  return `~${days < 10 ? days.toFixed(1) : Math.round(days)} d`
}

export function fmtRunOutDate(date: Date | null): string {
  if (date === null) return "no estimate"
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}
