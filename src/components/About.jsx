import { Reveal, SectionHead } from './ui'
import { about, skills } from '../data/portfolio'

export default function About() {
  return (
    <section
      className="section"
      id="about"
      style={about.bgImage ? { '--about-bg': `url(${about.bgImage})` } : undefined}
    >
      <div className="wrap">
        <SectionHead index="01" title={about.title} lead={about.lead} />

        <Reveal className="about-grid">
          <div className="prose">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="skill-groups">
            {Object.entries(skills).map(([group, items]) => (
              <div className="skill-group" key={group}>
                <h3>{group}</h3>
                <ul className="skill-list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
