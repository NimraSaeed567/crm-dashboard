import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useToast } from '../context/ToastContext'
import Modal from './Modal'

const STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue']

function nextInvoiceNumber(invoices) {
  const numbers = invoices
    .map((i) => parseInt(String(i.invoiceNumber).replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1
  return `INV-${next}`
}

export default function InvoiceFormModal({ invoice, invoices = [], customers = [], onClose, onSaved }) {
  const isEditing = Boolean(invoice)
  const showToast = useToast()
  const [form, setForm] = useState(
    invoice
      ? {
          invoiceNumber: invoice.invoiceNumber,
          customerName: invoice.customerName,
          amount: String(invoice.amount),
          status: invoice.status,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
        }
      : {
          invoiceNumber: nextInvoiceNumber(invoices),
          customerName: customers[0]?.name || '',
          amount: '',
          status: STATUSES[0],
          issueDate: new Date().toISOString().slice(0, 10),
          dueDate: new Date().toISOString().slice(0, 10),
        }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      invoice_number: form.invoiceNumber.trim(),
      customer_name: form.customerName,
      amount: Number(form.amount) || 0,
      status: form.status,
      issue_date: form.issueDate,
      due_date: form.dueDate,
    }

    const { error } = isEditing
      ? await supabase.from('invoices').update(payload).eq('id', invoice.id)
      : await supabase.from('invoices').insert(payload)

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    if (!isEditing) showToast('Invoice added successfully')
    onSaved()
    onClose()
  }

  return (
    <Modal title={isEditing ? 'Edit Invoice' : 'Add Invoice'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Invoice Number <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.invoiceNumber}
            onChange={update('invoiceNumber')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Customer</label>
          <select
            value={form.customerName}
            onChange={update('customerName')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Amount ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={form.amount}
              onChange={update('amount')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
            <select
              value={form.status}
              onChange={update('status')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
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
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.issueDate}
              onChange={update('issueDate')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.dueDate}
              onChange={update('dueDate')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400"
            />
          </div>
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
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
