import { useState } from 'react'
import skillsData from '../../data/skills.json'
import ProjectForm from './ProjectForm'
import EndorseButton from './EndorseButton'
import Modal from '../common/Modal'
import ConfirmDialog from '../common/ConfirmDialog'

function AddEndorsementForm({ projectId, onAdd }) {
  const [from, setFrom] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!from.trim()) return
    onAdd({ projectId, from: from.trim(), proofUrl: proofUrl.trim(), note: note.trim() })
    setFrom('')
    setProofUrl('')
    setNote('')
  }

  return (
    <form className="endorsement-add-form" onSubmit={handleSubmit}>
      <p className="form-hint">Une fois la conversation GitHub (issue/PR) conclue, consignez l'appui ici.</p>
      <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Alias du pair" required />
      <input value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} placeholder="Lien de la discussion GitHub" />
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optionnel)" />
      <button type="submit">Ajouter l'appui</button>
    </form>
  )
}

export default function ProjectModal({
  project,
  isOwner,
  endorsements,
  githubInfo,
  pinnedCount,
  onClose,
  onSave,
  onDelete,
  onTogglePin,
  onAddEndorsement,
}) {
  const [editing, setEditing] = useState(!project)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const isNew = !project

  const handleSave = (data) => {
    onSave(data, project?.id)
    if (!isNew) setEditing(false)
    else onClose()
  }

  const handleDelete = () => {
    onDelete(project.id)
    onClose()
  }

  const handleTogglePin = () => {
    const nextPinned = !project.pinned
    if (nextPinned && pinnedCount >= 3) {
      alert('Vous ne pouvez pas épingler plus de 3 projets.')
      return
    }
    onTogglePin(project.id, nextPinned, project.pinOrder || 1)
  }

  if (confirmingDelete) {
    return (
      <ConfirmDialog
        title="Supprimer ce projet ?"
        message={`« ${project.name} » sera définitivement supprimé de votre fiche.`}
        confirmLabel="Supprimer"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    )
  }

  return (
    <Modal onClose={onClose}>
      {editing ? (
        <ProjectForm
          project={project}
          onSave={handleSave}
          onCancel={() => (isNew ? onClose() : setEditing(false))}
        />
      ) : (
        <div className="project-detail">
          {project.thumbnailDataUrl && (
            <img className="project-thumbnail-detail" src={project.thumbnailDataUrl} alt="" />
          )}
          <h3>{project.name}</h3>
          {project.course && <p className="project-meta">{project.course} {project.semester && `· ${project.semester}`}</p>}
          {project.description && <p className="project-description">{project.description}</p>}

          <div className="project-skill-tags">
            {(project.skills || []).map(id => (
              <span key={id} className="tag">
                {skillsData[id]?.icon} {skillsData[id]?.label || id}
              </span>
            ))}
          </div>

          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
              Voir le projet ↗
            </a>
          )}

          <p className="endorsement-count">{endorsements.length} appui{endorsements.length !== 1 ? 's' : ''}</p>
          {endorsements.length > 0 && (
            <ul className="endorsement-list">
              {endorsements.map((e, i) => (
                <li key={`${e.from}-${i}`}>
                  {e.from}
                  {e.proofUrl && (
                    <>
                      {' '}
                      <a href={e.proofUrl} target="_blank" rel="noreferrer">↗</a>
                    </>
                  )}
                  {e.note && ` — ${e.note}`}
                </li>
              ))}
            </ul>
          )}

          {isOwner ? (
            <div className="project-owner-actions">
              <button type="button" onClick={() => setEditing(true)}>Éditer</button>
              <button type="button" onClick={handleTogglePin}>
                {project.pinned ? 'Retirer des épinglés' : 'Épingler'}
              </button>
              <button type="button" className="btn-danger" onClick={() => setConfirmingDelete(true)}>Supprimer</button>
              <AddEndorsementForm projectId={project.id} onAdd={onAddEndorsement} />
            </div>
          ) : (
            <EndorseButton project={project} githubInfo={githubInfo} />
          )}
        </div>
      )}
    </Modal>
  )
}
