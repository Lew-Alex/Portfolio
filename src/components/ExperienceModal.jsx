import { useEffect } from 'react'
import Icon from './Icon'
import MediaCarousel from './MediaCarousel'

export default function ExperienceModal({ job, onClose }) {
  useEffect(() => {
    if (!job) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [job, onClose])

  if (!job) return null

  // Most recent season first.
  const seasons = job.seasons ? [...job.seasons].reverse() : []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={job.role}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={18} />
        </button>

        <div className="modal-header">
          <h3>
            {job.role} ·{' '}
            {job.companyUrl ? (
              <a href={job.companyUrl} target="_blank" rel="noreferrer">
                {job.company}
              </a>
            ) : (
              job.company
            )}
          </h3>
          <span className="timeline-dates">
            {job.dates}
            {job.location ? ` · ${job.location}` : ''}
          </span>
          <div className="tag-row">
            {job.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {seasons.length > 0 && (
          <div className="season-list">
            {seasons.map((season) => (
              <div key={season.label} className="season-block">
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
