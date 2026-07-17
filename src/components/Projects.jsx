import { useState } from 'react'
import Icon from './Icon'
import ProjectModal from './ProjectModal'
import { projects } from '../data/portfolio'

export default function Projects() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Projects</h2>

      <div className="projects-grid">
        {projects.map((project) => (
          <article
            key={project.title}
            className="project-card"
            role="button"
            tabIndex={0}
            onClick={() => setSelected(project)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelected(project)
              }
            }}
          >
            <div className="project-image" aria-hidden="true">
              {project.image ? (
                <img src={project.image} alt="" />
              ) : (
                <span>{project.title.slice(0, 1)}</span>
              )}
            </div>

            <div className="project-body">
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
                View details <Icon name="expand" size={14} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
