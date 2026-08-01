"use client"

import * as React from "react"
import {
  FileCode2Icon,
  FlameIcon,
  FolderGit2Icon,
  GitCommitIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fmtTokens } from "@/lib/tracker/format"
import type { GitFileHotspot } from "@/lib/tracker/types"

export function GitHotspots({
  hotspots,
  selectedCodebase,
}: {
  hotspots: GitFileHotspot[]
  selectedCodebase: string
}) {
  const filteredHotspots = React.useMemo(() => {
    return hotspots.filter(
      (h) => selectedCodebase === "all" || h.codebase === selectedCodebase,
    )
  }, [hotspots, selectedCodebase])

  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl">
      <CardHeader className="flex items-start justify-between px-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FlameIcon className="size-4 text-warning" aria-hidden="true" />
            Where Tokens Were Spent (Git Hotspots)
          </CardTitle>
          <CardDescription className="text-xs">
            Automated breakdown of files with highest Git changes and estimated token consumption.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 px-4">
        {filteredHotspots.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <FolderGit2Icon className="size-6 text-muted-foreground/60" />
            <span>No Git file changes recorded for this codebase folder yet.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredHotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-background/40 p-3 transition-all hover:bg-background/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileCode2Icon className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate text-xs font-mono font-medium text-foreground">
                      {hotspot.filePath}
                    </span>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px] font-mono">
                    ~{fmtTokens(hotspot.estimatedTokens)} tok
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FolderGit2Icon className="size-3 text-muted-foreground/70" />
                      {hotspot.codebase}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <GitCommitIcon className="size-3 text-muted-foreground/70" />
                      {hotspot.changeCount} commits
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      +{hotspot.linesAdded}
                    </span>
                    <span className="text-rose-600 dark:text-rose-400">
                      -{hotspot.linesDeleted}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
