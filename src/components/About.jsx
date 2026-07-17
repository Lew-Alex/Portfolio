import { about, skills } from '../data/portfolio'

export default function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title">About</h2>

      <div className="about-grid">
        <div className="about-text">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="skills-groups">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="skills-group">
              <h3>{group}</h3>
              <div className="tag-row">
                {items.map((item) => (
                  <span key={item} className="tag tag-skill">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
