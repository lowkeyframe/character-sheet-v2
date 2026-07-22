import { useState } from 'react'
import skillsData from '../../data/skills.json'
import ProjectForm from './ProjectForm'
import EndorseButton from './EndorseButton'

export default function ProjectModal({
  project,
  isOwner,
  canEndorseAs,
  endorsementCount,
  endorsed,
  pinnedCount,
  onClose,
  onSave,
  onDelete,
  onTogglePin,
  onEndorse,
  onRemoveEndorsement,
}) {
  const [editing, setEditing] = useState(!project)
  const isNew = !project

  const handleSave = async (data) => {
    await onSave(data, project?.id)
    if (!isNew) setEditing(false)
    else onClose()
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer ce projet définitivement ?')) return
    await onDelete(project.id)
    onClose()
  }

  const handleTogglePin = async () => {
    const nextPinned = !project.pinned
    if (nextPinned && pinnedCount >= 3) {
      alert('Vous ne pouvez pas épingler plus de 3 projets.')
      return
    }
    await onTogglePin(project.id, nextPinned, project.pin_order || 1)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>×</button>

        {editing ? (
          <ProjectForm
            project={project}
            onSave={handleSave}
            onCancel={() => (isNew ? onClose() : setEditing(false))}
          />
        ) : (
          <div className="project-detail">
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

            <p className="endorsement-count">{endorsementCount} endossement{endorsementCount !== 1 ? 's' : ''}</p>

            {isOwner ? (
              <div className="project-owner-actions">
                <button type="button" onClick={() => setEditing(true)}>Éditer</button>
                <button type="button" onClick={handleTogglePin}>
                  {project.pinned ? 'Retirer des épinglés' : 'Épingler'}
                </button>
                <button type="button" className="btn-danger" onClick={handleDelete}>Supprimer</button>
              </div>
            ) : (
              <EndorseButton
                project={project}
                isOwnProject={false}
                canEndorseAs={canEndorseAs}
                endorsed={endorsed}
                onEndorse={onEndorse}
                onRemove={onRemoveEndorsement}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
