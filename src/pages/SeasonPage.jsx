import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Block, Crumb, HeroBand, MetaLine, BestBadge, Pager, TechList } from '../components/ui'
import { experience } from '../data/portfolio'

// Flatten every season so we can walk prev/next across the whole history.
function allSeasons() {
  return experience.flatMap((job) => (job.seasons ?? []).map((season) => ({ job, season })))
}

export default function SeasonPage() {
  const { slug } = useParams()
  const flat = allSeasons()
  const index = flat.findIndex((entry) => entry.season.slug === slug)
  const entry = index >= 0 ? flat[index] : null

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!entry) {
    return (
      <article className="detail">
        <div className="wrap">
          <h1 className="detail-title">Season not found</h1>
          <p className="detail-lead">That season doesn&apos;t exist, or the link may be out of date.</p>
          <div className="detail-actions">
            <a className="btn btn-primary" href="/#experience">
              Back to experience
            </a>
          </div>
        </div>
      </article>
    )
  }

  const { job, season } = entry
  const prev = index > 0 ? flat[index - 1].season : null
  const next = index < flat.length - 1 ? flat[index + 1].season : null

  return (
    <article className="detail">
      <div className="wrap">
        <Crumb to="/#experience" label="Experience" />

        <header className="detail-head">
          <h1 className="detail-title">
            {season.label}
            {season.best && <BestBadge label={season.bestLabel} />}
          </h1>
          <p className="detail-lead">{season.description || job.role}</p>

          {season.repoUrl && (
            <div className="detail-actions">
              <a className="btn" href={season.repoUrl} target="_blank" rel="noreferrer">
                Robot code
              </a>
            </div>
          )}
        </header>

        <MetaLine items={[job.dates, job.company, job.role]} />
        <TechList items={job.tags} label="Working in" />

        <HeroBand
          image={season.heroImage || season.image}
          alt={season.heroCaption || ''}
          caption={season.heroCaption}
          items={season.awards}
          label="Recognition"
        />

        {season.sections?.map((section, i) => (
          <Block key={i} section={section} index={i} wide={i === 0} />
        ))}

        <Pager
          prev={prev ? { ...prev, title: prev.label.split('· ').pop(), year: prev.year } : null}
          next={next ? { ...next, title: next.label.split('· ').pop(), year: next.year } : null}
          base="/experience"
        />
      </div>
    </article>
  )
}
