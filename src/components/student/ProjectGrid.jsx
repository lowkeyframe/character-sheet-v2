import { useState } from 'react'
import ProjectModal from './ProjectModal'

function ProjectCard({ project, onClick }) {
  return (
    <button type="button" className="project-card" onClick={onClick}>
      {project.thumbnailDataUrl ? (
        <img className="project-thumbnail" src={project.thumbnailDataUrl} alt="" />
      ) : (
        <div className="project-thumbnail-placeholder" aria-hidden="true">🖼️</div>
      )}
      <h4>{project.name}</h4>
      {project.course && <p className="project-meta">{project.course}</p>}
      <div className="project-skill-count">{(project.skills || []).length} compétence(s)</div>
    </button>
  )
}

export default function ProjectGrid({
  projects,
  isOwner,
  endorsementsFor,
  githubInfo,
  pinnedCount,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onTogglePin,
  onAddEndorsement,
}) {
  const [selected, setSelected] = useState(null) // project | 'new' | null
  const [expanded, setExpanded] = useState(false)

  const pinned = projects.filter(p => p.pinned).sort((a, b) => (a.pinOrder || 1) - (b.pinOrder || 1))
  const rest = projects.filter(p => !p.pinned)

  const closeModal = () => setSelected(null)

  const handleSave = (data, projectId) => {
    if (projectId) onUpdateProject(projectId, data)
    else onAddProject(data)
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
          endorsements={activeProject ? endorsementsFor(activeProject.id) : []}
          githubInfo={githubInfo}
          pinnedCount={pinnedCount}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={onDeleteProject}
          onTogglePin={onTogglePin}
          onAddEndorsement={onAddEndorsement}
        />
      )}
    </section>
  )
}
