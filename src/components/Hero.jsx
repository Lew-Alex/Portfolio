import Icon from './Icon'
import { HashLink, Reveal } from './ui'
import { profile } from '../data/portfolio'

export default function Hero() {
  const rows = [
    ['Focus', profile.focus],
    ['Tools', profile.tools],
    ['Now', profile.now],
  ].filter(([, value]) => Boolean(value))

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-top">
          <div className="hero-lead">
            <p className="eyebrow hero-eyebrow">
              <span>{profile.location}</span>
              <span className="dot" aria-hidden="true" />
              <span className="live">{profile.availability}</span>
            </p>

            <h1 className="hero-name">{profile.name}</h1>

            <p className="hero-headline">
              {profile.role}
              <em>{profile.headline}</em>
            </p>
          </div>

          {profile.portrait && (
            <figure className="hero-portrait">
              <img src={profile.portrait} alt={`Portrait of ${profile.name}`} />
              {profile.portraitCaption && (
                <figcaption className="hero-caption">{profile.portraitCaption}</figcaption>
              )}
            </figure>
          )}
        </div>

        <div className={`hero-cols ${profile.intro?.length ? '' : 'is-solo'}`}>
          {profile.intro?.length > 0 && (
            <div className="prose hero-body">
              {profile.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <div className="hero-actions">
            <HashLink href="#projects" className="btn btn-primary">
              View projects
            </HashLink>
            <HashLink href="#contact" className="btn">
              Get in touch
            </HashLink>
            {profile.resumeUrl && (
              <a className="btn" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                Resume <Icon name="arrowUp" size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      {profile.heroImage && (
        <Reveal as="figure" className="hero-figure wrap">
          <div className="hero-figure-img">
            <img src={profile.heroImage} alt={profile.heroCaption || ''} fetchPriority="high" />
          </div>
          {profile.heroCaption && <figcaption className="hero-caption">{profile.heroCaption}</figcaption>}
        </Reveal>
      )}

      {rows.length > 0 && (
        <div className="wrap">
          <dl className="spec-rows">
            {rows.map(([label, value]) => (
              <div className="spec-row" key={label}>
                <dt className="eyebrow">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  )
}
