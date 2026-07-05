const COLOR_STYLES = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
}

export default function KpiCard({ title, value, icon: Icon, hint, color = 'indigo' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
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
