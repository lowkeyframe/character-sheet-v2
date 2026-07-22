import { useMemo, useState } from 'react'
import skillsData from '../../data/skills.json'

const ALL_COURSES = [...new Set(Object.values(skillsData).flatMap(s => s.courses))].sort()
const SKILL_LIST = Object.values(skillsData)

export default function ProjectForm({ project, onSave, onCancel }) {
  const isEdit = Boolean(project)
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [course, setCourse] = useState(project?.course || '')
  const [customCourse, setCustomCourse] = useState(
    project && !ALL_COURSES.includes(project.course) ? project.course : ''
  )
  const [semester, setSemester] = useState(project?.semester || '')
  const [link, setLink] = useState(project?.link || '')
  const [skills, setSkills] = useState(project?.skills || [])
  const [saving, setSaving] = useState(false)

  const usingCustomCourse = useMemo(() => course === '__autre__', [course])

  const toggleSkill = (skillId) => {
    setSkills(prev => prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || skills.length === 0) return
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        course: usingCustomCourse ? customCourse.trim() : course,
        semester: semester.trim(),
        skills,
        link: link.trim(),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Modifier le projet' : 'Ajouter un projet'}</h3>

      <label>
        Nom du projet
        <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
      </label>

      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={600} />
      </label>

      <label>
        Cours
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">— Choisir —</option>
          {ALL_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
          <option value="__autre__">Autre…</option>
        </select>
      </label>
      {usingCustomCourse && (
        <input
          className="custom-course-input"
          value={customCourse}
          onChange={(e) => setCustomCourse(e.target.value)}
          placeholder="Nom du cours"
        />
      )}

      <label>
        Session
        <input value={semester} onChange={(e) => setSemester(e.target.value)} placeholder="Ex : Automne 2025" />
      </label>

      <label>
        Lien (portfolio, dépôt, vidéo…)
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
      </label>

      <fieldset className="skill-checkboxes">
        <legend>Compétences liées</legend>
        {SKILL_LIST.map(skill => (
          <label key={skill.id} className="skill-checkbox">
            <input
              type="checkbox"
              checked={skills.includes(skill.id)}
              onChange={() => toggleSkill(skill.id)}
            />
            {skill.icon} {skill.label}
          </label>
        ))}
      </fieldset>
      {skills.length === 0 && <p className="form-hint">Sélectionnez au moins une compétence.</p>}

      <div className="form-actions">
        <button type="button" onClick={onCancel}>Annuler</button>
        <button type="submit" className="btn-primary" disabled={saving || skills.length === 0}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
