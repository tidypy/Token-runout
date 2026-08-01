"use client"

import * as React from "react"
import {
  FileCode2Icon,
  FlameIcon,
  FolderGit2Icon,
  GitCommitIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generateHotspotsForRepo } from "@/lib/tracker/git-analytics"
import { fmtTokens } from "@/lib/tracker/format"
import type { GitFileHotspot } from "@/lib/tracker/types"

export function GitHotspots({
  hotspots,
  selectedCodebase,
  onAddHotspot,
}: {
  hotspots: GitFileHotspot[]
  selectedCodebase: string
  onAddHotspot?: (input: {
    filePath: string
    codebase: string
    changeCount: number
    linesAdded: number
    linesDeleted: number
  }) => void
}) {
  const [showLogForm, setShowLogForm] = React.useState(false)
  const [filePath, setFilePath] = React.useState("")
  const [linesAdded, setLinesAdded] = React.useState("")
  const [linesDeleted, setLinesDeleted] = React.useState("")
  const [changeCount, setChangeCount] = React.useState("1")

  const filteredHotspots = React.useMemo(() => {
    return hotspots.filter(
      (h) => selectedCodebase === "all" || h.codebase === selectedCodebase || h.codebase.includes(selectedCodebase),
    )
  }, [hotspots, selectedCodebase])

  function handleLogSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!filePath.trim()) return
    onAddHotspot?.({
      filePath: filePath.trim(),
      codebase: selectedCodebase === "all" ? "Token-runout" : selectedCodebase,
      changeCount: Number(changeCount) || 1,
      linesAdded: Number(linesAdded) || 10,
      linesDeleted: Number(linesDeleted) || 0,
    })
    setFilePath("")
    setLinesAdded("")
    setLinesDeleted("")
    setShowLogForm(false)
  }

  function handleGenerateFauxData() {
    const sampleName = selectedCodebase === "all" ? "Token-runout" : selectedCodebase
    const sampleDiffs = generateHotspotsForRepo(sampleName)
    sampleDiffs.forEach((diff) => {
      onAddHotspot?.({
        filePath: diff.filePath,
        codebase: diff.codebase,
        changeCount: diff.changeCount,
        linesAdded: diff.linesAdded,
        linesDeleted: diff.linesDeleted,
      })
    })
  }

  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl">
      <CardHeader className="flex items-start justify-between px-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FlameIcon className="size-4 text-warning" aria-hidden="true" />
            Where Tokens Were Spent (Git Hotspots)
          </CardTitle>
          <CardDescription className="text-xs">
            File-level breakdown showing Git changes and estimated token consumption for{" "}
            <strong className="text-foreground">{selectedCodebase === "all" ? "all codebases" : selectedCodebase}</strong>.
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={() => setShowLogForm(!showLogForm)}
          className="gap-1 text-xs bg-background/50 border-border/60"
        >
          <PlusIcon className="size-3" />
          Log Git File Diff
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 px-4">
        {/* Inline Real Git Diff Logging Form */}
        {showLogForm && (
          <form
            onSubmit={handleLogSubmit}
            className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/50 p-3 text-xs"
          >
            <span className="font-medium text-foreground">Log File Diff Metric</span>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="File path (e.g. app/page.tsx or src/api.ts)"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className="h-7 text-xs bg-background"
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="+ Lines"
                  value={linesAdded}
                  onChange={(e) => setLinesAdded(e.target.value)}
                  className="h-7 text-xs bg-background"
                />
                <Input
                  type="number"
                  placeholder="- Lines"
                  value={linesDeleted}
                  onChange={(e) => setLinesDeleted(e.target.value)}
                  className="h-7 text-xs bg-background"
                />
                <Input
                  type="number"
                  placeholder="Commits"
                  value={changeCount}
                  onChange={(e) => setChangeCount(e.target.value)}
                  className="h-7 text-xs bg-background"
                />
              </div>
              <Button type="submit" size="xs" className="mt-1">
                Save File Metric
              </Button>
            </div>
          </form>
        )}

        {filteredHotspots.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 bg-background/20 p-4">
            <FolderGit2Icon className="size-6 text-muted-foreground/60" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-foreground">No Git hotspots recorded for this codebase</span>
              <span>Log a real file diff or generate sample demo diffs to preview KPIs.</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Button variant="outline" size="xs" onClick={() => setShowLogForm(true)}>
                <PlusIcon className="mr-1 size-3" /> Log Real Git Diff
              </Button>
              <Button variant="secondary" size="xs" onClick={handleGenerateFauxData}>
                <SparklesIcon className="mr-1 size-3 text-warning" /> Generate Sample Demo Diffs
              </Button>
            </div>
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
