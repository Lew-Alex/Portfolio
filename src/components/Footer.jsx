import Icon from './Icon'
import { profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name}. Built with React + Vite.
      </p>
      <a href="#top" className="icon-button" aria-label="Back to top">
        <Icon name="arrowUp" size={16} />
      </a>
    </footer>
  )
}
