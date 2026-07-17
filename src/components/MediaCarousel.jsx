import { useEffect, useState } from 'react'
import Icon from './Icon'

export default function MediaCarousel({ items, emptyLabel = 'Add photos or videos' }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [items])

  if (!items || items.length === 0) {
    return (
      <div className="media-empty">
        <Icon name="image" size={22} />
        <span>{emptyLabel}</span>
      </div>
    )
  }

  const item = items[index]
  const go = (delta) => {
    setIndex((i) => (i + delta + items.length) % items.length)
  }

  return (
    <div className="media-carousel">
      <div className="media-carousel-frame">
        {item.type === 'video' ? (
          <video src={item.src} controls />
        ) : (
          <img src={item.src} alt={item.caption || ''} />
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-nav carousel-prev"
              onClick={() => go(-1)}
              aria-label="Previous photo or video"
            >
              <Icon name="chevronLeft" size={18} />
            </button>
            <button
              type="button"
              className="carousel-nav carousel-next"
              onClick={() => go(1)}
              aria-label="Next photo or video"
            >
              <Icon name="chevronRight" size={18} />
            </button>
          </>
        )}
      </div>

      <div className="media-carousel-meta">
        <span className="media-carousel-caption">{item.caption || ''}</span>
        {items.length > 1 && (
          <span className="media-carousel-count">
            {index + 1} / {items.length}
          </span>
        )}
      </div>
    </div>
  )
}
