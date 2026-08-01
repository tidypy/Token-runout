import type { CodebaseInfo, GitFileHotspot } from "./types"

export function getDefaultCodebases(): CodebaseInfo[] {
  const now = new Date().toISOString()
  return [
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
    {
      id: "cb-4",
      name: "batch-jobs",
      path: "/Users/dev/apps/batch-jobs",
      fileCount: 22,
      totalLines: 2900,
      gitBranch: "master",
      createdAt: now,
    },
  ]
}

export function getDefaultGitHotspots(): GitFileHotspot[] {
  const now = new Date().toISOString()
  return [
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
    {
      id: "gh-5",
      filePath: "jobs/embedding_worker.go",
      codebase: "batch-jobs",
      changeCount: 7,
      linesAdded: 110,
      linesDeleted: 15,
      estimatedTokens: 210000,
      lastModified: now,
    },
  ]
}

export function estimateTokensFromDiff(linesAdded: number, linesDeleted: number, fileCount = 1): number {
  // Rough developer prompt token estimation based on diff changes + context overhead
  const diffLines = linesAdded + linesDeleted
  const avgTokensPerLine = 12
  const contextMultiplier = 15 // AI context window re-reading factor
  return Math.round(diffLines * avgTokensPerLine * contextMultiplier * fileCount)
}
