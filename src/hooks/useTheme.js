import { useCallback, useEffect, useState } from 'react'

// The site opens white for everyone, always.
//
// Two things are deliberately ignored here:
//   - the operating system's dark-mode preference, and
//   - any dark choice stored from a previous visit.
//
// The second one matters: a remembered "dark" made the site open dark for a
// returning visitor even though white is meant to be the default, which reads
// as the site being broken rather than as a preference being honoured. The
// toggle still flips the theme for as long as you are on the page; it just does
// not survive a reload.
export default function useTheme() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.dataset.theme = 'dark'
    else delete root.dataset.theme

    // Keep the browser's own chrome (address bar on mobile) in step.
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0c0e11' : '#f8f7f4')

    // Clear any choice an earlier build stored, so nothing resurrects dark mode.
    try {
      window.localStorage.removeItem('theme')
    } catch {
      // ignore
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme, themeChoice: theme === 'light' ? null : 'dark' }
}
