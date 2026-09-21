import Icon from './Icon'
import { profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span className="eyebrow">
          © {new Date().getFullYear()} {profile.name}
        </span>

        <span className="eyebrow">{profile.location}</span>

        <button
          type="button"
          className="eyebrow"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top <Icon name="arrowUp" size={13} />
        </button>
      </div>
    </footer>
  )
}
