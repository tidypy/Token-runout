"use client"

import { LightbulbIcon } from "lucide-react"

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
          Reduce token spend
        </CardTitle>
        <CardDescription className="text-xs">Best practices to stretch your runway.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        {TIP_GROUPS.map((group, i) => (
          <div key={group.heading} className="flex flex-col gap-2">
            {i > 0 ? <Separator /> : null}
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
