import Icon from './Icon'
import { profile } from '../data/portfolio'

export default function Contact() {
  return (
    <section id="contact" className="section section-contact">
      <h2 className="section-title">Get in Touch</h2>
      <p className="contact-text">I'm looking for a Winter 2027 internship. Feel free to send me an email!</p>

      <a className="button button-primary" href={`mailto:${profile.email}`}>
        <Icon name="mail" size={16} /> Say Hello
      </a>

      <div className="hero-socials contact-socials">
        {profile.socials
          .filter((s) => s.icon !== 'mail')
          .map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
              <Icon name={s.icon} />
            </a>
          ))}
      </div>
    </section>
  )
}
