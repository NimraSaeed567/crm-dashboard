import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  New: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  Contacted: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  Qualified: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
  Proposal: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  Won: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400',
  Lost: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
}

const PREVIEW_COUNT = 5

export default function RecentCustomers({ customers }) {
  const recent = [...customers].sort((a, b) => b.id - a.id).slice(0, PREVIEW_COUNT)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Customers</h3>
        <Link to="/customers" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
          View all &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Company</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Deal Value</th>
              <th className="py-2 pr-4 font-medium">Last Contact</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{c.name}</td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{c.company}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  ${c.dealValue.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{c.lastContact}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
