import { Users, UserPlus, DollarSign, TrendingUp } from 'lucide-react'
import { useDashboardData } from '../hooks/useDashboardData'
import KpiCard from '../components/KpiCard'
import PipelineChart from '../components/PipelineChart'
import RevenueChart from '../components/RevenueChart'
import SourceChart from '../components/SourceChart'
import RecentCustomers from '../components/RecentCustomers'
import ActivityFeed from '../components/ActivityFeed'
import TaskList from '../components/TaskList'

export default function Dashboard() {
  const { loading, error, data } = useDashboardData()

  if (loading) {
    return <div className="p-10 text-center text-sm text-gray-400">Loading dashboard…</div>
  }

  if (error) {
    return (
      <div className="p-10 text-center text-sm text-red-500">
        Failed to load data from Supabase: {error.message}
      </div>
    )
  }

  const { kpis, customers, pipeline, revenueByMonth, customersBySource, activities, tasks } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your customers and sales activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Total Customers" value={kpis.totalCustomers} icon={Users} color="indigo" />
        <KpiCard
          title="New Leads This Month"
          value={kpis.newLeadsThisMonth}
          icon={UserPlus}
          color="emerald"
        />
        <KpiCard
          title="Revenue This Month"
          value={`$${kpis.revenueThisMonth.toLocaleString()}`}
          icon={DollarSign}
          color="amber"
        />
        <KpiCard
          title="Conversion Rate"
          value={`${kpis.conversionRate}%`}
          icon={TrendingUp}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <PipelineChart data={pipeline} />
        <RevenueChart data={revenueByMonth} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1">
          <SourceChart data={customersBySource} />
        </div>
        <div className="xl:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
        <div className="xl:col-span-1">
          <TaskList tasks={tasks} />
        </div>
      </div>

      <RecentCustomers customers={customers} />
    </div>
  )
}
