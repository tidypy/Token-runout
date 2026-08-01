"use client"

import { AlertTriangleIcon, LightbulbIcon, ZapIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const TIP_GROUPS: { heading: string; tips: string[] }[] = [
  {
    heading: "Prompt caching",
    tips: [
      "Prompt caching is the highest-leverage lever — use it whenever the provider supports it.",
      "Keep stable content first: system prompt, tool schemas, reference docs.",
      "Put dynamic content last: user input, timestamps, request IDs.",
    ],
  },
  {
    heading: "Outputs & schemas",
    tips: [
      "Prefer structured outputs to reduce verbosity and retries.",
      "Keep schemas flat and minimal.",
    ],
  },
  {
    heading: "Context reuse",
    tips: [
      "Reuse retrieval context instead of resending it.",
      "Reuse summaries instead of full transcripts.",
      "Batch related edits into one request.",
    ],
  },
  {
    heading: "Model selection",
    tips: [
      "Use the cheapest model that can do the job.",
      "Split plan / build / debug across different models.",
    ],
  },
]

export function TipsCard() {
  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <LightbulbIcon className="size-4 text-warning" aria-hidden="true" />
          Reduce Token Spend & Costs
        </CardTitle>
        <CardDescription className="text-xs">Best practices to stretch your runway.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-4">
        {/* DeepSeek Peak-Valley Pricing Alert */}
        <div className="flex flex-col gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed transition-all">
          <div className="flex items-center gap-2 font-semibold text-warning-foreground">
            <AlertTriangleIcon className="size-4 shrink-0 text-warning" />
            <span>Advisory: DeepSeek Peak-Valley Pricing</span>
          </div>
          <p className="text-muted-foreground text-[11px]">
            DeepSeek is introducing a peak-valley pricing strategy, doubling pricing (<strong>2x multiplier</strong>) during high-traffic hours. Schedule large RAG embeddings or batch jobs outside these times:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-background/50 border border-border/40 rounded-lg p-2 mt-1">
            <div>
              <span className="font-semibold text-foreground">Peak hours (UTC):</span>
              <ul className="list-disc pl-3 text-muted-foreground">
                <li>1:00 AM – 4:00 AM</li>
                <li>6:00 AM – 10:00 AM</li>
              </ul>
            </div>
            <div>
              <span className="font-semibold text-foreground">Peak hours (UTC+8):</span>
              <ul className="list-disc pl-3 text-muted-foreground">
                <li>9:00 AM – 12:00 PM</li>
                <li>2:00 PM – 6:00 PM</li>
              </ul>
            </div>
          </div>
        </div>

        {TIP_GROUPS.map((group, i) => (
          <div key={group.heading} className="flex flex-col gap-2">
            <Separator />
            <Badge variant="secondary" className="w-fit text-[10px]">
              {group.heading}
            </Badge>
            <ul className="flex list-disc flex-col gap-1 pl-4 text-xs leading-relaxed text-muted-foreground">
              {group.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
