import badgesData from '../../data/badges.json'

const CATEGORY_LABELS = {
  niveau: 'Niveau',
  tutorat: 'Tutorat',
  general: 'Général',
}

export default function BadgeWall({ badges }) {
  const unlockedIds = new Set(
    Object.entries(badges || {})
      .filter(([, b]) => b && b.unlocked)
      .map(([id]) => id)
  )

  return (
    <div className="badge-wall">
      {Object.entries(badgesData).map(([category, list]) => (
        <div key={category} className="badge-category">
          <h4>{CATEGORY_LABELS[category] || category}</h4>
          <div className="badge-grid">
            {list.map(badge => {
              const unlocked = unlockedIds.has(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`badge-item ${unlocked ? 'unlocked' : 'locked'}`}
                  title={badge.description}
                >
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
