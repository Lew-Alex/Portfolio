import { Link } from 'react-router'
import Icon from './Icon'
import { BestBadge, Reveal, SectionHead } from './ui'
import { experience } from '../data/portfolio'

// The standout season leads the list; the rest read newest-first.
function seasonsLatestFirst(seasons = []) {
  return [...seasons].sort((a, b) => {
    if (Boolean(a.best) !== Boolean(b.best)) return a.best ? -1 : 1
    const yearOf = (s) => Number(s.year?.match(/\d{4}/)?.[0] || s.label.match(/\d{4}/)?.[0] || 0)
    return yearOf(b) - yearOf(a)
  })
}

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SectionHead
          index="02"
          title="Experience"
          lead="Four seasons on VEX Robotics Team 5225A: code, mechanisms and match strategy, season by season."
        />

        <ol className="timeline">
          {experience.map((job) => {
            const seasons = seasonsLatestFirst(job.seasons)

            return (
              <Reveal as="li" className="job" key={`${job.company}-${job.role}`}>
                <div className="job-grid">
                  <div>
                    <div className="job-head">
                      <h3 className="job-role">
                        {job.role}
                        {job.companyUrl ? (
                          <a href={job.companyUrl} target="_blank" rel="noreferrer">
                            {' '}
                            · {job.company}
                          </a>
                        ) : (
                          <span className="muted"> · {job.company}</span>
                        )}
                      </h3>
                      <span className="eyebrow job-dates num">{job.dates}</span>
                    </div>

                    <span className="eyebrow job-org">
                      {job.location}
                    </span>

                    {job.awardsSummary && <p className="job-awards">{job.awardsSummary}</p>}

                    {job.bullets?.length > 0 && (
                      <ul className="job-bullets">
                        {job.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}

                    {job.tags?.length > 0 && (
                      <div className="tag-row">
                        {job.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {job.image && (
                    <figure className="job-thumb">
                      <img src={job.image} alt="" loading="lazy" decoding="async" />
                    </figure>
                  )}
                </div>

                {seasons.length > 0 && (
                  <div className="season-index">
                    {seasons.map((season) => (
                      <Link className="season-link" to={`/experience/${season.slug}`} key={season.slug}>
                        <div className="season-thumb" aria-hidden="true">
                          {season.image ? <img src={season.image} alt="" loading="lazy" /> : null}
                        </div>

                        <div className="season-body">
                          <h4>
                            {season.label}
                            {season.best && <BestBadge label={season.bestLabel} />}
                          </h4>
                          {season.description && <p>{season.description}</p>}
                        </div>

                        <span className="season-go">
                          Read <Icon name="chevronRight" size={13} />
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
