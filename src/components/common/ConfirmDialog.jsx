import Modal from './Modal'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirmer', danger, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Annuler</button>
        <button type="button" className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
