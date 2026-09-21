import { useEffect } from 'react'
import { useParams } from 'react-router'
import Icon from '../components/Icon'
import ModelViewer from '../components/ModelViewer'
import { Block, Crumb, HeroBand, MetaLine, Pager, TechList } from '../components/ui'
import { projects } from '../data/portfolio'

// One line of facts under the title: category, dates, status, team, roles.
function metaItems(project) {
  const m = project.meta || {}
  return [project.category, m.timeline, m.status, m.team, ...(m.role || [])]
}

function DetailHead({ project }) {
  const hasActions = Boolean(project.repoUrl || project.liveUrl || project.cadUrl)

  return (
    <header className="detail-head">
      <h1 className="detail-title">{project.title}</h1>
      {project.description && <p className="detail-lead">{project.description}</p>}

      {hasActions && (
        <div className="detail-actions">
          {project.repoUrl && (
            <a className="btn" href={project.repoUrl} target="_blank" rel="noreferrer">
              <Icon name="github" size={14} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a className="btn" href={project.liveUrl} target="_blank" rel="noreferrer">
              Live <Icon name="external" size={13} />
            </a>
          )}
          {project.cadUrl && (
            <a className="btn" href="#cad">
              3D model
            </a>
          )}
        </div>
      )}
    </header>
  )
}

function CadSection({ project }) {
  if (!project.cadUrl) return null
  return (
    <section className="cad-section" id="cad">
      <span className="eyebrow">CAD · interactive</span>
      <ModelViewer src={project.cadUrl} />
      <p className="figcaption">
        Drag to orbit. Exported from the Fusion 360 assembly, the same geometry as the printed parts.
      </p>
    </section>
  )
}

function RichProjectPage({ project, prev, next }) {
  return (
    <article className="detail">
      <div className="wrap">
        <Crumb to="/#projects" label="Projects" />
        <DetailHead project={project} />

        <MetaLine items={metaItems(project)} />
        <TechList items={project.technologies} />

        <HeroBand
          image={project.heroImage || project.image}
          alt={project.heroCaption || ''}
          caption={project.heroCaption}
          items={project.recognition}
        />

        {project.sections.map((section, i) => (
          <Block key={i} section={section} index={i} wide={i === 0} />
        ))}

        <CadSection project={project} />
        <Pager prev={prev} next={next} base="/projects" />
      </div>
    </article>
  )
}

function SimpleProjectPage({ project, prev, next }) {
  // Whatever prose a page has becomes section 01, the overview, so every project
  // and experience page opens the same way.
  const sections =
    project.details?.length || project.highlights?.length
      ? [
          {
            type: 'prose',
            title: 'Overview',
            paragraphs: project.details,
            items: project.highlights,
          },
        ]
      : []

  return (
    <article className="detail">
      <div className="wrap">
        <Crumb to="/#projects" label="Projects" />
        <DetailHead project={project} />

        <MetaLine items={metaItems(project)} />
        <TechList items={project.technologies} />

        <HeroBand
          image={project.heroImage || project.image}
          alt={project.heroCaption || ''}
          caption={project.heroCaption}
          items={project.recognition}
        />

        {sections.map((section, i) => (
          <Block key={i} section={section} index={i} wide={i === 0} />
        ))}

        <CadSection project={project} />
        <Pager prev={prev} next={next} base="/projects" />
      </div>
    </article>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = index >= 0 ? projects[index] : null

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!project) {
    return (
      <article className="detail">
        <div className="wrap">
          <h1 className="detail-title">Project not found</h1>
          <p className="detail-lead">
            That project doesn&apos;t exist, or the link may be out of date.
          </p>
          <div className="detail-actions">
            <a className="btn btn-primary" href="/#projects">
              Back to projects
            </a>
          </div>
        </div>
      </article>
    )
  }

  const prev = index > 0 ? projects[index - 1] : null
  const next = index < projects.length - 1 ? projects[index + 1] : null
  const isRich = project.sections?.length > 0

  return isRich ? (
    <RichProjectPage project={project} prev={prev} next={next} />
  ) : (
    <SimpleProjectPage project={project} prev={prev} next={next} />
  )
}
