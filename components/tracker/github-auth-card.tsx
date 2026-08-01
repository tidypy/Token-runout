"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderGit2Icon,
  GitBranchIcon,
  GitPullRequestIcon,
  GlobeIcon,
  KeyIcon,
  Link2Icon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function GithubAuthCard({
  initialRepoUrl = "https://github.com/tidypy/Token-runout.git",
  onConnectRepo,
}: {
  initialRepoUrl?: string
  onConnectRepo?: (repoName: string, repoUrl: string) => void
}) {
  const [repoUrlInput, setRepoUrlInput] = React.useState(initialRepoUrl)
  const [activeRepoUrl, setActiveRepoUrl] = React.useState(initialRepoUrl)
  const [patToken, setPatToken] = React.useState("")
  const [showAdvancedPat, setShowAdvancedPat] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)

  // Parse repo owner/name from URL
  const repoName = React.useMemo(() => {
    try {
      const clean = activeRepoUrl.replace(/\.git$/, "").replace(/\/$/, "")
      const parts = clean.split("/")
      if (parts.length >= 2) {
        return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`
      }
      if (parts.length === 1 && parts[0]) return parts[0]
    } catch {
      // fallback
    }
    return "Token-runout"
  }, [activeRepoUrl])

  function handleConnectRepo(e: React.FormEvent) {
    e.preventDefault()
    const inputVal = repoUrlInput.trim()
    if (!inputVal) {
      toast("Please enter a valid Git HTTP URL or repository path")
      return
    }
    setActiveRepoUrl(inputVal)
    
    // Extract short name e.g. "Token-runout"
    const shortName = inputVal.replace(/\.git$/, "").split("/").pop() || inputVal
    onConnectRepo?.(shortName, inputVal)
    toast(`Connected repository ${shortName} — KPIs & Git Hotspots populated`)
  }

  function handleSync() {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      toast(`Synced metrics for ${repoName}`)
    }, 600)
  }

  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl transition-all">
      <CardHeader className="flex items-start justify-between px-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <GitBranchIcon className="size-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Git Repository HTTP Sync</CardTitle>
            <Badge variant="secondary" className="text-[10px] font-mono">
              <CheckCircle2Icon className="mr-1 size-3 text-emerald-500" /> Auto-Sync Active
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Paste any HTTP repository URL or local folder path to track codebase diffs and utilization KPIs — no token or OAuth required.
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={handleSync}
          disabled={isSyncing}
          className="gap-1 text-xs bg-background/50 border-border/60"
        >
          <RefreshCwIcon className={`size-3 ${isSyncing ? "animate-spin text-primary" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Repository"}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-4 pt-1">
        {/* Quick Paste HTTP Repo URL Form */}
        <form onSubmit={handleConnectRepo} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground">
            Repository HTTP URL / Folder Path
          </span>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link2Icon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="https://github.com/owner/repo.git or local folder"
                value={repoUrlInput}
                onChange={(e) => setRepoUrlInput(e.target.value)}
                className="h-8 pl-8 text-xs font-mono bg-background/50 border-border/60"
              />
            </div>
            <Button type="submit" size="xs" variant="default" className="h-8 gap-1">
              <GlobeIcon className="size-3" />
              Connect Repo
            </Button>
          </div>
        </form>

        {/* Repo Connection Summary */}
        <div className="flex flex-col gap-2.5 rounded-lg border border-border/60 bg-background/40 p-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2Icon className="size-4 text-primary" />
              <span className="text-xs font-mono font-semibold text-foreground">
                {repoName}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">
              {activeRepoUrl}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/40">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <GitPullRequestIcon className="size-3 text-primary" />
              <span>Diff Engine: <strong>Local & HTTP Auto</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <ShieldCheckIcon className="size-3 text-emerald-500" />
              <span>Auth Mode: <strong>Zero-Config Public / Local</strong></span>
            </div>
          </div>
        </div>

        {/* Optional Collapsible PAT Token (For Private Repos Only) */}
        <div className="flex flex-col gap-2 pt-1 border-t border-border/40">
          <button
            type="button"
            onClick={() => setShowAdvancedPat(!showAdvancedPat)}
            className="flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-1">
              <KeyIcon className="size-3 text-muted-foreground/70" />
              Optional: Advanced Personal Access Token (Private Repos)
            </span>
            {showAdvancedPat ? (
              <ChevronUpIcon className="size-3" />
            ) : (
              <ChevronDownIcon className="size-3" />
            )}
          </button>

          {showAdvancedPat && (
            <div className="flex items-center gap-2 pt-1">
              <Input
                type="password"
                placeholder="ghp_xxxxxxxx (optional for private repos)"
                value={patToken}
                onChange={(e) => setPatToken(e.target.value)}
                className="h-7 text-xs font-mono bg-background/50 border-border/60"
              />
              <Button
                type="button"
                size="xs"
                variant="outline"
                className="h-7 text-[10px]"
                onClick={() => toast("PAT Saved for private repo access")}
              >
                Save Key
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
