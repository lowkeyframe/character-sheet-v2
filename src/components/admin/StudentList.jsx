import { useMemo, useState } from 'react'
import { countUnlockedBadges } from '../../utils/scoreCalculator'

export default function StudentList({ students, selectedCode, onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return students
    return students.filter(s =>
      s.code.toLowerCase().includes(term) ||
      (s.profile?.alias || '').toLowerCase().includes(term)
    )
  }, [students, search])

  return (
    <div className="student-list">
      <input
        className="student-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un étudiant…"
      />
      <ul>
        {filtered.map(student => (
          <li
            key={student.code}
            className={student.code === selectedCode ? 'selected' : ''}
            onClick={() => onSelect(student.code)}
          >
            <span className="student-alias">{student.profile?.alias || student.code}</span>
            <span className="student-code">{student.code}</span>
            <span className="student-badge-count">{countUnlockedBadges(student.badges)} 🏅</span>
          </li>
        ))}
        {filtered.length === 0 && <li className="empty-msg">Aucun étudiant trouvé.</li>}
      </ul>
    </div>
  )
}
