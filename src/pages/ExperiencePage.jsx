import { useEffect } from 'react'
import { Link } from 'react-router'
import Icon from '../components/Icon'
import MediaCarousel from '../components/MediaCarousel'
import { experience } from '../data/portfolio'

// Awards sometimes include a leading placement line like
// "4th of 10,000+ teams in Autonomous Skills at Worlds" — pull that out
// so it can headline the record as a single stat instead of just
// another line buried in the list.
const RANK_RE = /^(\d+(?:st|nd|rd|th)) of ([\d,]+\+?) teams(?: in (.+))?$/i

function splitAwards(awards = []) {
  const rankIndex = awards.findIndex((a) => RANK_RE.test(a))
  if (rankIndex === -1) return { rank: null, medals: awards }
  const match = awards[rankIndex].match(RANK_RE)
  return {
    rank: { place: match[1], of: match[2], context: match[3] || '' },
    medals: awards.filter((_, i) => i !== rankIndex),
  }
}

// High Stakes leads (it's the season this role is most defined by), then
// the rest fall in newest-to-oldest.
function orderSeasons(seasons = []) {
  const featured = seasons.filter((s) => s.slug === 'high-stakes')
  const rest = seasons
    .filter((s) => s.slug !== 'high-stakes')
    .sort((a, b) => {
      const yearOf = (s) => Number(s.label.match(/(\d{4})/)?.[1] || 0)
      return yearOf(b) - yearOf(a)
    })
  return [...featured, ...rest]
}

function SeasonRow({ season }) {
  const { rank, medals } = splitAwards(season.awards)

  return (
    <div className="record-row">
      <div className="record-row-media">
        <MediaCarousel items={season.media} emptyLabel="Add photos or videos from this season" />
      </div>

      <div className="record-row-info">
        <div className="record-row-heading">
          <h2>{season.label}</h2>
          {season.repoUrl && (
            <a className="season-repo-link" href={season.repoUrl} target="_blank" rel="noreferrer">
              <Icon name="github" size={14} /> Code
            </a>
          )}
        </div>

        {rank && (
          <div className="record-score">
            <span className="record-score-num">{rank.place}</span>
            <span className="record-score-of">
              of {rank.of} teams{rank.context ? ` · ${rank.context}` : ''}
            </span>
          </div>
        )}

        {medals.length > 0 && (
          <ul className="record-medals">
            {medals.map((m, i) => (
              <li key={i}>
                <Icon name="trophy" size={14} />
                {m}
              </li>
            ))}
          </ul>
        )}

        {season.bullets?.length > 0 && (
          <ul className="record-bullets">
            {season.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function JobRecord({ job }) {
  const seasons = orderSeasons(job.seasons)

  return (
    <div className="detail-header">
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

      <div className="tag-row">
        {job.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="record-rows">
        {seasons.map((s) => (
          <SeasonRow key={s.slug} season={s} />
        ))}
      </div>
    </div>
  )
}

export default function ExperiencePage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main>
      <section className="section detail-page detail-page-record">
        <Link to="/#experience" className="detail-back">
          <Icon name="chevronLeft" size={16} /> Back to experience
        </Link>

        {experience.map((job) => (
          <JobRecord key={`${job.company}-${job.role}`} job={job} />
        ))}
      </section>
    </main>
  )
}
