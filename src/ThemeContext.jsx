import { createContext, useContext, useState, useEffect, useMemo } from 'react'

/* ───── Light palette ───── */
const light = {
  bg: '#f4f5f7',
  surface: '#ffffff',
  surfaceHover: '#f9fafb',
  nav: '#1b2a4a',
  navText: '#c7d0e0',
  navActive: '#ffffff',
  heading: '#111827',
  text: '#374151',
  muted: '#6b7280',
  subtle: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#f0f0f3',
  accent: '#2563eb',
  accentHover: '#1d4ed8',
  accentLight: '#eff6ff',
  accentShadow: 'rgba(37,99,235,0.25)',
  accentRing: 'rgba(37,99,235,0.1)',
  accentBorder: '#bfdbfe',
  green: '#059669',
  greenBg: '#ecfdf5',
  greenBorder: '#a7f3d0',
  amber: '#d97706',
  amberBg: '#fffbeb',
  amberBorder: '#fde68a',
  red: '#dc2626',
  redBg: '#fef2f2',
  redBorder: '#fecaca',
  cyan: '#0891b2',
  cyanBg: '#ecfeff',
  cyanBorder: '#a5f3fc',
  selectedBg: '#dbeafe',
  selectedBorder: '#93c5fd',
  expandedBg: '#f8faff',
  expandedBorder: '#dbeafe',
  grayBg: '#f9fafb',
  inputBg: '#f9fafb',
  inputFocusBg: '#ffffff',
  shadow: '0 4px 24px rgba(0,0,0,0.06)',
  tabBg: '#f4f5f7',
  domainBg: '#eff6ff',
  domainBorder: '#bfdbfe',
}

/* ───── Dark palette ───── */
const dark = {
  bg: '#0f1117',
  surface: '#1a1d2e',
  surfaceHover: '#232738',
  nav: '#151827',
  navText: '#8b95b0',
  navActive: '#f1f5f9',
  heading: '#f1f5f9',
  text: '#cbd5e1',
  muted: '#94a3b8',
  subtle: '#64748b',
  border: '#2d3348',
  borderLight: '#232738',
  accent: '#3b82f6',
  accentHover: '#60a5fa',
  accentLight: '#1e293b',
  accentShadow: 'rgba(59,130,246,0.3)',
  accentRing: 'rgba(59,130,246,0.15)',
  accentBorder: '#1e3a5f',
  green: '#34d399',
  greenBg: '#052e16',
  greenBorder: '#065f46',
  amber: '#fbbf24',
  amberBg: '#451a03',
  amberBorder: '#78350f',
  red: '#f87171',
  redBg: '#450a0a',
  redBorder: '#7f1d1d',
  cyan: '#22d3ee',
  cyanBg: '#083344',
  cyanBorder: '#155e75',
  selectedBg: '#1e3a5f',
  selectedBorder: '#2563eb',
  expandedBg: '#151d2e',
  expandedBorder: '#2d3348',
  grayBg: '#151827',
  inputBg: '#151827',
  inputFocusBg: '#1a1d2e',
  shadow: '0 4px 24px rgba(0,0,0,0.3)',
  tabBg: '#151827',
  domainBg: '#1e293b',
  domainBorder: '#1e3a5f',
}

const STORAGE_KEY = 'ai-sprint-theme'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  /* Persist preference */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
    // Also set a data attribute on <html> for potential CSS usage
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    // Update body background to prevent flash on navigation
    document.body.style.background = isDark ? dark.bg : light.bg
  }, [isDark])

  /* Listen for system preference changes (only when user hasn't explicitly chosen) */
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setIsDark(e.matches)
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => setIsDark(prev => !prev)

  const value = useMemo(() => ({
    C: isDark ? dark : light,
    isDark,
    toggleTheme,
  }), [isDark])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
