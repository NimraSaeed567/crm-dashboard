import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useInvoices() {
  const [state, setState] = useState({ loading: true, error: null, invoices: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .is('deleted_at', null)
      .order('id', { ascending: false })

    if (error) {
      setState({ loading: false, error, invoices: [] })
      return
    }

    const invoices = data.map((i) => ({
      id: i.id,
      invoiceNumber: i.invoice_number,
      customerName: i.customer_name,
      amount: Number(i.amount),
      status: i.status,
      issueDate: i.issue_date,
      dueDate: i.due_date,
    }))

    setState({ loading: false, error: null, invoices })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload }
}
