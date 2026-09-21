import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <article className="detail">
      <div className="wrap">
        <p className="eyebrow detail-eyebrow">
          <span className="num">404</span>
          <span className="sep" aria-hidden="true" />
          <span>Not found</span>
        </p>

        <h1 className="detail-title">This page doesn&apos;t exist</h1>
        <p className="detail-lead">
          The link may be out of date, or the project may have been renamed.
        </p>

        <div className="detail-actions">
          <Link className="btn btn-primary" to="/">
            Back home
          </Link>
          <Link className="btn" to="/#projects">
            See projects
          </Link>
        </div>
      </div>
    </article>
  )
}
