import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import MediaCarousel from '../components/MediaCarousel'
import { experience } from '../data/portfolio'

function findSeason(slug) {
  for (const job of experience) {
    const season = job.seasons?.find((s) => s.slug === slug)
    if (season) return { job, season }
  }
  return null
}

export default function SeasonPage() {
  const { slug } = useParams()
  const match = findSeason(slug)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!match) {
    return (
      <main>
        <section className="section detail-page">
          <Link to="/#experience" className="detail-back">
            <Icon name="chevronLeft" size={16} /> Back to experience
          </Link>
          <h1>Season not found</h1>
          <p className="detail-meta">That season doesn't exist, or the link may be out of date.</p>
        </section>
      </main>
    )
  }

  const { job, season } = match

  return (
    <main>
      <section className="section detail-page">
        <Link to="/#experience" className="detail-back">
          <Icon name="chevronLeft" size={16} /> Back to experience
        </Link>

        <div className="detail-header">
          <h1>{season.label}</h1>
          <p className="detail-meta">
            {job.role} ·{' '}
            {job.companyUrl ? (
              <a href={job.companyUrl} target="_blank" rel="noreferrer">
                {job.company}
              </a>
            ) : (
              job.company
            )}
          </p>

          {season.repoUrl && (
            <a className="season-repo-link" href={season.repoUrl} target="_blank" rel="noreferrer">
              <Icon name="github" size={14} /> Code
            </a>
          )}
        </div>

        <MediaCarousel items={season.media} emptyLabel="Add photos or videos from this season" />

        <div className="season-awards">
          <div className="season-awards-header">
            <h4>
              <Icon name="trophy" size={16} /> Awards
            </h4>
            <span className="season-award-count">
              {season.awards.length} {season.awards.length === 1 ? 'award' : 'awards'}
            </span>
          </div>
          {season.awards.length > 0 ? (
            <ul className="modal-highlights">
              {season.awards.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <p className="season-no-awards">No awards this season.</p>
          )}
        </div>

        {season.bullets?.length > 0 && (
          <ul className="timeline-bullets">
            {season.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
