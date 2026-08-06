import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import MediaCarousel from '../components/MediaCarousel'
import ModelViewer from '../components/ModelViewer'
import { projects } from '../data/portfolio'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!project) {
    return (
      <main>
        <section className="section detail-page">
          <Link to="/#projects" className="detail-back">
            <Icon name="chevronLeft" size={16} /> Back to projects
          </Link>
          <h1>Project not found</h1>
          <p className="detail-meta">That project doesn't exist, or the link may be out of date.</p>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="section detail-page">
        <Link to="/#projects" className="detail-back">
          <Icon name="chevronLeft" size={16} /> Back to projects
        </Link>

        <div className="detail-header">
          <h1>{project.title}</h1>
          <p className="detail-meta">{project.description}</p>

          <div className="modal-tag-bar">
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            {project.repoUrl && (
              <a className="season-repo-link" href={project.repoUrl} target="_blank" rel="noreferrer">
                <Icon name="github" size={14} /> Code
              </a>
            )}
          </div>
        </div>

        <MediaCarousel items={project.media} emptyLabel="Add photos or videos of this project" />

        <div className="modal-body">
          {project.details.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {project.highlights?.length > 0 && (
            <ul className="modal-highlights">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>

        {project.liveUrl && (
          <div className="modal-links">
            <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">
              Live <Icon name="external" size={14} />
            </a>
          </div>
        )}

        {project.cadUrl && (
          <div className="cad-section">
            <ModelViewer src={project.cadUrl} />
          </div>
        )}
      </section>
    </main>
  )
}
