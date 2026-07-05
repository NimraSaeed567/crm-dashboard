import { useCustomers } from '../hooks/useCustomers'
import CustomerTable from '../components/CustomerTable'

export default function Customers() {
  const { loading, error, customers, reload } = useCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add, edit, and manage every customer record.
        </p>
      </div>

      {loading && <div className="p-10 text-center text-sm text-gray-400">Loading customers…</div>}
      {error && (
        <div className="p-10 text-center text-sm text-red-500">
          Failed to load customers: {error.message}
        </div>
      )}
      {!loading && !error && <CustomerTable customers={customers} onChanged={reload} />}
    </div>
  )
}
