import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'

const STAGE_COLORS = {
  New: '#a5b4fc',
  Contacted: '#818cf8',
  Qualified: '#6366f1',
  Proposal: '#4f46e5',
  Won: '#22c55e',
  Lost: '#ef4444',
}

export default function PipelineChart({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#27272a' : '#eef0f4'
  const tickColor = isDark ? '#a1a1aa' : '#9ca3af'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Sales Pipeline</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
          <YAxis
            type="category"
            dataKey="stage"
            width={80}
            tick={{ fontSize: 12, fill: tickColor }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${isDark ? '#3f3f46' : '#e5e7eb'}`,
              fontSize: 12,
              background: isDark ? '#18181b' : '#fff',
              color: isDark ? '#e4e4e7' : '#111827',
            }}
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.06)' : '#f5f6fa' }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
            {data.map((entry) => (
              <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] || '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
