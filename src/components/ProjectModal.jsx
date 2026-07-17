import { useEffect } from 'react'
import Icon from './Icon'
import MediaCarousel from './MediaCarousel'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={18} />
        </button>

        <div className="modal-header">
          <h3>{project.title}</h3>
          <div className="tag-row">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
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

        {(project.liveUrl || project.repoUrl) && (
          <div className="modal-links">
            {project.liveUrl && (
              <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                Live <Icon name="external" size={14} />
              </a>
            )}
            {project.repoUrl && (
              <a className="button button-secondary" href={project.repoUrl} target="_blank" rel="noreferrer">
                Code <Icon name="github" size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
