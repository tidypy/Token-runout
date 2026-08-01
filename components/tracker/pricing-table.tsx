"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PRICING_CATALOG, PRICING_UPDATED, PROVIDERS } from "@/lib/tracker/pricing"

export function PricingTable() {
  return (
    <Card className="gap-3 border-border/60 bg-card/65 py-4 shadow-sm backdrop-blur-xl">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">Provider pricing</CardTitle>
        <CardDescription className="text-xs">
          USD per 1M tokens. Snapshot as of {PRICING_UPDATED}; all forecasts use these rates.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Model</TableHead>
              <TableHead className="text-xs">Provider</TableHead>
              <TableHead className="text-right text-xs">Input</TableHead>
              <TableHead className="text-right text-xs">Output</TableHead>
              <TableHead className="text-right text-xs">Cached in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRICING_CATALOG.map((p) => (
              <TableRow key={p.modelId}>
                <TableCell className="text-xs font-medium">{p.label}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px]">
                    {PROVIDERS[p.provider].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  ${p.inputPerM.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  ${p.outputPerM.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {p.cachedInputPerM !== undefined ? `$${p.cachedInputPerM.toFixed(3)}` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
