import { Link, useLocation } from 'react-router'
import Icon from './Icon'
import MediaCarousel from './MediaCarousel'
import useReveal from '../hooks/useReveal'

/* ---------------------------------------------------------------------------
   BestBadge: marks the standout season with a bare star. No visible wording -
   the name is only exposed to screen readers and as a hover title. Data-driven
   (`best` on a season), so the marker moves with one line of data.
   --------------------------------------------------------------------------- */
export function BestBadge({ label = 'Standout season', className = '' }) {
  return (
    <span className={`best-badge ${className}`.trim()} role="img" aria-label={label} title={label}>
      <Icon name="star" size={13} />
    </span>
  )
}

/* ---------------------------------------------------------------------------
   HashLink: in-page section links that work every time.

   A router <Link to="/#projects"> is a no-op when the URL already ends in
   #projects, so a second click (or any click from the nav) went nowhere. This
   scrolls directly, then mirrors the hash into the URL so it stays shareable.
   --------------------------------------------------------------------------- */
export function HashLink({ href, children, className, onNavigate }) {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  const handleClick = (event) => {
    onNavigate?.()
    if (!onHome) return // let the router navigate to "/", HomePage scrolls to the hash
    event.preventDefault()
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', href)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', pathname)
    }
  }

  if (onHome) {
    return (
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
    )
  }
  return (
    <Link to={`/${href}`} className={className} onClick={onNavigate}>
      {children}
    </Link>
  )
}

/* ---------------------------------------------------------------------------
   Reveal: wraps children in a scroll-triggered fade/rise
   --------------------------------------------------------------------------- */
export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }) {
  const [ref, shown] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/* ---------------------------------------------------------------------------
   SectionHead: "01 / Title", with an optional standfirst on the right
   --------------------------------------------------------------------------- */
export function SectionHead({ index, title, lead, id }) {
  return (
    <header className="section-head">
      <div className="section-head-top">
        {index && <span className="eyebrow section-index num">{index}</span>}
        <h2 className="section-title" id={id}>
          {title}
        </h2>
      </div>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  )
}

/* ---------------------------------------------------------------------------
   TechList: a single mono line, not a wall of chips
   --------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   MetaLine: the page's facts (dates, team, status, roles) as one line, so the
   header stays shallow. Values only; the labels the old spec strip carried were
   doing little work. The row never wraps: it scrolls sideways when a narrow
   screen cannot fit it, which keeps the header exactly one line tall.
   --------------------------------------------------------------------------- */
export function MetaLine({ items = [], className = '' }) {
  const parts = items.filter(Boolean)
  if (!parts.length) return null
  return (
    <p className={`meta-line ${className}`.trim()}>
      {parts.map((part, i) => (
        <span className="meta-item" key={i}>
          {part}
        </span>
      ))}
    </p>
  )
}

export function TechList({ items = [], label = 'Built with' }) {
  if (!items.length) return null
  return (
    <div className="tech-line">
      <span className="eyebrow">{label}</span>
      <ul className="tech-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   HeroBand: the page's main image, hung slightly left of the text column, with
   the recognitions set large on the right. With no recognitions the image takes
   the full width; with no image the list does.
   --------------------------------------------------------------------------- */

// Awards arrive in two shapes: season `awards` are plain strings that often end
// in a parenthetical ("Think Award (2026 VEX Worlds)"), project `recognition`
// entries are objects. Normalise both into a title + one line of context.
function normalizeAwards(items = []) {
  return items.map((item) => {
    if (typeof item === 'string') {
      const m = item.match(/^(.*?)\s*\((.+)\)\s*$/)
      return m ? { title: m[1], meta: m[2] } : { title: item, meta: '' }
    }
    return {
      title: item.title,
      meta: [item.year, item.context, item.note].filter(Boolean).join(' · '),
    }
  })
}

function AwardsPanel({ items, label }) {
  if (!items.length) return null
  return (
    <div className="awards-panel">
      <span className="eyebrow">{label}</span>
      <ol className="awards">
        {items.map((award, i) => (
          <li className="award" key={i}>
            <span className="award-num num">{String(i + 1).padStart(2, '0')}</span>
            <div className="award-body">
              <h3 className="award-title">{award.title}</h3>
              {award.meta && <p className="award-meta">{award.meta}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function HeroBand({ image, alt = '', caption, items = [], label = 'Recognition' }) {
  const awards = normalizeAwards(items)
  if (!image && !awards.length) return null
  const paired = Boolean(image && awards.length)

  return (
    <Reveal as="section" className={`hero-band${paired ? '' : ' hero-band--solo'}`}>
      {image && (
        <figure className="hero-band-figure">
          <div className="hero-figure-img">
            <img src={image} alt={alt} loading="lazy" />
          </div>
          {caption && <figcaption className="figcaption">{caption}</figcaption>}
        </figure>
      )}
      <AwardsPanel items={awards} label={label} />
    </Reveal>
  )
}

/* ---------------------------------------------------------------------------
   Stats: measured numbers, set in mono so they read as instrument readings
   --------------------------------------------------------------------------- */
export function Stats({ stats = [] }) {
  if (!stats.length) return null
  return (
    <ul className="stats">
      {stats.map((s, i) => (
        <li className="stat" key={i}>
          <span className="stat-value num">{s.value}</span>
          <span className="stat-label eyebrow">{s.label}</span>
          {s.note && <span className="stat-note">{s.note}</span>}
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------------------------------------------------------
   Figures
   --------------------------------------------------------------------------- */
export function FigureGrid({ images = [] }) {
  if (!images.length) return null
  const cols = images.length > 2 ? 'cols-3' : `cols-${images.length}`
  return (
    <div className={`figure-grid ${cols}`}>
      {images.map((img, i) => (
        <figure className="figure" key={i}>
          <div className="figure-img">
            <img src={img.src} alt={img.caption || ''} loading="lazy" decoding="async" />
          </div>
          {img.caption && <figcaption className="figcaption">{img.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

export function VideoFigure({ video }) {
  if (!video?.src) return null
  return (
    <figure className="block-video">
      <video src={video.src} controls preload="metadata" playsInline />
      {video.caption && <figcaption className="figcaption">{video.caption}</figcaption>}
    </figure>
  )
}

export function Gallery({ items = [], carousel = false }) {
  if (!items.length) return null
  // A carousel option for long sets: one fixed-size slide instead of a wall of
  // thumbnails. `fit="cover"` would make every slide fill the frame, cropping
  // anything that does not match it.
  if (carousel) return <MediaCarousel items={items} />
  // Otherwise every gallery flows as masonry: three columns of natural-height
  // media, so a row is never padded out to its tallest member and nothing is
  // cropped. Each item carries its intrinsic size, so the browser reserves the
  // right box before the file arrives and the columns never jump.
  return (
    <div className="gallery">
      {items.map((item, i) => (
        <figure className="figure gallery-item" key={i}>
          <div className="figure-img gallery-media">
            {item.type === 'video' ? (
              <video
                src={item.src}
                width={item.w}
                height={item.h}
                controls
                preload="metadata"
                playsInline
              />
            ) : (
              <img
                src={item.src}
                alt={item.caption || ''}
                width={item.w}
                height={item.h}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <figcaption className="gallery-caption">
            <span className="gallery-index num">{String(i + 1).padStart(2, '0')}</span>
            {item.caption && <span className="gallery-caption-text">{item.caption}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Block: one numbered section. The number and title run in on the same line
   with a rule trailing off to the right, and the body sits underneath in a
   single measured column.
   --------------------------------------------------------------------------- */
export function Block({ section, index, wide = false }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <Reveal as="section" className={`block${wide ? ' block--wide' : ''}`}>
      <header className="block-head">
        <span className="eyebrow block-num num">{num}</span>
        <h2 className="block-title">{section.title}</h2>
      </header>

      {section.intro && <p className="block-intro">{section.intro}</p>}

      <div className="block-body">
        {section.type === 'prose' && (
          <div className="prose">
            {section.paragraphs?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {section.items?.length > 0 && (
              <ul className="simple-list">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {section.links?.length > 0 && (
              <ul className="prose-links">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label} <Icon name="external" size={12} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {section.type === 'columns' && (
          <div className="highlight-columns">
            {section.columns?.map((col, i) => (
              <div className="highlight-col" key={i}>
                <h3 className="highlight-title">{col.title}</h3>
                {col.text && <p className="highlight-text">{col.text}</p>}

                {col.contribution && (
                  <div className="highlight-contribution">
                    <p>{col.contribution}</p>
                  </div>
                )}

                <div className="highlight-media">
                  {col.videos?.length > 1 ? (
                    <MediaCarousel items={col.videos} />
                  ) : col.videos?.[0] ? (
                    <figure className="block-video">
                      <video src={col.videos[0].src} controls preload="metadata" />
                      {col.videos[0].caption && (
                        <figcaption className="figcaption">{col.videos[0].caption}</figcaption>
                      )}
                    </figure>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {section.type === 'spec-grid' && (
          <dl className="spec-grid">
            {section.specs?.map((s, i) => (
              <div className="spec-cell" key={i}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {section.type === 'stats' && <Stats stats={section.stats} />}

        {(section.type === 'figure-grid' || section.type === 'image-grid') && (
          <FigureGrid images={section.images} />
        )}

        {section.type === 'video' && <VideoFigure video={section.video} />}

        {section.type === 'timeline' && (
          <ol className="timeline">
            {section.groups?.map((group, gi) => (
              <li className="timeline-group" key={gi}>
                <header className="timeline-group-head">
                  <span className="timeline-when num">{group.when}</span>
                </header>
                <div className="timeline-items">
                  {group.items?.map((item, i) => (
                    <figure className="timeline-item" key={i}>
                      <div className="figure-img">
                        {item.type === 'video' ? (
                          <video
                            src={item.src}
                            width={item.w}
                            height={item.h}
                            controls
                            preload="metadata"
                            playsInline
                          />
                        ) : (
                          <img
                            src={item.src}
                            alt={item.caption || ''}
                            width={item.w}
                            height={item.h}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                      {item.caption && <figcaption className="timeline-caption">{item.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}

        {section.type === 'media-split' && (
          <div className="media-split">
            <div className="media-split-col">
              <span className="eyebrow">{section.leftTitle || 'Photos'}</span>
              <MediaCarousel items={section.photos} />
            </div>
            <div className="media-split-col">
              <span className="eyebrow">{section.rightTitle || 'Video'}</span>
              <MediaCarousel items={section.videos} />
            </div>
          </div>
        )}

        {section.type === 'gallery' && (
          <Gallery items={section.items} carousel={section.carousel} />
        )}

        {section.type === 'callout' && (
          <p className="callout">
            <strong>{section.title}: </strong>
            {section.text}
          </p>
        )}
      </div>
    </Reveal>
  )
}

/* ---------------------------------------------------------------------------
   Crumb: "Projects / WRO Robot"
   --------------------------------------------------------------------------- */
export function Crumb({ to, label, current }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <Link to={to}>{label}</Link>
      {current && (
        <>
          <span className="crumb-sep" aria-hidden="true">
            /
          </span>
          <span>{current}</span>
        </>
      )}
    </nav>
  )
}

/* ---------------------------------------------------------------------------
   Pager: previous / next as two hairline rows, not cards
   --------------------------------------------------------------------------- */
export function Pager({ prev, next, base }) {
  if (!prev && !next) return null
  return (
    <nav className="pager" aria-label="More projects">
      {prev ? (
        <Link className="pager-link" to={`${base}/${prev.slug}`}>
          <span className="eyebrow pager-label">← Previous</span>
          <span className="pager-title">{prev.title}</span>
          <span className="pager-year num">{prev.year}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="pager-link is-next" to={`${base}/${next.slug}`}>
          <span className="eyebrow pager-label">Next →</span>
          <span className="pager-title">{next.title}</span>
          <span className="pager-year num">{next.year}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
