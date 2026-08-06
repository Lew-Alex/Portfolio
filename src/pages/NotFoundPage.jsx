import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main>
      <section className="section detail-page">
        <h1>Page not found</h1>
        <p className="detail-meta">The page you're looking for doesn't exist.</p>
        <Link to="/" className="button button-primary detail-home-link">
          Back home
        </Link>
      </section>
    </main>
  )
}
