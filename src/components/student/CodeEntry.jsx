import { useState } from 'react'

export default function CodeEntry({ onConsult, onLogin, error }) {
  const [mode, setMode] = useState('login') // 'login' | 'consult'
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedCode = code.trim()
    if (!trimmedCode) return

    if (mode === 'consult') {
      onConsult(trimmedCode)
      return
    }

    setSubmitting(true)
    await onLogin(trimmedCode, password)
    setSubmitting(false)
  }

  return (
    <div className="code-entry">
      <h1>Feuille de personnage</h1>

      <div className="mode-toggle">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          Se connecter
        </button>
        <button
          type="button"
          className={mode === 'consult' ? 'active' : ''}
          onClick={() => setMode('consult')}
        >
          Consulter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="code-entry-form">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code étudiant"
          autoFocus
          required
        />
        {mode === 'login' && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        )}
        <button type="submit" disabled={submitting}>
          {mode === 'login' ? 'Se connecter' : 'Consulter'}
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
