import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageCount, totalCount, pageSize, onPageChange }) {
  if (totalCount === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalCount)

  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing {start}&ndash;{end} of {totalCount}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 px-2">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
