import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CheckSquare, ListChecks } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', end: true },
  { label: 'Customers', icon: Users, path: '/customers' },
  { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { label: 'Activities', icon: ListChecks, path: '/activities' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 bg-white border-r border-gray-200 min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          C
        </div>
        <span className="ml-3 font-semibold text-gray-900 text-lg">CRM Dashboard</span>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path, end }) => (
          <NavLink
            key={label}
            to={path}
            end={end}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-400">
        v0.5 &middot; live data
      </div>
    </aside>
  )
}
