import { useCallback, useEffect, useMemo, useState } from 'react'
import * as adminService from '../../services/adminService'
import * as projectService from '../../services/projectService'
import * as endorsementService from '../../services/endorsementService'
import { computeSkillScores } from '../../utils/scoreCalculator'
import skillsData from '../../data/skills.json'
import StudentList from './StudentList'
import StudentForm from './StudentForm'
import BadgeToggle from './BadgeToggle'
import AuditLog from './AuditLog'

const TABS = [
  { id: 'projects', label: 'Projets & Compétences' },
  { id: 'badges', label: 'Badges' },
  { id: 'audit', label: "Journal d'audit" },
]

function StudentProjectsPanel({ studentCode }) {
  const [projects, setProjects] = useState(null)
  const [skillScores, setSkillScores] = useState({})

  useEffect(() => {
    let cancelled = false
    setProjects(null)
    Promise.all([
      projectService.getProjects(studentCode),
      endorsementService.getEndorsementsForStudent(studentCode),
    ]).then(([proj, end]) => {
      if (cancelled) return
      setProjects(proj)
      setSkillScores(computeSkillScores(proj, end))
    })
    return () => { cancelled = true }
  }, [studentCode])

  if (!projects) return <p className="loading-msg">Chargement…</p>

  return (
    <div className="admin-student-projects">
      <h5>Compétences (calculées)</h5>
      <ul className="admin-skill-summary">
        {Object.entries(skillScores)
          .sort((a, b) => b[1] - a[1])
          .map(([id, score]) => (
            <li key={id}>{skillsData[id]?.icon} {skillsData[id]?.label || id} — {score} pts</li>
          ))}
        {Object.keys(skillScores).length === 0 && <li className="empty-msg">Aucune compétence.</li>}
      </ul>

      <h5>Projets</h5>
      <ul className="admin-project-list">
        {projects.map(p => (
          <li key={p.id}>
            <strong>{p.name}</strong> {p.course && `· ${p.course}`}
            <div className="tag-list">
              {(p.skills || []).map(id => (
                <span key={id} className="tag">{skillsData[id]?.label || id}</span>
              ))}
            </div>
          </li>
        ))}
        {projects.length === 0 && <li className="empty-msg">Aucun projet.</li>}
      </ul>
    </div>
  )
}

export default function Dashboard({ adminCredentials, adminRole, adminUsername }) {
  const [students, setStudents] = useState([])
  const [selectedCode, setSelectedCode] = useState(null)
  const [tab, setTab] = useState('projects')
  const [error, setError] = useState(null)

  const refreshStudents = useCallback(async () => {
    try {
      const data = await adminService.getAllStudents(adminCredentials)
      setStudents(data)
    } catch (err) {
      setError(err.message)
    }
  }, [adminCredentials])

  useEffect(() => { refreshStudents() }, [refreshStudents])

  const selectedStudent = useMemo(
    () => students.find(s => s.code === selectedCode) || null,
    [students, selectedCode]
  )

  const handleCreateStudent = async (studentData) => {
    await adminService.importStudents(adminCredentials, [studentData])
    await adminService.logAction(adminCredentials, {
      admin_display: adminUsername,
      action: 'Création étudiant',
      target_student: studentData.code,
      detail: studentData.alias,
    })
    await refreshStudents()
  }

  const handleSaveBadges = async (badges, changedIds) => {
    await adminService.updateStudentBadges(adminCredentials, selectedStudent.code, badges)
    await adminService.logAction(adminCredentials, {
      admin_display: adminUsername,
      action: 'Modification badges',
      target_student: selectedStudent.code,
      detail: changedIds.join(', '),
    })
    await refreshStudents()
  }

  return (
    <div className="admin-dashboard">
      {error && <p className="error-msg">{error}</p>}
      <aside className="admin-sidebar">
        <StudentForm onCreate={handleCreateStudent} />
        <StudentList students={students} selectedCode={selectedCode} onSelect={setSelectedCode} />
      </aside>

      <main className="admin-main">
        <nav className="admin-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'audit' ? (
          <AuditLog adminCredentials={adminCredentials} />
        ) : !selectedStudent ? (
          <p className="empty-msg">Sélectionnez un étudiant dans la liste.</p>
        ) : tab === 'badges' ? (
          <BadgeToggle
            studentCode={selectedStudent.code}
            badges={selectedStudent.badges}
            adminRole={adminRole}
            adminUsername={adminUsername}
            onSave={handleSaveBadges}
          />
        ) : (
          <StudentProjectsPanel studentCode={selectedStudent.code} />
        )}
      </main>
    </div>
  )
}
