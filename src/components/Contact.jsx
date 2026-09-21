import Icon from './Icon'
import { Reveal, SectionHead } from './ui'
import { contact, profile } from '../data/portfolio'

export default function Contact() {
  const socials = profile.socials.filter((s) => s.icon !== 'mail')

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <SectionHead index="04" title={contact.title} lead={contact.lead} />

        <Reveal>
          {contact.statement && <h3 className="contact-title">{contact.statement}</h3>}

          <a className="contact-mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>

          <div className="contact-links">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              <Icon name="mail" size={14} /> Say hello
            </a>
            {socials.map((s) => (
              <a className="btn" key={s.label} href={s.href} target="_blank" rel="noreferrer">
                <Icon name={s.icon} size={14} /> {s.label}
              </a>
            ))}
            {profile.resumeUrl && (
              <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                Resume
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
