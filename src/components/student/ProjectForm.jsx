import { useMemo, useState } from 'react'
import skillsData from '../../data/skills.json'
import { readFileAsDataUrl } from '../../utils/readFileAsDataUrl'

const ALL_COURSES = [...new Set(Object.values(skillsData).flatMap(s => s.courses))].sort()
const SKILL_LIST = Object.values(skillsData)
const SEASONS = ['Automne', 'Hiver', 'Été']
const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i)

function parseSemester(semester) {
  const parts = (semester || '').trim().split(/\s+/)
  if (parts.length === 2 && SEASONS.includes(parts[0]) && YEARS.includes(Number(parts[1]))) {
    return { season: parts[0], year: parts[1] }
  }
  return { season: '', year: '' }
}

export default function ProjectForm({ project, onSave, onCancel }) {
  const isEdit = Boolean(project)
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [course, setCourse] = useState(project?.course || '')
  const [customCourse, setCustomCourse] = useState(
    project && !ALL_COURSES.includes(project.course) ? project.course : ''
  )
  const initialSemester = useMemo(() => parseSemester(project?.semester), [project])
  const [season, setSeason] = useState(initialSemester.season)
  const [year, setYear] = useState(initialSemester.year)
  const [link, setLink] = useState(project?.link || '')
  const [skills, setSkills] = useState(project?.skills || [])
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState(project?.thumbnailDataUrl || '')
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [saving, setSaving] = useState(false)

  const usingCustomCourse = useMemo(() => course === '__autre__', [course])

  const toggleSkill = (skillId) => {
    setSkills(prev => prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId])
  }

  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingThumbnail(true)
    try {
      setThumbnailDataUrl(await readFileAsDataUrl(file))
    } catch (err) {
      alert(`Échec de la lecture de l'image : ${err.message}`)
    }
    setUploadingThumbnail(false)
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
        semester: season && year ? `${season} ${year}` : '',
        skills,
        link: link.trim(),
        thumbnailDataUrl,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? 'Modifier le projet' : 'Ajouter un projet'}</h3>

      <label>
        Vignette du projet
        <div className="thumbnail-upload-row">
          {thumbnailDataUrl && <img className="project-thumbnail-preview" src={thumbnailDataUrl} alt="" />}
          <input type="file" accept="image/*" onChange={handleThumbnailChange} disabled={uploadingThumbnail} />
          {thumbnailDataUrl && (
            <button type="button" onClick={() => setThumbnailDataUrl('')}>Retirer</button>
          )}
        </div>
      </label>

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
        <div className="session-select-row">
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="">Saison</option>
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Année</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
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
            {skill.label}
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
