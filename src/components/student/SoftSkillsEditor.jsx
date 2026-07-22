import { useState } from 'react'

export default function SoftSkillsEditor({ softSkills, isOwner, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [items, setItems] = useState(softSkills || [])
  const [newItem, setNewItem] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    setItems(softSkills || [])
    setEditing(true)
  }

  const addItem = () => {
    const value = newItem.trim()
    if (!value || items.includes(value)) return
    setItems([...items, value])
    setNewItem('')
  }

  const removeItem = (value) => {
    setItems(items.filter(i => i !== value))
  }

  const handleSave = async () => {
    setSaving(true)
    const ok = await onUpdate({ softSkills: items })
    setSaving(false)
    if (ok) setEditing(false)
  }

  return (
    <section className="soft-skills-panel">
      <h3>Savoir-être</h3>
      {!editing ? (
        <>
          <div className="tag-list">
            {(softSkills || []).length === 0 && <p className="empty-msg">Aucun savoir-être ajouté.</p>}
            {(softSkills || []).map(item => (
              <span key={item} className="tag">{item}</span>
            ))}
          </div>
          {isOwner && (
            <button type="button" className="btn-edit" onClick={startEdit}>Modifier</button>
          )}
        </>
      ) : (
        <>
          <div className="tag-list editable">
            {items.map(item => (
              <span key={item} className="tag">
                {item}
                <button type="button" onClick={() => removeItem(item)}>×</button>
              </span>
            ))}
          </div>
          <div className="tag-input-row">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
              placeholder="Ex : Travail en équipe"
            />
            <button type="button" onClick={addItem}>+</button>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setEditing(false)}>Annuler</button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}
