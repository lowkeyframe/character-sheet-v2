import { useEffect, useState } from 'react'
import badgesData from '../../data/badges.json'

const CATEGORY_LABELS = { niveau: 'Niveau', tutorat: 'Tutorat', general: 'Général' }

export default function BadgeToggle({ studentCode, badges, adminRole, adminUsername, onSave }) {
  const [local, setLocal] = useState(badges || {})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLocal(badges || {})
  }, [studentCode, badges])

  const toggle = (badge) => {
    if (badge.grantedBy !== adminRole) return
    setLocal(prev => {
      const wasUnlocked = Boolean(prev[badge.id]?.unlocked)
      if (wasUnlocked) {
        const { [badge.id]: _removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [badge.id]: { unlocked: true, date: new Date().toISOString(), grantedBy: adminUsername },
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    const changedIds = Object.keys({ ...local, ...(badges || {}) }).filter(
      id => Boolean(local[id]?.unlocked) !== Boolean(badges?.[id]?.unlocked)
    )
    try {
      await onSave(local, changedIds)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="badge-toggle">
      {Object.entries(badgesData).map(([category, list]) => (
        <div key={category} className="badge-category">
          <h5>{CATEGORY_LABELS[category] || category}</h5>
          {list.map(badge => {
            const editable = badge.grantedBy === adminRole
            return (
              <label key={badge.id} className={`badge-toggle-row ${editable ? '' : 'disabled'}`}>
                <input
                  type="checkbox"
                  checked={Boolean(local[badge.id]?.unlocked)}
                  disabled={!editable}
                  onChange={() => toggle(badge)}
                />
                {badge.icon} {badge.name}
                {!editable && <span className="badge-role-hint">({badge.grantedBy})</span>}
              </label>
            )
          })}
        </div>
      ))}
      <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Enregistrement…' : 'Enregistrer les badges'}
      </button>
    </div>
  )
}
