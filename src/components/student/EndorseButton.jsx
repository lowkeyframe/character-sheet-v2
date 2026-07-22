import { useState } from 'react'

export default function EndorseButton({ project, isOwnProject, canEndorseAs, endorsed, onEndorse, onRemove }) {
  const [busy, setBusy] = useState(false)

  if (isOwnProject) return null

  if (!canEndorseAs) {
    return <p className="endorse-hint">Connectez-vous pour endosser ce projet.</p>
  }

  const handleClick = async () => {
    setBusy(true)
    try {
      if (endorsed) {
        await onRemove(project.id)
      } else {
        await onEndorse(project.id)
      }
    } catch (err) {
      alert(err.message)
    }
    setBusy(false)
  }

  return (
    <button
      type="button"
      className={`endorse-btn ${endorsed ? 'endorsed' : ''}`}
      onClick={handleClick}
      disabled={busy}
    >
      {endorsed ? '★ Endossé' : '☆ Endosser'}
    </button>
  )
}
