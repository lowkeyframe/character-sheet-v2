import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ onClose, children }) {
  const contentRef = useRef(null)
  const triggerRef = useRef(document.activeElement)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !contentRef.current) return
      const focusable = contentRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const focusable = contentRef.current?.querySelector(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
    )
    focusable?.focus()

    const trigger = triggerRef.current
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      trigger?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" ref={contentRef} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.body
  )
}
