import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useCustomers() {
  const [state, setState] = useState({ loading: true, error: null, customers: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      setState({ loading: false, error, customers: [] })
      return
    }

    const customers = data.map((c) => ({
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      source: c.source,
      status: c.status,
      dealValue: Number(c.deal_value),
      lastContact: c.last_contact,
    }))

    setState({ loading: false, error: null, customers })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload }
}
