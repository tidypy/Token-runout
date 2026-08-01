"use client"

import * as React from "react"

import { exportJson, loadData, makeId, parseImport, saveData, seedData } from "@/lib/tracker/storage"
import type { TrackedModel, TrackerData, UsageEntry } from "@/lib/tracker/types"

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
  const [data, setData] = React.useState<TrackerData>({ version: 1, models: [] })
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
    update(() => ({ version: 1, models: [] }))
  }, [update])

  return {
    hydrated,
    models: data.models,
    addModel,
    removeModel,
    updateModel,
    logUsage,
    exportData,
    importData,
    resetDemo,
    clearAll,
  }
}

export type Tracker = ReturnType<typeof useTracker>
