import { useEffect, useState } from 'react'
import * as adminService from '../../services/adminService'

export default function AuditLog({ adminCredentials }) {
  const [entries, setEntries] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    adminService.getAuditLog(adminCredentials)
      .then(data => { if (!cancelled) setEntries(data) })
      .catch(err => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [adminCredentials])

  if (error) return <p className="error-msg">{error}</p>
  if (!entries) return <p className="loading-msg">Chargement du journal…</p>

  return (
    <table className="audit-log-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Admin</th>
          <th>Action</th>
          <th>Étudiant</th>
          <th>Détail</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id}>
            <td>{new Date(entry.timestamp).toLocaleString('fr-CA')}</td>
            <td>{entry.admin_display || entry.admin_username}</td>
            <td>{entry.action}</td>
            <td>{entry.target_student || '—'}</td>
            <td>{entry.detail || '—'}</td>
          </tr>
        ))}
        {entries.length === 0 && (
          <tr><td colSpan={5} className="empty-msg">Aucune entrée.</td></tr>
        )}
      </tbody>
    </table>
  )
}
