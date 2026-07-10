import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

const ToastContext = createContext(null)

let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message) => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, message }])
      setTimeout(() => dismiss(id), 3000)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900 shadow-lg rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 min-w-[240px]"
          >
            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
