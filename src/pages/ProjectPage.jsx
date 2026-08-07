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
      <section className="section detail-page simple-project">
        <MediaCarousel items={project.media} emptyLabel="Add photos or videos of this project" />

        <div className="simple-head">
          <h1>{project.title}</h1>
          <p className="simple-sub">{project.description}</p>

          <div className="simple-meta">
            {project.tags.map((tag) => (
              <span key={tag} className="simple-tag">
                {tag}
              </span>
            ))}
            {project.repoUrl && (
              <a className="simple-tag simple-tag-link" href={project.repoUrl} target="_blank" rel="noreferrer">
                Code
              </a>
            )}
            {project.liveUrl && (
              <a className="simple-tag simple-tag-link" href={project.liveUrl} target="_blank" rel="noreferrer">
                Live
              </a>
            )}
          </div>
        </div>

        <div className="simple-body">
          {project.details.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {project.highlights?.length > 0 && (
            <ul className="simple-list">
              {project.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>

        {project.cadUrl && (
          <div className="cad-section">
            <ModelViewer src={project.cadUrl} />
          </div>
        )}

        <Link to="/#projects" className="simple-back">
          ← Back to projects
        </Link>
      </section>
    </main>
  )
}
