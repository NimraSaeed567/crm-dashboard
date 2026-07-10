import { useEffect, useMemo, useState } from 'react'
import { Search, ChevronUp, ChevronDown, Plus, Trash2, Pencil } from 'lucide-react'
import { softDeleteRecord } from '../lib/softDelete'
import InvoiceFormModal from './InvoiceFormModal'
import Pagination from './Pagination'

const STATUS_STYLES = {
  Draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  Sent: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  Paid: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400',
  Overdue: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
}

const COLUMNS = [
  { key: 'invoiceNumber', label: 'Invoice #' },
  { key: 'customerName', label: 'Customer' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'issueDate', label: 'Issue Date' },
  { key: 'dueDate', label: 'Due Date' },
]

const PAGE_SIZE = 8

export default function InvoiceManager({ invoices, customers, onChanged }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q
      ? invoices.filter((i) =>
          [i.invoiceNumber, i.customerName, i.amount, i.status, i.issueDate, i.dueDate].some((v) =>
            String(v).toLowerCase().includes(q)
          )
        )
      : invoices

    return [...rows].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
  }, [invoices, query, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [query, sortKey, sortDir])

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleDelete = async (invoice) => {
    if (!window.confirm('Delete this invoice?')) return
    setDeletingId(invoice.id)
    const { error } = await softDeleteRecord('invoices', invoice)
    setDeletingId(null)
    if (!error) onChanged()
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Invoices <span className="text-gray-400 dark:text-gray-500 font-normal">({filtered.length})</span>
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search invoices..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-indigo-400 w-full sm:w-64"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={customers.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 shrink-0"
          >
            <Plus size={15} />
            Add Invoice
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="py-2 pr-4 font-bold cursor-pointer select-none whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key &&
                      (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                  </span>
                </th>
              ))}
              <th className="py-2 pr-4 font-bold w-16" />
            </tr>
          </thead>
          <tbody>
            {paged.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => setEditingInvoice(inv)}
                className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/60 cursor-pointer"
              >
                <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{inv.customerName}</td>
                <td className="py-3 pr-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  ${inv.amount.toLocaleString()}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[inv.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{inv.issueDate}</td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{inv.dueDate}</td>
                <td className="py-3 pr-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingInvoice(inv)
                    }}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 mr-1"
                    title="Edit invoice"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(inv)
                    }}
                    disabled={deletingId === inv.id}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-700 disabled:opacity-40"
                    title="Delete invoice"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="py-6 text-center text-gray-400">
                  No invoices match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        totalCount={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {showAddModal && (
        <InvoiceFormModal
          invoices={invoices}
          customers={customers}
          onClose={() => setShowAddModal(false)}
          onSaved={onChanged}
        />
      )}
      {editingInvoice && (
        <InvoiceFormModal
          invoice={editingInvoice}
          invoices={invoices}
          customers={customers}
          onClose={() => setEditingInvoice(null)}
          onSaved={onChanged}
        />
      )}
    </div>
  )
}
