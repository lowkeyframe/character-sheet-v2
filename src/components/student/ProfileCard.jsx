import { useState } from 'react'
import { readFileAsDataUrl } from '../../utils/readFileAsDataUrl'

export default function ProfileCard({ profile, isOwner, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [alias, setAlias] = useState(profile.alias || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [interests, setInterests] = useState(profile.interests || [])
  const [newInterest, setNewInterest] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const startEdit = () => {
    setAlias(profile.alias || '')
    setBio(profile.bio || '')
    setInterests(profile.interests || [])
    setEditing(true)
  }

  const addInterest = () => {
    const tag = newInterest.trim()
    if (!tag || interests.includes(tag)) return
    setInterests([...interests, tag])
    setNewInterest('')
  }

  const removeInterest = (tag) => {
    setInterests(interests.filter(i => i !== tag))
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const avatarDataUrl = await readFileAsDataUrl(file)
      onUpdate({ avatarDataUrl })
    } catch (err) {
      alert(`Échec de la lecture de l'image : ${err.message}`)
    }
    setUploading(false)
  }

  const handleSave = () => {
    setSaving(true)
    onUpdate({ alias, bio, interests })
    setSaving(false)
    setEditing(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <div className="profile-card">
      <div className="profile-avatar-wrapper">
        {profile.avatarDataUrl ? (
          <img className="profile-avatar" src={profile.avatarDataUrl} alt={profile.alias} />
        ) : (
          <div className="profile-avatar profile-avatar-placeholder">{(profile.alias || '?')[0]}</div>
        )}
        {isOwner && (
          <label className="avatar-upload-label">
            {uploading ? '…' : '✏️'}
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} disabled={uploading} />
          </label>
        )}
      </div>

      {!editing ? (
        <div className="profile-info">
          <h2>{profile.alias || 'Étudiant'}</h2>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="tag-list">
            {(profile.interests || []).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          {isOwner && (
            <button type="button" className="btn-edit" onClick={startEdit}>Modifier le profil</button>
          )}
          {justSaved && <p className="export-success-msg">✅ Profil mis à jour</p>}
        </div>
      ) : (
        <div className="profile-edit-form">
          <label>
            Alias
            <input value={alias} onChange={(e) => setAlias(e.target.value)} maxLength={40} />
          </label>
          <label>
            Bio
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} rows={3} />
          </label>
          <label>Intérêts</label>
          <div className="tag-list editable">
            {interests.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button type="button" onClick={() => removeInterest(tag)}>×</button>
              </span>
            ))}
          </div>
          <div className="tag-input-row">
            <input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest() } }}
              placeholder="Ajouter un intérêt"
            />
            <button type="button" onClick={addInterest}>+</button>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setEditing(false)}>Annuler</button>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
