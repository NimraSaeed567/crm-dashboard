const COLOR_STYLES = {
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
}

export default function KpiCard({ title, value, icon: Icon, hint, color = 'indigo' }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
      </div>
      {Icon && (
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            COLOR_STYLES[color] || COLOR_STYLES.indigo
          }`}
        >
          <Icon size={20} />
        </div>
      )}
    </div>
  )
}
