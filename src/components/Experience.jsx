import { useState } from 'react'
import Icon from './Icon'
import ExperienceModal from './ExperienceModal'
import { experience } from '../data/portfolio'

export default function Experience() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience</h2>

      <ol className="timeline">
        {experience.map((job) => {
          const key = `${job.company}-${job.role}`

          return (
            <li key={key} className="timeline-item">
              <div className="timeline-marker" aria-hidden="true" />
              <div
                className="timeline-content"
                role="button"
                tabIndex={0}
                onClick={() => setSelected(job)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(job)
                  }
                }}
              >
                <div className="timeline-header">
                  <h3>
                    {job.role} ·{' '}
                    {job.companyUrl ? (
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </h3>
                  <span className="timeline-dates">{job.dates}</span>
                </div>
                <p className="timeline-location">{job.location}</p>
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

                <span className="expand-hint">
                  View details <Icon name="expand" size={14} />
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      <ExperienceModal job={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
