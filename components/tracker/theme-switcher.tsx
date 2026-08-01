"use client"

import * as React from "react"
import { MoonIcon, PaletteIcon, SunIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type ThemeMode = "light" | "dark" | "pro-blue"

const STORAGE_THEME_KEY = "token-runway:theme"

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<ThemeMode>("light")

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY) as ThemeMode | null
    if (saved && (saved === "light" || saved === "dark" || saved === "pro-blue")) {
      applyTheme(saved)
    }
  }, [])

  function applyTheme(mode: ThemeMode) {
    setTheme(mode)
    localStorage.setItem(STORAGE_THEME_KEY, mode)

    const root = document.documentElement
    root.classList.remove("dark", "theme-pro-blue")

    if (mode === "dark") {
      root.classList.add("dark")
    } else if (mode === "pro-blue") {
      root.classList.add("theme-pro-blue")
    }
  }

  function handleSelect(mode: ThemeMode, label: string) {
    applyTheme(mode)
    toast(`Activated ${label} theme`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 bg-background/50 border-border/60">
            {theme === "dark" && <MoonIcon className="size-3.5 text-primary" />}
            {theme === "pro-blue" && <PaletteIcon className="size-3.5 text-primary" />}
            {theme === "light" && <SunIcon className="size-3.5 text-warning" />}
            <span className="capitalize text-xs font-medium">
              {theme === "pro-blue" ? "Pro Blue CMS" : `${theme} Theme`}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleSelect("light", "Light Glassy")}>
            <SunIcon className="mr-2 size-4 text-warning" />
            <span>Light Glassy</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("dark", "Sleek Dark Mode")}>
            <MoonIcon className="mr-2 size-4 text-primary" />
            <span>Sleek Dark Mode</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("pro-blue", "Pro Blue CMS")}>
            <PaletteIcon className="mr-2 size-4 text-blue-500" />
            <span>Pro Blue CMS</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
