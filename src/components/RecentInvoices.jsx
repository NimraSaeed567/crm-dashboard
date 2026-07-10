import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  Draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  Sent: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  Paid: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400',
  Overdue: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
}

const PREVIEW_COUNT = 5

export default function RecentInvoices({ invoices }) {
  const recent = [...invoices].sort((a, b) => b.id - a.id).slice(0, PREVIEW_COUNT)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Invoices</h3>
        <Link to="/invoices" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
          View all &rarr;
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <th className="py-2 pr-4 font-medium">Invoice #</th>
              <th className="py-2 pr-4 font-medium">Customer</th>
              <th className="py-2 pr-4 font-medium">Amount</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{inv.customerName}</td>
                <td className="py-3 pr-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  ${inv.amount.toLocaleString()}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[inv.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{inv.dueDate}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
