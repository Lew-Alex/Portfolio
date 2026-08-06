import { useEffect } from 'react'
import { Link } from 'react-router'
import Icon from '../components/Icon'
import MediaCarousel from '../components/MediaCarousel'
import { experience } from '../data/portfolio'

function SeasonBlock({ season }) {
  return (
    <div className="season-full-block">
      <div className="season-block-header">
        <span className="season-block-label">{season.label}</span>
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
    </div>
  )
}

export default function ExperiencePage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main>
      <section className="section detail-page">
        <Link to="/#experience" className="detail-back">
          <Icon name="chevronLeft" size={16} /> Back to experience
        </Link>

        {experience.map((job) => {
          const key = `${job.company}-${job.role}`
          const seasonsRecentFirst = job.seasons ? [...job.seasons].reverse() : []

          return (
            <div key={key} className="detail-header">
              <h1>
                {job.role} ·{' '}
                {job.companyUrl ? (
                  <a href={job.companyUrl} target="_blank" rel="noreferrer">
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
              </h1>
              <p className="detail-meta">
                {job.dates}
                {job.location ? ` · ${job.location}` : ''}
              </p>

              {job.awardsSummary && (
                <ul className="timeline-bullets">
                  <li>{job.awardsSummary}</li>
                </ul>
              )}
              {job.bullets?.length > 0 && (
                <ul className="timeline-bullets">
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}

              <div className="tag-row">
                {job.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              {seasonsRecentFirst.length > 0 && (
                <div className="season-full-list">
                  {seasonsRecentFirst.map((s) => (
                    <SeasonBlock key={s.label} season={s} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </section>
    </main>
  )
}
