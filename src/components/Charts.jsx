import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend
} from 'recharts'
import useStore from '../store/useStore'
import { CATEGORY_COLORS } from '../data/transactions'
import { formatCurrency } from '../utils/formatters'

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-white font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm">
      <p className="text-slate-400 mb-1">{payload[0].name}</p>
      <p className="text-white font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export function BalanceTrendChart() {
  const { transactions } = useStore()

  const months = ['2026-01', '2026-02', '2026-03', '2026-04']
  const monthLabels = { '2026-01': 'Jan', '2026-02': 'Feb', '2026-03': 'Mar', '2026-04': 'Apr' }

  let runningBalance = 0
  const data = months.map(month => {
    transactions
      .filter(tx => tx.date.startsWith(month))
      .forEach(tx => {
        runningBalance += tx.type === 'income' ? tx.amount : -tx.amount
      })
    return {
      month: monthLabels[month],
      balance: parseFloat(runningBalance.toFixed(2))
    }
  })

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <p className="text-white font-medium mb-1">Balance Trend</p>
      <p className="text-slate-500 text-xs mb-5">Running balance over time</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `£${(v/1000).toFixed(0)}k`}
          />
          <Tooltip content={<LineTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#4f8ef7"
            strokeWidth={2.5}
            dot={{ fill: '#4f8ef7', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SpendingDonutChart() {
  const { transactions } = useStore()

  const categoryTotals = {}
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
    })

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }))

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
      <p className="text-white font-medium mb-1">Spending Breakdown</p>
      <p className="text-slate-500 text-xs mb-5">Expenses by category</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || '#8a93a8'}
              />
            ))}
          </Pie>
          <PieTooltip content={<DonutTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}