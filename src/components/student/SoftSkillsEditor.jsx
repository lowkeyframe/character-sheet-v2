import { useState } from 'react'
import softSkillsData from '../../data/softSkills.json'

const CATEGORY_LABELS = {
  collaboration: 'Collaboration',
  organisation: 'Autonomie & organisation',
  creativite: 'Créativité & résolution de problèmes',
  professionnalisme: 'Professionnalisme',
  communication: 'Communication & présentation',
}

const MAX_SOFT_SKILLS = 10

export default function SoftSkillsEditor({ softSkills, isOwner, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [items, setItems] = useState(softSkills || [])
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const startEdit = () => {
    setItems(softSkills || [])
    setEditing(true)
  }

  const toggleItem = (value) => {
    setItems(prev => {
      if (prev.includes(value)) return prev.filter(i => i !== value)
      if (prev.length >= MAX_SOFT_SKILLS) return prev
      return [...prev, value]
    })
  }

  const handleSave = () => {
    setSaving(true)
    onUpdate({ softSkills: items })
    setSaving(false)
    setEditing(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <section className="soft-skills-panel">
      <h3>Savoir-être</h3>
      {!editing ? (
        <>
          {(softSkills || []).length === 0 ? (
            <p className="empty-msg">Aucun savoir-être ajouté.</p>
          ) : (
            <ul className="scroll-list">
              {(softSkills || []).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {isOwner && (
            <button type="button" className="btn-edit" onClick={startEdit}>Modifier</button>
          )}
          {justSaved && <p className="export-success-msg">✅ Savoir-être mis à jour</p>}
        </>
      ) : (
        <>
          <p className="form-hint">{items.length}/{MAX_SOFT_SKILLS} sélectionné{items.length !== 1 ? 's' : ''}</p>
          <div className="soft-skills-picker">
            {Object.entries(softSkillsData).map(([category, list]) => (
              <fieldset key={category} className="skill-checkboxes">
                <legend>{CATEGORY_LABELS[category] || category}</legend>
                {list.map(item => {
                  const checked = items.includes(item)
                  const disabled = !checked && items.length >= MAX_SOFT_SKILLS
                  return (
                    <label key={item} className={`skill-checkbox ${disabled ? 'disabled' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleItem(item)}
                      />
                      {item}
                    </label>
                  )
                })}
              </fieldset>
            ))}
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
