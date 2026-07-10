import { Link } from 'react-router-dom'
import { Mail, Phone, Calendar, Activity as ActivityIcon } from 'lucide-react'

const TYPE_ICON = {
  Email: Mail,
  Call: Phone,
  Meeting: Calendar,
}

const PREVIEW_COUNT = 4

export default function ActivityFeed({ activities }) {
  const sorted = [...activities].sort((a, b) => b.id - a.id).slice(0, PREVIEW_COUNT)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h3>
        <Link to="/activities" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
          View all &rarr;
        </Link>
      </div>
      <ul className="space-y-4">
        {sorted.map((activity) => {
          const Icon = TYPE_ICON[activity.type] || ActivityIcon
          return (
            <li key={activity.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  <span className="font-medium">{activity.customerName}</span>{' '}
                  <span className="text-gray-400 dark:text-gray-500">&middot; {activity.type}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.note}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{activity.date}</p>
              </div>
            </li>
          )
        })}
        {sorted.length === 0 && <p className="text-sm text-gray-400">No recent activity.</p>}
      </ul>
    </div>
  )
}
