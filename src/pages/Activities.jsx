import { useActivities } from '../hooks/useActivities'
import { useCustomers } from '../hooks/useCustomers'
import ActivityManager from '../components/ActivityManager'

export default function Activities() {
  const { loading, error, activities, reload } = useActivities()
  const { customers } = useCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Activities</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Log and manage every customer touchpoint.</p>
      </div>

      {loading && <div className="p-10 text-center text-sm text-gray-400">Loading activities…</div>}
      {error && (
        <div className="p-10 text-center text-sm text-red-500">
          Failed to load activities: {error.message}
        </div>
      )}
      {!loading && !error && (
        <ActivityManager activities={activities} customers={customers} onChanged={reload} />
      )}
    </div>
  )
}
