import { Link } from 'react-router-dom'

const PREVIEW_COUNT = 5

export default function TaskList({ tasks }) {
  const upcoming = [...tasks]
    .filter((t) => !t.done)
    .sort((a, b) => b.id - a.id)
    .slice(0, PREVIEW_COUNT)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Upcoming Tasks</h3>
        <Link to="/tasks" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
          View all &rarr;
        </Link>
      </div>
      <ul className="space-y-3">
        {upcoming.map((task) => (
          <li key={task.id} className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-gray-800 dark:text-gray-100">{task.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {task.customerName && <>{task.customerName} &middot; </>}Due {task.dueDate}
              </p>
            </div>
          </li>
        ))}
        {upcoming.length === 0 && <p className="text-sm text-gray-400">No upcoming tasks.</p>}
      </ul>
    </div>
  )
}
