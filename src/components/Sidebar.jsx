import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CheckSquare, ListChecks, Sparkles, FileText, Sun, Moon, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', end: true },
  { label: 'Customers', icon: Users, path: '/customers' },
  { label: 'Invoices', icon: FileText, path: '/invoices' },
  { label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { label: 'Activities', icon: ListChecks, path: '/activities' },
  { label: 'Ask AI', icon: Sparkles, path: '/ask-ai' },
]

export default function Sidebar({ open, onClose }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-50 h-screen w-60 flex flex-col shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="ml-3 font-semibold text-gray-900 dark:text-gray-100 text-lg">CRM Dashboard</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path, end }) => (
            <NavLink
              key={label}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
          v0.6 &middot; live data
        </div>
      </aside>
    </>
  )
}
