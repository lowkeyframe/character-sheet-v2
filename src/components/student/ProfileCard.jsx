import { useState } from 'react'
import { uploadAvatar } from '../../services/storageService'

export default function ProfileCard({ profile, isOwner, studentCode, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [alias, setAlias] = useState(profile.alias || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [interests, setInterests] = useState(profile.interests || [])
  const [newInterest, setNewInterest] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

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
      const avatarUrl = await uploadAvatar(studentCode, file)
      await onUpdate({ avatarUrl })
    } catch (err) {
      alert(`Échec du téléversement de l'avatar : ${err.message}`)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const ok = await onUpdate({ alias, bio, interests })
    setSaving(false)
    if (ok) setEditing(false)
  }

  return (
    <div className="profile-card">
      <div className="profile-avatar-wrapper">
        {profile.avatarUrl ? (
          <img className="profile-avatar" src={profile.avatarUrl} alt={profile.alias} />
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
