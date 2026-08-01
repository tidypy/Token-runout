"use client"

import { Area, AreaChart } from "recharts"

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  cost: { label: "Daily cost", color: "var(--chart-1)" },
} satisfies ChartConfig

export function Sparkline({
  data,
  className,
  color = "var(--chart-1)",
}: {
  data: { date: string; cost: number }[]
  className?: string
  color?: string
}) {
  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}`
  return (
    <ChartContainer config={chartConfig} className={className ?? "h-10 w-full"}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          dataKey="cost"
          type="monotone"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
