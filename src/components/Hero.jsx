import Icon from './Icon'
import { profile } from '../data/portfolio'

const initials = profile.name
  .split(' ')
  .map((n) => n[0])
  .join('')
  .slice(0, 2)

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <span className="hero-status">{profile.tagline}</span>
          <h1>{profile.name}</h1>
          <p className="hero-role">{profile.role}</p>

          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              View Projects
            </a>
            <a className="button button-secondary" href="#contact">
              Get in Touch
            </a>
            {profile.resumeUrl && (
              <a className="button button-secondary" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                Resume
              </a>
            )}
          </div>

          <div className="hero-socials">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <Icon name={s.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-photo" aria-hidden="true">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>
    </section>
  )
}
