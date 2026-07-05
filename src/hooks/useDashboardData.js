import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']
const MONTHS_BACK = 6

export function useDashboardData() {
  const [state, setState] = useState({ loading: true, error: null, data: null })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))

    const [customersRes, activitiesRes, tasksRes] = await Promise.all([
      supabase.from('customers').select('*').order('id', { ascending: false }),
      supabase.from('activities').select('*').order('id', { ascending: false }),
      supabase.from('tasks').select('*').order('id', { ascending: false }),
    ])

    const error = customersRes.error || activitiesRes.error || tasksRes.error
    if (error) {
      setState({ loading: false, error, data: null })
      return
    }

    const customers = customersRes.data.map((c) => ({
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      source: c.source,
      status: c.status,
      dealValue: Number(c.deal_value),
      lastContact: c.last_contact,
    }))

    const pipeline = STAGES.map((stage) => ({
      stage,
      count: customers.filter((c) => c.status === stage).length,
    }))

    const sourceCounts = {}
    customers.forEach((c) => {
      sourceCounts[c.source] = (sourceCounts[c.source] || 0) + 1
    })
    const customersBySource = Object.entries(sourceCounts).map(([source, count]) => ({
      source,
      count,
    }))

    const now = new Date()
    const months = Array.from({ length: MONTHS_BACK }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1 - i), 1)
      return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString('en-US', { month: 'short' }) }
    })

    const wonCustomers = customers.filter((c) => c.status === 'Won')

    const revenueByMonth = months.map(({ year, month, label }) => ({
      month: label,
      revenue: wonCustomers
        .filter((c) => {
          const d = new Date(c.lastContact)
          return d.getFullYear() === year && d.getMonth() === month
        })
        .reduce((sum, c) => sum + c.dealValue, 0),
    }))
    const revenueThisMonth = revenueByMonth.at(-1)?.revenue ?? 0

    const wonCount = wonCustomers.length
    const conversionRate = customers.length ? Math.round((wonCount / customers.length) * 100) : 0

    const newLeadsThisMonth = customers.filter((c) => {
      const d = new Date(c.lastContact)
      return (
        c.status === 'New' &&
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      )
    }).length

    const kpis = {
      totalCustomers: customers.length,
      newLeadsThisMonth,
      revenueThisMonth,
      conversionRate,
    }

    const activities = activitiesRes.data.map((a) => ({
      id: a.id,
      customerName: a.customer_name,
      type: a.type,
      note: a.note,
      date: a.date,
    }))

    const tasks = tasksRes.data.map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.due_date,
      done: t.done,
    }))

    setState({
      loading: false,
      error: null,
      data: { kpis, customers, pipeline, revenueByMonth, customersBySource, activities, tasks },
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload }
}
