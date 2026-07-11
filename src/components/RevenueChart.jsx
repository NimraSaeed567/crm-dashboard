import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'

export default function RevenueChart({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#27272a' : '#eef0f4'
  const tickColor = isDark ? '#a1a1aa' : '#9ca3af'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Revenue Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ left: 0, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} />
          <YAxis
            tick={{ fontSize: 12, fill: tickColor }}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${isDark ? '#3f3f46' : '#e5e7eb'}`,
              fontSize: 12,
              background: isDark ? '#18181b' : '#fff',
              color: isDark ? '#e4e4e7' : '#111827',
            }}
            cursor={{ stroke: isDark ? '#3f3f46' : '#e5e7eb' }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#4f46e5' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
