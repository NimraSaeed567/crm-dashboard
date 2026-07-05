import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../context/ToastContext'
import Modal from './Modal'

const SOURCES = ['Referral', 'Website', 'Cold Outreach', 'Social Media']
const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']

const emptyForm = {
  name: '',
  company: '',
  email: '',
  source: SOURCES[0],
  status: STATUSES[0],
  dealValue: '',
  lastContact: new Date().toISOString().slice(0, 10),
}

export default function CustomerFormModal({ customer, customers = [], onClose, onSaved }) {
  const isEditing = Boolean(customer)
  const showToast = useToast()
  const [form, setForm] = useState(
    customer
      ? {
          name: customer.name,
          company: customer.company,
          email: customer.email,
          source: customer.source,
          status: customer.status,
          dealValue: String(customer.dealValue),
          lastContact: customer.lastContact,
        }
      : emptyForm
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedName = form.name.trim()
    const isDuplicate = customers.some(
      (c) => c.name.trim().toLowerCase() === trimmedName.toLowerCase() && c.id !== customer?.id
    )
    if (isDuplicate) {
      window.alert(`A customer named "${trimmedName}" already exists.`)
      return
    }

    setSaving(true)
    setError(null)

    const payload = {
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      source: form.source,
      status: form.status,
      deal_value: Number(form.dealValue) || 0,
      last_contact: form.lastContact,
    }

    const { error } = isEditing
      ? await supabase.from('customers').update(payload).eq('id', customer.id)
      : await supabase.from('customers').insert(payload)

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    if (!isEditing) showToast('Customer added successfully')
    onSaved()
    onClose()
  }

  return (
    <Modal title={isEditing ? 'Edit Customer' : 'Add Customer'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.name}
            onChange={update('name')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.company}
            onChange={update('company')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
            <select
              value={form.source}
              onChange={update('source')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={form.status}
              onChange={update('status')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Deal Value ($)</label>
            <input
              type="number"
              min="0"
              value={form.dealValue}
              onChange={update('dealValue')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Last Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.lastContact}
              onChange={update('lastContact')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>
        </div>

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
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Customer'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
