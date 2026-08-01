import type { CodebaseInfo, GitFileHotspot } from "./types"

function makeId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function generateHotspotsForRepo(codebaseName: string): GitFileHotspot[] {
  const now = new Date().toISOString()
  const cleanName = codebaseName.split("/").pop() || codebaseName

  return [
    {
      id: makeId(),
      filePath: "app/page.tsx",
      codebase: codebaseName,
      changeCount: 19,
      linesAdded: 435,
      linesDeleted: 120,
      estimatedTokens: 990000,
      lastModified: now,
    },
    {
      id: makeId(),
      filePath: "components/tracker/github-auth-card.tsx",
      codebase: codebaseName,
      changeCount: 12,
      linesAdded: 210,
      linesDeleted: 45,
      estimatedTokens: 575000,
      lastModified: now,
    },
    {
      id: makeId(),
      filePath: "lib/tracker/forecast.ts",
      codebase: codebaseName,
      changeCount: 9,
      linesAdded: 160,
      linesDeleted: 30,
      estimatedTokens: 425000,
      lastModified: now,
    },
    {
      id: makeId(),
      filePath: "hooks/use-tracker.ts",
      codebase: codebaseName,
      changeCount: 8,
      linesAdded: 140,
      linesDeleted: 25,
      estimatedTokens: 370000,
      lastModified: now,
    },
    {
      id: makeId(),
      filePath: "components/tracker/quota-card.tsx",
      codebase: codebaseName,
      changeCount: 6,
      linesAdded: 115,
      linesDeleted: 18,
      estimatedTokens: 290000,
      lastModified: now,
    },
  ]
}

export function getDefaultCodebases(): CodebaseInfo[] {
  const now = new Date().toISOString()
  return [
    {
      id: "cb-0",
      name: "Token-runout",
      path: "https://github.com/tidypy/Token-runout.git",
      fileCount: 67,
      totalLines: 16777,
      gitBranch: "main",
      createdAt: now,
    },
    {
      id: "cb-1",
      name: "acme-web",
      path: "/Users/dev/apps/acme-web",
      fileCount: 142,
      totalLines: 18450,
      gitBranch: "main",
      createdAt: now,
    },
    {
      id: "cb-2",
      name: "docs-pipeline",
      path: "/Users/dev/apps/docs-pipeline",
      fileCount: 48,
      totalLines: 6200,
      gitBranch: "feature/rag-sync",
      createdAt: now,
    },
    {
      id: "cb-3",
      name: "eval-harness",
      path: "/Users/dev/apps/eval-harness",
      fileCount: 35,
      totalLines: 4100,
      gitBranch: "main",
      createdAt: now,
    },
  ]
}

export function getDefaultGitHotspots(): GitFileHotspot[] {
  const now = new Date().toISOString()
  return [
    {
      id: "gh-0a",
      filePath: "app/page.tsx",
      codebase: "Token-runout",
      changeCount: 19,
      linesAdded: 435,
      linesDeleted: 120,
      estimatedTokens: 990000,
      lastModified: now,
    },
    {
      id: "gh-0b",
      filePath: "components/tracker/github-auth-card.tsx",
      codebase: "Token-runout",
      changeCount: 12,
      linesAdded: 210,
      linesDeleted: 45,
      estimatedTokens: 575000,
      lastModified: now,
    },
    {
      id: "gh-0c",
      filePath: "lib/tracker/forecast.ts",
      codebase: "Token-runout",
      changeCount: 9,
      linesAdded: 160,
      linesDeleted: 30,
      estimatedTokens: 425000,
      lastModified: now,
    },
    {
      id: "gh-1",
      filePath: "src/components/dashboard/analytics-view.tsx",
      codebase: "acme-web",
      changeCount: 18,
      linesAdded: 340,
      linesDeleted: 120,
      estimatedTokens: 620000,
      lastModified: now,
    },
    {
      id: "gh-2",
      filePath: "src/lib/ai/pipeline.ts",
      codebase: "acme-web",
      changeCount: 14,
      linesAdded: 210,
      linesDeleted: 45,
      estimatedTokens: 480000,
      lastModified: now,
    },
    {
      id: "gh-3",
      filePath: "services/ingest/markdown_parser.py",
      codebase: "docs-pipeline",
      changeCount: 12,
      linesAdded: 195,
      linesDeleted: 88,
      estimatedTokens: 390000,
      lastModified: now,
    },
    {
      id: "gh-4",
      filePath: "evals/benchmarks/json_schema_tester.ts",
      codebase: "eval-harness",
      changeCount: 9,
      linesAdded: 140,
      linesDeleted: 30,
      estimatedTokens: 270000,
      lastModified: now,
    },
  ]
}

export function estimateTokensFromDiff(linesAdded: number, linesDeleted: number, fileCount = 1): number {
  const diffLines = linesAdded + linesDeleted
  const avgTokensPerLine = 12
  const contextMultiplier = 15
  return Math.round(diffLines * avgTokensPerLine * contextMultiplier * fileCount)
}
