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

const STAGE_COLORS = {
  New: '#a5b4fc',
  Contacted: '#818cf8',
  Qualified: '#6366f1',
  Proposal: '#4f46e5',
  Won: '#22c55e',
  Lost: '#ef4444',
}

export default function PipelineChart({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Sales Pipeline</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef0f4" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis
            type="category"
            dataKey="stage"
            width={80}
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            cursor={{ fill: '#f5f6fa' }}
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
