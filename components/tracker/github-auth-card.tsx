"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  FolderGit2Icon,
  GitBranchIcon,
  GitPullRequestIcon,
  KeyIcon,
  LockIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function GithubAuthCard({
  repoUrl = "https://github.com/tidypy/Token-runout.git",
}: {
  repoUrl?: string
}) {
  const [token, setToken] = React.useState("")
  const [connectedRepo, setConnectedRepo] = React.useState("tidypy/Token-runout")
  const [isConnected, setIsConnected] = React.useState(true)
  const [isSyncing, setIsSyncing] = React.useState(false)

  function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    if (!token.trim() && !isConnected) {
      toast("Enter a GitHub Personal Access Token or OAuth key")
      return
    }
    setIsConnected(true)
    toast(`Connected GitHub repository ${connectedRepo}`)
  }

  function handleSync() {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      toast("Synced GitHub commits & PR diff metrics")
    }, 800)
  }

  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl transition-all">
      <CardHeader className="flex items-start justify-between px-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <GitBranchIcon className="size-4 text-foreground" />
            <CardTitle className="text-sm font-semibold">GitHub Remote Sync & Auth</CardTitle>
            <Badge
              variant={isConnected ? "secondary" : "outline"}
              className="text-[10px] font-mono"
            >
              {isConnected ? (
                <>
                  <CheckCircle2Icon className="mr-1 size-3 text-emerald-500" /> Connected
                </>
              ) : (
                <>
                  <LockIcon className="mr-1 size-3" /> Unauthenticated
                </>
              )}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Authenticate your GitHub account to sync remote repository diffs and track token burn per pull request.
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
          {isSyncing ? "Syncing..." : "Sync GitHub"}
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-4 pt-1">
        {/* Repo Connection Status Card */}
        <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2Icon className="size-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-mono font-medium text-foreground">
                  {connectedRepo}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {repoUrl}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] font-mono border-primary/30 text-primary">
              main branch
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <GitPullRequestIcon className="size-3 text-primary" />
              <span>Diff Sync: <strong>Active</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <ShieldCheckIcon className="size-3 text-emerald-500" />
              <span>Token Auth: <strong>PAT Configured</strong></span>
            </div>
          </div>
        </div>

        {/* GitHub PAT Auth Input Form */}
        <form onSubmit={handleConnect} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-foreground">
            GitHub Personal Access Token / PAT Auth
          </span>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <KeyIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="h-8 pl-8 text-xs font-mono bg-background/50 border-border/60"
              />
            </div>
            <Button type="submit" size="xs" variant="secondary" className="h-8">
              Update Auth Token
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
