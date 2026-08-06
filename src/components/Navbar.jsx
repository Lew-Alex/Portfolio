import { useState } from 'react'
import { Link } from 'react-router'
import Icon from './Icon'
import { profile } from '../data/portfolio'

const links = [
  { label: 'About', hash: '#about' },
  { label: 'Experience', hash: '#experience' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Contact', hash: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/#top" className="navbar-brand" onClick={handleLinkClick}>
          {profile.name}
        </Link>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <Link key={link.hash} to={`/${link.hash}`} onClick={handleLinkClick}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="icon-button navbar-toggle"
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
