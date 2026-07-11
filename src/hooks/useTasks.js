import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useTasks() {
  const [state, setState] = useState({ loading: true, error: null, tasks: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .is('deleted_at', null)
      .order('id', { ascending: false })

    if (error) {
      setState({ loading: false, error, tasks: [] })
      return
    }

    const tasks = data.map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.due_date,
      done: t.done,
      customerName: t.customer_name,
    }))

    setState({ loading: false, error: null, tasks })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload }
}
