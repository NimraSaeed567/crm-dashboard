import { useTasks } from '../hooks/useTasks'
import { useCustomers } from '../hooks/useCustomers'
import TaskManager from '../components/TaskManager'

export default function Tasks() {
  const { loading, error, tasks, reload } = useTasks()
  const { customers } = useCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Tasks</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add, edit, and track every task to completion.</p>
      </div>

      {loading && <div className="p-10 text-center text-sm text-gray-400">Loading tasks…</div>}
      {error && (
        <div className="p-10 text-center text-sm text-red-500">
          Failed to load tasks: {error.message}
        </div>
      )}
      {!loading && !error && (
        <TaskManager tasks={tasks} customers={customers} onChanged={reload} />
      )}
    </div>
  )
}
