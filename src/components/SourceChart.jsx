import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'

const COLORS = ['#4f46e5', '#14b8a6', '#f59e0b', '#f43f5e']

export default function SourceChart({ data }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Customers by Source</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="source"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.source} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${isDark ? '#3f3f46' : '#e5e7eb'}`,
              fontSize: 12,
              background: isDark ? '#18181b' : '#fff',
              color: isDark ? '#e4e4e7' : '#111827',
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: isDark ? '#a1a1aa' : '#4b5563' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
