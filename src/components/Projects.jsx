import { Link } from 'react-router'
import Icon from './Icon'
import { projects } from '../data/portfolio'

// Fixed per-card tilt so photos read as pinned up rather than a
// perfectly uniform grid — deterministic, not random, so it's stable
// across re-renders instead of jittering.
const TILTS = [-3, 2, -2, 3]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="section-title">Projects</h2>

      <div className="pin-grid">
        {projects.map((project, i) => (
          <Link key={project.title} to={`/projects/${project.slug}`} className="pin-card">
            <div className="pin-photo" style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}>
              <span className="pin-tape" aria-hidden="true" />
              <div className="pin-image" aria-hidden="true">
                {project.image ? (
                  <img src={project.image} alt="" />
                ) : (
                  <span>{project.title.slice(0, 1)}</span>
                )}
              </div>
              <span className="pin-index">{`0${i + 1}`}</span>
            </div>

            <div className="pin-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <span className="expand-hint">
                {project.cadUrl ? 'View Details And CAD' : 'View details'} <Icon name="chevronRight" size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
