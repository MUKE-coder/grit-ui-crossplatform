import { useState, useEffect, useCallback } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedMode = 'light' | 'dark'

const STORAGE_KEY = 'grit-ui-theme'

function getSystemTheme(): ResolvedMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveMode(mode: ThemeMode): ResolvedMode {
  return mode === 'system' ? getSystemTheme() : mode
}

/**
 * Manage theme mode with system detection and localStorage persistence.
 * Adds/removes the `dark` class on the document element.
 *
 * @example
 * const { mode, setMode, resolvedMode } = useThemeMode()
 */
export function useThemeMode(): {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  resolvedMode: ResolvedMode
} {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system'
  })

  const [resolvedMode, setResolvedMode] = useState<ResolvedMode>(() =>
    resolveMode(mode)
  )

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newMode)
    }
  }, [])

  useEffect(() => {
    const resolved = resolveMode(mode)
    setResolvedMode(resolved)

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', resolved === 'dark')
    }
  }, [mode])

  useEffect(() => {
    if (typeof window === 'undefined' || mode !== 'system') return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    function onChange() {
      const resolved = getSystemTheme()
      setResolvedMode(resolved)
      document.documentElement.classList.toggle('dark', resolved === 'dark')
    }

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [mode])

  return { mode, setMode, resolvedMode }
}
