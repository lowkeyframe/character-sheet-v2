import { useState } from 'react'
import ProjectModal from './ProjectModal'

function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={onClick}>
      <h4>{project.name}</h4>
      {project.course && <p className="project-meta">{project.course}</p>}
      <div className="project-skill-count">{(project.skills || []).length} compétence(s)</div>
    </div>
  )
}

export default function ProjectGrid({
  projects,
  isOwner,
  canEndorseAs,
  endorsementCountFor,
  hasEndorsed,
  pinnedCount,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onTogglePin,
  onEndorse,
  onRemoveEndorsement,
}) {
  const [selected, setSelected] = useState(null) // project | 'new' | null
  const [expanded, setExpanded] = useState(false)

  const pinned = projects.filter(p => p.pinned).sort((a, b) => (a.pin_order || 1) - (b.pin_order || 1))
  const rest = projects.filter(p => !p.pinned)

  const closeModal = () => setSelected(null)

  const handleSave = async (data, projectId) => {
    if (projectId) await onUpdateProject(projectId, data)
    else await onAddProject(data)
  }

  const activeProject = selected === 'new' ? null : selected

  return (
    <section className="project-grid-section">
      <div className="project-grid-header">
        <h3>Projets</h3>
        {isOwner && (
          <button type="button" className="btn-primary" onClick={() => setSelected('new')}>
            + Ajouter un projet
          </button>
        )}
      </div>

      <div className="pinned-projects">
        {pinned.length === 0 && <p className="empty-msg">Aucun projet épinglé.</p>}
        {pinned.map(project => (
          <ProjectCard key={project.id} project={project} onClick={() => setSelected(project)} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="project-accordion">
          <button type="button" className="accordion-toggle" onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Masquer les autres projets' : `Voir tous les projets (${rest.length})`}
          </button>
          {expanded && (
            <div className="project-list">
              {rest.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => setSelected(project)} />
              ))}
            </div>
          )}
        </div>
      )}

      {selected && (
        <ProjectModal
          project={activeProject}
          isOwner={isOwner}
          canEndorseAs={canEndorseAs}
          endorsementCount={activeProject ? endorsementCountFor(activeProject.id) : 0}
          endorsed={activeProject ? hasEndorsed(activeProject.id, canEndorseAs) : false}
          pinnedCount={pinnedCount}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={onDeleteProject}
          onTogglePin={onTogglePin}
          onEndorse={onEndorse}
          onRemoveEndorsement={onRemoveEndorsement}
        />
      )}
    </section>
  )
}
