import { Link } from 'react-router'
import Icon from './Icon'
import { experience } from '../data/portfolio'

export default function Experience() {
  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience</h2>

      <ol className="timeline">
        {experience.map((job) => {
          const key = `${job.company}-${job.role}`

          return (
            <li key={key} className="timeline-item">
              <div className="timeline-marker" aria-hidden="true" />

              <div className="timeline-content">
                <div className="timeline-main">
                  <div className="timeline-header">
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

                  <Link to="/experience" className="expand-hint">
                    View details <Icon name="chevronRight" size={14} />
                  </Link>
                </div>

                {job.image && (
                  <div className="timeline-thumb">
                    <img src={job.image} alt="" />
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
