import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../context/ToastContext'
import Modal from './Modal'

const emptyForm = { title: '', dueDate: new Date().toISOString().slice(0, 10), done: false }

export default function TaskFormModal({ task, onClose, onSaved }) {
  const isEditing = Boolean(task)
  const showToast = useToast()
  const [form, setForm] = useState(
    task ? { title: task.title, dueDate: task.dueDate, done: task.done } : emptyForm
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = { title: form.title.trim(), due_date: form.dueDate, done: form.done }

    const { error } = isEditing
      ? await supabase.from('tasks').update(payload).eq('id', task.id)
      : await supabase.from('tasks').insert(payload)

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    if (!isEditing) showToast('Task added successfully')
    onSaved()
    onClose()
  }

  return (
    <Modal title={isEditing ? 'Edit Task' : 'Add Task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        {isEditing && (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.done}
              onChange={(e) => setForm((f) => ({ ...f, done: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
            />
            Completed
          </label>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
