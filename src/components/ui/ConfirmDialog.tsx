'use client'

import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  // Focus management: focus cancel button when dialog opens and restore focus on close
  useEffect(() => {
    if (open) {
      // Save currently focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement
      
      // Focus cancel button
      if (cancelButtonRef.current) {
        cancelButtonRef.current.focus()
      }
    } else {
      // Restore focus when dialog closes
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus()
      }
    }
  }, [open])

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Handle ESC key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !loading) {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, loading, onCancel])

  // Focus trap: cycle Tab between Cancel and Confirm buttons
  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      if (!open || e.key !== 'Tab') return

      const cancelButton = cancelButtonRef.current
      const confirmButton = confirmButtonRef.current

      if (!cancelButton || !confirmButton) return

      const activeElement = document.activeElement

      if (e.shiftKey) {
        // Shift+Tab: moving backwards
        if (activeElement === cancelButton) {
          e.preventDefault()
          confirmButton.focus()
        }
      } else {
        // Tab: moving forwards
        if (activeElement === confirmButton) {
          e.preventDefault()
          cancelButton.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={loading ? undefined : onCancel}
      />

      {/* Dialog Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-950/50 border border-red-800 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold text-white mb-2"
                  id="dialog-title"
                >
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-slate-300 mb-4" id="dialog-description">{description}</p>
                )}
                {loading && (
                  <div className="flex items-center text-sm text-slate-300">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                    Working...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-950/50 px-6 py-4 rounded-b-2xl flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              ref={cancelButtonRef}
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              ref={confirmButtonRef}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
