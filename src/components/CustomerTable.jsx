import { useEffect, useMemo, useState } from 'react'
import { Search, ChevronUp, ChevronDown, Plus, Trash2, Pencil } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import CustomerFormModal from './CustomerFormModal'
import Pagination from './Pagination'

const STATUS_STYLES = {
  New: 'bg-gray-100 text-gray-600',
  Contacted: 'bg-blue-50 text-blue-600',
  Qualified: 'bg-indigo-50 text-indigo-600',
  Proposal: 'bg-amber-50 text-amber-600',
  Won: 'bg-green-50 text-green-600',
  Lost: 'bg-red-50 text-red-600',
}

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'status', label: 'Status' },
  { key: 'dealValue', label: 'Deal Value' },
  { key: 'lastContact', label: 'Last Contact' },
]

const PAGE_SIZE = 8

export default function CustomerTable({ customers, onChanged }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q
      ? customers.filter((c) =>
          [c.name, c.company, c.status, c.dealValue, c.lastContact].some((v) =>
            String(v).toLowerCase().includes(q)
          )
        )
      : customers

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
  }, [customers, query, sortKey, sortDir])

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return
    setDeletingId(id)
    const { error } = await supabase.from('customers').delete().eq('id', id)
    setDeletingId(null)
    if (!error) onChanged()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Customers <span className="text-gray-400 font-normal">({filtered.length})</span>
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 w-full sm:w-64"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shrink-0"
          >
            <Plus size={15} />
            Add Customer
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-900 border-b border-gray-200">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="py-2 pr-4 font-bold cursor-pointer select-none whitespace-nowrap hover:text-indigo-600 transition-colors"
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
            {paged.map((c) => (
              <tr
                key={c.id}
                onClick={() => setEditingCustomer(c)}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 cursor-pointer"
              >
                <td className="py-3 pr-4 font-medium text-gray-800 whitespace-nowrap">{c.name}</td>
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{c.company}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">
                  ${c.dealValue.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{c.lastContact}</td>
                <td className="py-3 pr-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingCustomer(c)
                    }}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 mr-1"
                    title="Edit customer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(c.id)
                    }}
                    disabled={deletingId === c.id}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                    title="Delete customer"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="py-6 text-center text-gray-400">
                  No customers match your search.
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
        <CustomerFormModal
          customers={customers}
          onClose={() => setShowAddModal(false)}
          onSaved={onChanged}
        />
      )}
      {editingCustomer && (
        <CustomerFormModal
          customer={editingCustomer}
          customers={customers}
          onClose={() => setEditingCustomer(null)}
          onSaved={onChanged}
        />
      )}
    </div>
  )
}
