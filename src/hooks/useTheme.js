import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function readSavedTheme() {
  if (typeof window === 'undefined') return null
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage unavailable (private mode) — fall through to the default
  }
  return null
}

// The site opens white for everyone, deliberately: the operating system's
// dark-mode preference is NOT consulted. Dark applies only once a visitor
// flips the toggle, and that choice is remembered.
export default function useTheme() {
  const [choice, setChoice] = useState(readSavedTheme)

  const theme = choice ?? 'light'

  useEffect(() => {
    const root = document.documentElement
    if (choice) root.dataset.theme = choice
    else delete root.dataset.theme

    // Keep the browser's own chrome (address bar on mobile) in step.
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0c0e11' : '#f8f7f4')

    try {
      if (choice) window.localStorage.setItem(STORAGE_KEY, choice)
      else window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore write failures
    }
  }, [choice, theme])

  const toggleTheme = useCallback(() => {
    setChoice((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme, themeChoice: choice }
}
