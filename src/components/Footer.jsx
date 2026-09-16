import { Link } from 'react-router'
import Icon from './Icon'
import { profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <Link to="/#top" className="icon-button" aria-label="Back to top">
        <Icon name="arrowUp" size={16} />
      </Link>
    </footer>
  )
}
