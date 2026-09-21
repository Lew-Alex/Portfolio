import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import Icon from './Icon'
import useTheme from '../hooks/useTheme'
import { HashLink } from './ui'
import { profile } from '../data/portfolio'

const links = [
  { label: 'About', hash: '#about', id: 'about' },
  { label: 'Experience', hash: '#experience', id: 'experience' },
  { label: 'Projects', hash: '#projects', id: 'projects' },
  { label: 'Contact', hash: '#contact', id: 'contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const onHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section you're actually looking at (home page only).
  useEffect(() => {
    if (!onHome || typeof IntersectionObserver === 'undefined') {
      setActive('')
      return undefined
    }
    const targets = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean)
    if (!targets.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-90px 0px -55% 0px', threshold: [0, 0.2, 0.5] },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [onHome])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="wrap nav-inner">
        <HashLink href="#top" className="nav-brand" onNavigate={() => setOpen(false)}>
          {profile.name}
          <span>Robotics / Mechatronics</span>
        </HashLink>

        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Sections">
          {links.map((link) => (
            <HashLink
              key={link.hash}
              href={link.hash}
              className={`nav-link ${onHome && active === link.id ? 'is-active' : ''}`}
              onNavigate={() => setOpen(false)}
            >
              {link.label}
            </HashLink>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            className="icon-btn nav-social"
            href={profile.socials[0].href}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Icon name="github" size={17} />
          </a>
          <a
            className="icon-btn nav-social"
            href={profile.socials[1].href}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Icon name="linkedin" size={17} />
          </a>
          {profile.resumeUrl && (
            <a className="eyebrow nav-resume" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Resume
            </a>
          )}
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
          <button
            type="button"
            className="icon-btn nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
