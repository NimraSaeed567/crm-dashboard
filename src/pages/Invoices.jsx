import { useInvoices } from '../hooks/useInvoices'
import { useCustomers } from '../hooks/useCustomers'
import InvoiceManager from '../components/InvoiceManager'

export default function Invoices() {
  const { loading, error, invoices, reload } = useInvoices()
  const { customers } = useCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Invoices</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create, send, and track invoices — a Paid invoice is the receipt.
        </p>
      </div>

      {loading && <div className="p-10 text-center text-sm text-gray-400">Loading invoices…</div>}
      {error && (
        <div className="p-10 text-center text-sm text-red-500">
          Failed to load invoices: {error.message}
        </div>
      )}
      {!loading && !error && (
        <InvoiceManager invoices={invoices} customers={customers} onChanged={reload} />
      )}
    </div>
  )
}
