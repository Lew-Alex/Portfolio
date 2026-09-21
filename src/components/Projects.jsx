import { Link } from 'react-router'
import Icon from './Icon'
import { Reveal, SectionHead } from './ui'
import { projects } from '../data/portfolio'

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <SectionHead
          index="03"
          title="Projects"
          lead="Robots, mechanisms and control systems I designed, built and debugged."
        />

        <div className="project-index">
          {projects.map((project, i) => (
            <Reveal key={project.slug}>
              <Link className="project-row" to={`/projects/${project.slug}`}>
                <span className="eyebrow project-row-num num">{String(i + 1).padStart(2, '0')}</span>

                <div className="project-row-thumb">
                  {project.image && <img src={project.image} alt="" loading="lazy" decoding="async" />}
                </div>

                <div className="project-row-body">
                  <div className="project-row-top">
                    <h3 className="project-row-title">{project.title}</h3>
                    {project.year && <span className="eyebrow num">{project.year}</span>}
                  </div>

                  <p className="project-row-desc">{project.description}</p>

                  {project.tags?.length > 0 && (
                    <div className="tag-row">
                      {project.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="project-row-arrow" aria-hidden="true">
                  <Icon name="chevronRight" size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
