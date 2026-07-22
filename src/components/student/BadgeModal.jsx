import { useState } from 'react'
import BadgeRequestButton from './BadgeRequestButton'
import Modal from '../common/Modal'
import ConfirmDialog from '../common/ConfirmDialog'

export default function BadgeModal({ badge, granted, githubInfo, onClose, onAdd, onRemove }) {
  const [grantedByAlias, setGrantedByAlias] = useState(granted?.grantedByAlias || '')
  const [proofUrl, setProofUrl] = useState(granted?.proofUrl || '')
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!grantedByAlias.trim()) return
    onAdd(badge.id, {
      grantedBy: badge.grantedBy,
      grantedByAlias: grantedByAlias.trim(),
      proofUrl: proofUrl.trim(),
    })
    onClose()
  }

  const handleRemove = () => {
    onRemove(badge.id)
    onClose()
  }

  if (confirmingRemove) {
    return (
      <ConfirmDialog
        title="Retirer ce badge ?"
        message={`« ${badge.name} » ne sera plus marqué comme obtenu sur votre fiche.`}
        confirmLabel="Retirer"
        danger
        onConfirm={handleRemove}
        onCancel={() => setConfirmingRemove(false)}
      />
    )
  }

  return (
    <Modal onClose={onClose}>
      <div className="badge-modal-header">
        <div className="badge-pastille large">
          <span className="badge-icon">{badge.icon}</span>
        </div>
        <h3>{badge.name}</h3>
      </div>
      <p className="project-description">{badge.description}</p>

      {granted ? (
        <>
          <p className="export-success-msg">
            ✅ Débloqué{granted.grantedByAlias ? ` par ${granted.grantedByAlias}` : ''}
            {granted.grantedBy ? ` (${granted.grantedBy})` : ''}
          </p>
          {granted.proofUrl && (
            <p><a href={granted.proofUrl} target="_blank" rel="noreferrer">Voir la discussion GitHub ↗</a></p>
          )}
          <button type="button" className="btn-danger" onClick={() => setConfirmingRemove(true)}>Retirer ce badge</button>
        </>
      ) : (
        <>
          <BadgeRequestButton badge={badge} githubInfo={githubInfo} />
          <form className="endorsement-add-form" onSubmit={handleSubmit}>
            <p className="form-hint">Une fois la discussion GitHub conclue, consignez l'obtention ici.</p>
            <input
              value={grantedByAlias}
              onChange={(e) => setGrantedByAlias(e.target.value)}
              placeholder={`Accordé par (${badge.grantedBy})`}
              required
            />
            <input
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="Lien de la discussion GitHub"
            />
            <button type="submit">Confirmer le badge</button>
          </form>
        </>
      )}
    </Modal>
  )
}
