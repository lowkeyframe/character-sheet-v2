import { useState } from 'react'
import * as adminService from '../services/adminService'
import Dashboard from '../components/admin/Dashboard'

export default function AdminView() {
  const [admin, setAdmin] = useState(null) // { username, password, display_name, role }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const result = await adminService.verifyAdmin(username, password)
      setAdmin({ username, password, display_name: result.display_name, role: result.role })
    } catch (err) {
      setError(err.message)
    }
    setSubmitting(false)
  }

  if (!admin) {
    return (
      <div className="admin-login">
        <h1>Administration</h1>
        <form onSubmit={handleLogin}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            autoFocus
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>
    )
  }

  return (
    <div className="admin-view">
      <header className="admin-header">
        <h1>{admin.display_name} <span className="admin-role">({admin.role})</span></h1>
        <button type="button" onClick={() => setAdmin(null)}>Se déconnecter</button>
      </header>
      <Dashboard
        adminCredentials={{ username: admin.username, password: admin.password }}
        adminRole={admin.role}
        adminUsername={admin.display_name}
      />
    </div>
  )
}
