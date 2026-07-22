import { useState } from 'react'
import badgesData from '../../data/badges.json'
import BadgeModal from './BadgeModal'

const CATEGORY_LABELS = {
  niveau: 'Niveau',
  tutorat: 'Tutorat',
  general: 'Général',
}

export default function BadgeWall({ badges, isOwner, githubInfo, onAddBadge, onRemoveBadge }) {
  const [selected, setSelected] = useState(null)
  const safeBadges = badges || {}

  return (
    <div className="badge-wall">
      {Object.entries(badgesData).map(([category, list]) => (
        <div key={category} className="badge-category">
          <h4>{CATEGORY_LABELS[category] || category}</h4>
          <div className="badge-grid">
            {list.map(badge => {
              const unlocked = Boolean(safeBadges[badge.id]?.unlocked)
              return (
                <button
                  key={badge.id}
                  type="button"
                  className={`badge-item ${unlocked ? 'unlocked' : 'locked'} ${isOwner ? 'clickable' : ''}`}
                  title={badge.description}
                  disabled={!isOwner}
                  onClick={() => setSelected(badge)}
                >
                  <div className="badge-pastille">
                    <span className="badge-icon">{badge.icon}</span>
                  </div>
                  <span className="badge-name">{badge.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {selected && (
        <BadgeModal
          badge={selected}
          granted={safeBadges[selected.id]}
          githubInfo={githubInfo}
          onClose={() => setSelected(null)}
          onAdd={onAddBadge}
          onRemove={onRemoveBadge}
        />
      )}
    </div>
  )
}
