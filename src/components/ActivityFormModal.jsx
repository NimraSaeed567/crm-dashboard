import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Modal from './Modal'

const TYPES = ['Email', 'Call', 'Meeting']

export default function ActivityFormModal({ activity, customers, onClose, onSaved }) {
  const isEditing = Boolean(activity)
  const [form, setForm] = useState(
    activity
      ? { customerName: activity.customerName, type: activity.type, note: activity.note, date: activity.date }
      : {
          customerName: customers[0]?.name || '',
          type: TYPES[0],
          note: '',
          date: new Date().toISOString().slice(0, 10),
        }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      customer_name: form.customerName,
      type: form.type,
      note: form.note.trim(),
      date: form.date,
    }

    const { error } = isEditing
      ? await supabase.from('activities').update(payload).eq('id', activity.id)
      : await supabase.from('activities').insert(payload)

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    onSaved()
    onClose()
  }

  return (
    <Modal title={isEditing ? 'Edit Activity' : 'Log Activity'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Customer</label>
          <select
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Note <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Log Activity'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
