import { useEffect, useMemo, useState } from 'react'
import { Search, ChevronUp, ChevronDown, Plus, Trash2, Pencil, Mail, Phone, Calendar, Activity as ActivityIcon } from 'lucide-react'
import { softDeleteRecord } from '../lib/softDelete'
import ActivityFormModal from './ActivityFormModal'
import Pagination from './Pagination'

const TYPE_ICON = {
  Email: Mail,
  Call: Phone,
  Meeting: Calendar,
}

const COLUMNS = [
  { key: 'customerName', label: 'Customer' },
  { key: 'type', label: 'Type' },
  { key: 'note', label: 'Note' },
  { key: 'date', label: 'Date' },
]

const PAGE_SIZE = 8

export default function ActivityManager({ activities, customers, onChanged }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [editingActivity, setEditingActivity] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q
      ? activities.filter((a) =>
          [a.customerName, a.type, a.note, a.date].some((v) => String(v).toLowerCase().includes(q))
        )
      : activities

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
  }, [activities, query, sortKey, sortDir])

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

  const handleDelete = async (activity) => {
    if (!window.confirm('Delete this activity?')) return
    setDeletingId(activity.id)
    const { error } = await softDeleteRecord('activities', activity)
    setDeletingId(null)
    if (!error) onChanged()
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Activities <span className="text-gray-400 dark:text-gray-500 font-normal">({filtered.length})</span>
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activities..."
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
            Log Activity
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
            {paged.map((a) => {
              const Icon = TYPE_ICON[a.type] || ActivityIcon
              return (
                <tr key={a.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                  <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{a.customerName}</td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon size={14} className="text-indigo-500 dark:text-indigo-400" />
                      {a.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">{a.note}</td>
                  <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{a.date}</td>
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setEditingActivity(a)}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 mr-1"
                      title="Edit activity"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a)}
                      disabled={deletingId === a.id}
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-700 disabled:opacity-40"
                      title="Delete activity"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="py-6 text-center text-gray-400">
                  No activities match your search.
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
        <ActivityFormModal customers={customers} onClose={() => setShowAddModal(false)} onSaved={onChanged} />
      )}
      {editingActivity && (
        <ActivityFormModal
          activity={editingActivity}
          customers={customers}
          onClose={() => setEditingActivity(null)}
          onSaved={onChanged}
        />
      )}
    </div>
  )
}
