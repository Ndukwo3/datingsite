
"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      try {
        const storedTheme = localStorage.getItem(storageKey) as Theme | null;
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (e) {
        // Ignore
      }
    }
  }, [isMounted, storageKey]);
  
  React.useEffect(() => {
    if (!isMounted) return;
    
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    let effectiveTheme = theme;
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
    }

    root.classList.add(effectiveTheme)
  }, [theme, isMounted])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (isMounted) {
        try {
          localStorage.setItem(storageKey, newTheme);
        } catch (e) {
          // Ignore
        }
        setTheme(newTheme);
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
