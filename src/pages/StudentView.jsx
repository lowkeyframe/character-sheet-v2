import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useStudent } from '../hooks/useStudent'
import { useProjects } from '../hooks/useProjects'
import { useEndorsements } from '../hooks/useEndorsements'
import { computeSkillScores, calculateGlobalScore } from '../utils/scoreCalculator'
import { resolveGlobalTitle } from '../utils/titleResolver'
import { applyTheme, DEFAULT_THEME } from '../utils/themeManager'
import config from '../data/config.json'

import CodeEntry from '../components/student/CodeEntry'
import ProfileCard from '../components/student/ProfileCard'
import SoftSkillsEditor from '../components/student/SoftSkillsEditor'
import ProjectGrid from '../components/student/ProjectGrid'
import SkillPanel from '../components/student/SkillPanel'
import RadarChart from '../components/student/RadarChart'
import BadgeWall from '../components/student/BadgeWall'
import LevelBar from '../components/student/LevelBar'
import ThemeSwitcher from '../components/student/ThemeSwitcher'

export default function StudentView() {
  const auth = useAuth()
  const { activeCode, isOwner, canEndorseAs, session, visitedCode } = auth

  const { student, error: studentError, updateProfile } = useStudent(activeCode)
  const { projects, addProject, updateProject, deleteProject, togglePin, pinnedCount } = useProjects(activeCode)
  const { endorsements, addEndorsement, removeEndorsement, hasEndorsed } = useEndorsements(activeCode)

  const [peerCode, setPeerCode] = useState('')

  const theme = student?.profile?.theme || DEFAULT_THEME
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const skillScores = useMemo(() => computeSkillScores(projects, endorsements), [projects, endorsements])
  const globalScore = useMemo(() => calculateGlobalScore(skillScores, student?.badges), [skillScores, student?.badges])
  const globalTitle = useMemo(() => resolveGlobalTitle(globalScore, config), [globalScore])

  const credentials = session

  const endorsementCountFor = (projectId) => endorsements.filter(e => e.project_id === projectId).length

  const handleUpdateProfile = async (updates) => {
    if (!isOwner || !credentials) return false
    return updateProfile(credentials, updates)
  }

  const handleThemeChange = (newTheme) => {
    applyTheme(newTheme)
    if (isOwner && credentials) {
      updateProfile(credentials, { theme: newTheme })
    }
  }

  const handleVisitPeer = (e) => {
    e.preventDefault()
    const code = peerCode.trim()
    if (!code) return
    auth.visitPeer(code)
    setPeerCode('')
  }

  if (!activeCode) {
    return <CodeEntry onConsult={auth.visitPeer} onLogin={auth.loginStudent} error={auth.error} />
  }

  if (studentError || (!student && activeCode)) {
    return (
      <div className="code-entry">
        <p className="error-msg">Étudiant introuvable.</p>
        <button type="button" onClick={auth.logout}>Retour</button>
      </div>
    )
  }

  if (!student) return <p className="loading-msg">Chargement…</p>

  return (
    <div className="student-view">
      <header className="student-toolbar">
        {visitedCode && (
          <div className="visitor-banner">
            Mode visiteur : {student.profile.alias || student.code}
            <button
              type="button"
              onClick={session ? auth.exitVisit : auth.logout}
            >
              {session ? 'Retour à ma fiche' : 'Quitter'}
            </button>
          </div>
        )}

        {session && !visitedCode && (
          <form className="peer-visit-form" onSubmit={handleVisitPeer}>
            <input
              value={peerCode}
              onChange={(e) => setPeerCode(e.target.value)}
              placeholder="Visiter un pair (code)"
            />
            <button type="submit">Visiter</button>
          </form>
        )}

        <ThemeSwitcher currentTheme={theme} onChange={handleThemeChange} />

        {session && (
          <button type="button" className="btn-logout" onClick={auth.logout}>Se déconnecter</button>
        )}
      </header>

      <ProfileCard
        profile={student.profile}
        isOwner={isOwner}
        studentCode={student.code}
        onUpdate={handleUpdateProfile}
      />

      <LevelBar score={globalScore} title={globalTitle} />

      <SoftSkillsEditor
        softSkills={student.profile.softSkills}
        isOwner={isOwner}
        onUpdate={handleUpdateProfile}
      />

      <ProjectGrid
        projects={projects}
        isOwner={isOwner}
        canEndorseAs={canEndorseAs}
        endorsementCountFor={endorsementCountFor}
        hasEndorsed={hasEndorsed}
        pinnedCount={pinnedCount}
        onAddProject={(data) => addProject(credentials, data)}
        onUpdateProject={(id, data) => updateProject(credentials, id, data)}
        onDeleteProject={(id) => deleteProject(credentials, id)}
        onTogglePin={(id, pinned, order) => togglePin(credentials, id, pinned, order)}
        onEndorse={(projectId) => addEndorsement(credentials, projectId)}
        onRemoveEndorsement={(projectId) => removeEndorsement(credentials, projectId)}
      />

      <section className="skills-section">
        <h3>Compétences</h3>
        <SkillPanel skillScores={skillScores} />
        <RadarChart skillScores={skillScores} theme={theme} />
      </section>

      <BadgeWall badges={student.badges} />
    </div>
  )
}
