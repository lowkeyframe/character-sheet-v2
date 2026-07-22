import { useState } from 'react'
import StudentView from './pages/StudentView'
import AdminView from './pages/AdminView'

export default function App() {
  const [view, setView] = useState('student') // 'student' | 'admin'

  return (
    <>
      <nav className="app-nav">
        <button
          type="button"
          className={view === 'student' ? 'active' : ''}
          onClick={() => setView('student')}
        >
          Fiche étudiant
        </button>
        <button
          type="button"
          className={view === 'admin' ? 'active' : ''}
          onClick={() => setView('admin')}
        >
          Admin
        </button>
      </nav>

      {view === 'student' ? <StudentView /> : <AdminView />}
    </>
  )
}
