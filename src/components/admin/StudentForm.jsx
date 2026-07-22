import { useState } from 'react'
import CodeGenerator from './CodeGenerator'

export default function StudentForm({ onCreate }) {
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [alias, setAlias] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim() || !password.trim()) return
    setSaving(true)
    setMessage(null)
    try {
      await onCreate({
        code: code.trim(),
        password: password.trim(),
        alias: alias.trim() || 'Étudiant',
        bio: bio.trim(),
        interests: [],
        softSkills: [],
        avatarUrl: '',
      })
      setMessage({ type: 'success', text: `Étudiant ${code} créé.` })
      setCode('')
      setPassword('')
      setAlias('')
      setBio('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
    setSaving(false)
  }

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h4>Ajouter un étudiant</h4>
      <div className="form-row">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code étudiant" required />
        <CodeGenerator onGenerate={setCode} />
      </div>
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
      <input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Alias" />
      <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio (optionnel)" />
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Création…' : 'Créer'}
      </button>
      {message && (
        <p className={message.type === 'error' ? 'error-msg' : 'success-msg'}>{message.text}</p>
      )}
    </form>
  )
}
