import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useActivities() {
  const [state, setState] = useState({ loading: true, error: null, activities: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      setState({ loading: false, error, activities: [] })
      return
    }

    const activities = data.map((a) => ({
      id: a.id,
      customerName: a.customer_name,
      type: a.type,
      note: a.note,
      date: a.date,
    }))

    setState({ loading: false, error: null, activities })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload }
}
