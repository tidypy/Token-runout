"use client"

import * as React from "react"

import { estimateTokensFromDiff } from "@/lib/tracker/git-analytics"
import { getDefaultQuotas } from "@/lib/tracker/quota"
import { exportJson, loadData, makeId, parseImport, saveData, seedData } from "@/lib/tracker/storage"
import type {
  CodebaseInfo,
  ConnectionMode,
  GitFileHotspot,
  ProviderId,
  ProviderQuota,
  TrackedModel,
  TrackerData,
  UsageEntry,
} from "@/lib/tracker/types"

export interface NewModelInput {
  provider: TrackedModel["provider"]
  modelId: string
  codebase: string
  budgetUsd: number
  warnDays: number
  expectedDailyInputTokens?: number
  expectedDailyOutputTokens?: number
}

export function useTracker() {
  const [data, setData] = React.useState<TrackerData>({
    version: 1,
    models: [],
    quotas: getDefaultQuotas(),
    codebases: [],
    gitHotspots: [],
  })
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setData(loadData())
    setHydrated(true)
  }, [])

  const update = React.useCallback((updater: (prev: TrackerData) => TrackerData) => {
    setData((prev) => {
      const next = updater(prev)
      saveData(next)
      return next
    })
  }, [])

  const addModel = React.useCallback(
    (input: NewModelInput) => {
      update((prev) => ({
        ...prev,
        models: [
          ...prev.models,
          { ...input, id: makeId(), usage: [], createdAt: new Date().toISOString() },
        ],
      }))
    },
    [update],
  )

  const removeModel = React.useCallback(
    (id: string) => {
      update((prev) => ({ ...prev, models: prev.models.filter((m) => m.id !== id) }))
    },
    [update],
  )

  const updateModel = React.useCallback(
    (id: string, patch: Partial<TrackedModel>) => {
      update((prev) => ({
        ...prev,
        models: prev.models.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      }))
    },
    [update],
  )

  const logUsage = React.useCallback(
    (id: string, entry: UsageEntry) => {
      update((prev) => ({
        ...prev,
        models: prev.models.map((m) => {
          if (m.id !== id) return m
          const existing = m.usage.find((e) => e.date === entry.date)
          const usage = existing
            ? m.usage.map((e) =>
                e.date === entry.date
                  ? {
                      ...e,
                      inputTokens: e.inputTokens + entry.inputTokens,
                      outputTokens: e.outputTokens + entry.outputTokens,
                    }
                  : e,
              )
            : [...m.usage, entry]
          return { ...m, usage }
        }),
      }))
    },
    [update],
  )

  const addCodebase = React.useCallback(
    (input: { name: string; path: string; fileCount?: number; totalLines?: number; gitBranch?: string }) => {
      update((prev) => {
        const cbName = input.name.trim()
        const now = new Date().toISOString()
        const newCodebase: CodebaseInfo = {
          id: makeId(),
          name: cbName,
          path: input.path.trim(),
          fileCount: input.fileCount ?? Math.floor(20 + Math.random() * 80),
          totalLines: input.totalLines ?? Math.floor(3000 + Math.random() * 15000),
          gitBranch: input.gitBranch?.trim() || "main",
          createdAt: now,
        }

        // Auto-generate realistic file hotspots for the added codebase folder
        const generatedHotspots: GitFileHotspot[] = [
          {
            id: makeId(),
            filePath: `src/components/main-view.tsx`,
            codebase: cbName,
            changeCount: 15,
            linesAdded: 280,
            linesDeleted: 85,
            estimatedTokens: estimateTokensFromDiff(280, 85),
            lastModified: now,
          },
          {
            id: makeId(),
            filePath: `src/lib/api-client.ts`,
            codebase: cbName,
            changeCount: 11,
            linesAdded: 190,
            linesDeleted: 40,
            estimatedTokens: estimateTokensFromDiff(190, 40),
            lastModified: now,
          },
          {
            id: makeId(),
            filePath: `src/hooks/use-data.ts`,
            codebase: cbName,
            changeCount: 8,
            linesAdded: 130,
            linesDeleted: 25,
            estimatedTokens: estimateTokensFromDiff(130, 25),
            lastModified: now,
          },
        ]

        return {
          ...prev,
          codebases: [...prev.codebases, newCodebase],
          gitHotspots: [...generatedHotspots, ...prev.gitHotspots],
        }
      })
    },
    [update],
  )

  const toggleQuotaConnectionMode = React.useCallback(
    (providerId: ProviderId, mode: ConnectionMode, apiKey?: string) => {
      update((prev) => ({
        ...prev,
        quotas: prev.quotas.map((q) =>
          q.providerId === providerId
            ? { ...q, connectionMode: mode, apiKey: apiKey !== undefined ? apiKey : q.apiKey, lastSync: new Date().toISOString() }
            : q,
        ),
      }))
    },
    [update],
  )

  const exportData = React.useCallback(() => exportJson(data), [data])

  const importData = React.useCallback(
    (raw: string) => {
      const parsed = parseImport(raw)
      update(() => parsed)
    },
    [update],
  )

  const resetDemo = React.useCallback(() => {
    update(() => seedData())
  }, [update])

  const clearAll = React.useCallback(() => {
    update(() => ({ version: 1, models: [], quotas: getDefaultQuotas(), codebases: [], gitHotspots: [] }))
  }, [update])

  return {
    hydrated,
    models: data.models,
    quotas: data.quotas || [],
    codebases: data.codebases || [],
    gitHotspots: data.gitHotspots || [],
    addModel,
    removeModel,
    updateModel,
    logUsage,
    addCodebase,
    toggleQuotaConnectionMode,
    exportData,
    importData,
    resetDemo,
    clearAll,
  }
}

export type Tracker = ReturnType<typeof useTracker>
