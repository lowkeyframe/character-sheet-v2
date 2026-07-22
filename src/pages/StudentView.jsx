import { useEffect, useMemo, useState } from 'react'
import { useCharacterData } from '../hooks/useCharacterData'
import { computeSkillScores, calculateGlobalScore } from '../utils/scoreCalculator'
import { resolveGlobalTitle } from '../utils/titleResolver'
import { applyTheme } from '../utils/themeManager'
import config from '../data/config.json'

import ProfileCard from '../components/student/ProfileCard'
import SoftSkillsEditor from '../components/student/SoftSkillsEditor'
import ProjectGrid from '../components/student/ProjectGrid'
import SkillPanel from '../components/student/SkillPanel'
import RadarChart from '../components/student/RadarChart'
import BadgeWall from '../components/student/BadgeWall'
import LevelBar from '../components/student/LevelBar'
import ThemeSwitcher from '../components/student/ThemeSwitcher'

export default function StudentView() {
  const {
    data,
    dirty,
    updateProfile,
    updateGithub,
    addProject,
    updateProject,
    deleteProject,
    togglePin,
    addEndorsement,
    addBadge,
    removeBadge,
    exportData,
    pinnedCount,
  } = useCharacterData()

  const [editMode, setEditMode] = useState(false)
  const [exportMessage, setExportMessage] = useState(null)
  const [githubPanelOpen, setGithubPanelOpen] = useState(!data.github.owner || !data.github.repo)

  const theme = data.profile.theme
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!dirty) return undefined
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const skillScores = useMemo(() => computeSkillScores(data.projects, data.endorsements), [data.projects, data.endorsements])
  const globalScore = useMemo(() => calculateGlobalScore(skillScores, data.badges), [skillScores, data.badges])
  const globalTitle = useMemo(() => resolveGlobalTitle(globalScore, config), [globalScore])

  const endorsementsFor = (projectId) => data.endorsements.filter(e => e.projectId === projectId)

  const handleThemeChange = (newTheme) => {
    applyTheme(newTheme)
    updateProfile({ theme: newTheme })
  }

  const handleExport = async () => {
    const mode = await exportData()
    setExportMessage(mode)
  }

  const githubConfigured = Boolean(data.github.owner && data.github.repo)

  return (
    <div className="student-view">
      <header className="student-toolbar">
        <ThemeSwitcher currentTheme={theme} onChange={handleThemeChange} />

        <button
          type="button"
          className={`edit-mode-toggle ${editMode ? 'active' : ''}`}
          onClick={() => setEditMode(e => !e)}
        >
          ✎ {editMode ? "Terminer l'édition" : 'Modifier ma fiche'}
        </button>

        {editMode && (
          <span className="toolbar-export-group">
            {dirty && <span className="unsaved-indicator">● Changements non exportés</span>}
            <button type="button" className="btn-primary" onClick={handleExport}>
              Exporter mes données (me.json)
            </button>
          </span>
        )}
      </header>

      <p className="view-only-hint">
        Cette fiche peut être modifiée par n'importe qui, mais seul·e le/la propriétaire du fork peut publier les
        changements (export puis commit + push).
      </p>

      {editMode && (
        <div className="edit-mode-panel">
          <p className="edit-mode-hint">
            Mode édition : les changements ne sont visibles que dans ce navigateur. Cliquez sur « Exporter mes données ».
            {' '}En local (<code>npm run dev</code>), le fichier <code>src/data/me.json</code> est mis à jour
            directement ; il ne reste qu'à committer et pousser. Sur un site déjà publié, un fichier est téléchargé à
            remplacer manuellement.
          </p>
          {exportMessage === 'file' && (
            <p className="export-success-msg">
              ✅ <code>src/data/me.json</code> a été mis à jour sur le disque. Il ne reste qu'à committer et pousser.
            </p>
          )}
          {exportMessage === 'download' && (
            <p className="export-success-msg">
              📥 Fichier téléchargé. Remplacez <code>src/data/me.json</code> dans votre fork, puis committez et poussez.
            </p>
          )}

          {githubConfigured && !githubPanelOpen ? (
            <p className="github-info-summary">
              GitHub : <strong>{data.github.owner}/{data.github.repo}</strong>
              {' '}
              <button type="button" className="btn-edit" onClick={() => setGithubPanelOpen(true)}>Modifier</button>
            </p>
          ) : (
            <div className="github-info-form">
              <label>
                Propriétaire GitHub (votre nom d'utilisateur)
                <input
                  value={data.github.owner}
                  onChange={(e) => updateGithub({ owner: e.target.value.trim() })}
                  placeholder="ex : jdupont"
                />
              </label>
              <label>
                Nom du dépôt (fork)
                <input
                  value={data.github.repo}
                  onChange={(e) => updateGithub({ repo: e.target.value.trim() })}
                  placeholder="character-sheet-v2"
                />
              </label>
              <p className="form-hint">Utilisé pour générer les liens d'appui GitHub sur vos projets.</p>
              {githubConfigured && (
                <button type="button" onClick={() => setGithubPanelOpen(false)}>Replier</button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="student-view-grid">
        <div className="student-view-col">
          <ProfileCard profile={data.profile} isOwner={editMode} onUpdate={updateProfile} />
          <SoftSkillsEditor softSkills={data.profile.softSkills} isOwner={editMode} onUpdate={updateProfile} />
          <BadgeWall
            badges={data.badges}
            isOwner={editMode}
            githubInfo={data.github}
            onAddBadge={addBadge}
            onRemoveBadge={removeBadge}
          />
        </div>

        <div className="student-view-col">
          <LevelBar score={globalScore} title={globalTitle} />

          <ProjectGrid
            projects={data.projects}
            isOwner={editMode}
            endorsementsFor={endorsementsFor}
            githubInfo={data.github}
            pinnedCount={pinnedCount}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
            onTogglePin={togglePin}
            onAddEndorsement={addEndorsement}
          />

          <section className="skills-section">
            <h3>Compétences</h3>
            <SkillPanel skillScores={skillScores} />
            <RadarChart skillScores={skillScores} theme={theme} />
          </section>
        </div>
      </div>
    </div>
  )
}
