import useStore from '../store/useStore'
import { CATEGORY_COLORS } from '../data/transactions'
import { formatCurrency } from '../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

function InsightCard({ icon, label, value, sub }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white font-semibold text-lg">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SpendingBar({ category, amount, max }) {
  const color = CATEGORY_COLORS[category] || '#8a93a8'
  const pct = ((amount / max) * 100).toFixed(1)

  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-slate-400 text-xs w-24 text-right shrink-0">
        {category}
      </span>
      <div className="flex-1 bg-slate-800 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-slate-300 text-xs font-mono w-20 text-right shrink-0">
        {formatCurrency(amount)}
      </span>
    </div>
  )
}

function Insights() {
  const { transactions } = useStore()

  // Category spending totals
  const categoryTotals = {}
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
    })

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])

  const topCategory = sortedCategories[0]
  const maxSpend = sortedCategories[0]?.[1] || 1

  // Monthly income vs expenses
  const months = ['2026-01', '2026-02', '2026-03', '2026-04']
  const monthLabels = {
    '2026-01': 'Jan', '2026-02': 'Feb',
    '2026-03': 'Mar', '2026-04': 'Apr'
  }

  const monthlyData = months.map(month => {
    const txs = transactions.filter(tx => tx.date.startsWith(month))
    const income = txs
      .filter(tx => tx.type === 'income')
      .reduce((s, tx) => s + tx.amount, 0)
    const expenses = txs
      .filter(tx => tx.type === 'expense')
      .reduce((s, tx) => s + tx.amount, 0)
    return { month: monthLabels[month], income, expenses }
  })

  // Total income vs expenses
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((s, tx) => s + tx.amount, 0)

  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0)

  const savingsRate = totalIncome > 0
    ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
    : 0

  // Month with highest spending
  const highestMonth = [...monthlyData].sort((a, b) => b.expenses - a.expenses)[0]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">Insights</h1>
        <p className="text-slate-400 text-sm mt-1">
          Spending patterns and observations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InsightCard
          icon="◆"
          label="Top Spending Category"
          value={topCategory?.[0] || '—'}
          sub={topCategory ? formatCurrency(topCategory[1]) + ' total' : ''}
        />
        <InsightCard
          icon="◇"
          label="Highest Spend Month"
          value={highestMonth?.month || '—'}
          sub={highestMonth ? formatCurrency(highestMonth.expenses) + ' spent' : ''}
        />
        <InsightCard
          icon="◉"
          label="Overall Savings Rate"
          value={`${savingsRate}%`}
          sub="Of total income saved"
        />
        <InsightCard
          icon="◈"
          label="Total Income"
          value={formatCurrency(totalIncome)}
          sub="Across all months"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-white font-medium mb-1">Spending by Category</p>
          <p className="text-slate-500 text-xs mb-5">All time totals</p>
          {sortedCategories.map(([cat, amt]) => (
            <SpendingBar key={cat} category={cat} amount={amt} max={maxSpend} />
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-white font-medium mb-1">Observations</p>
          <p className="text-slate-500 text-xs mb-5">Auto-generated from your data</p>
          <div className="space-y-3">
            {[
              {
                text: `You spend the most on ${topCategory?.[0]}, accounting for ${((topCategory?.[1] / totalExpenses) * 100).toFixed(0)}% of total expenses.`,
                color: 'text-blue-400'
              },
              {
                text: `Your savings rate is ${savingsRate}% — ${parseFloat(savingsRate) >= 20 ? 'great work, above the recommended 20%!' : 'try to aim for at least 20%.'}`,
                color: 'text-emerald-400'
              },
              {
                text: `${highestMonth?.month} was your highest spending month at ${formatCurrency(highestMonth?.expenses)}.`,
                color: 'text-amber-400'
              },
              {
                text: `Total expenses across all months: ${formatCurrency(totalExpenses)}.`,
                color: 'text-rose-400'
              },
            ].map((obs, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
              >
                <span className={`text-xs font-bold mt-0.5 shrink-0 ${obs.color}`}>◆</span>
                <p className="text-slate-300 text-sm leading-relaxed">{obs.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <p className="text-white font-medium mb-1">Monthly Income vs Expenses</p>
        <p className="text-slate-500 text-xs mb-5">Side by side comparison</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4}>
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
              tickFormatter={(v) => `£${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="income" name="Income" fill="#4f8ef7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f05a7e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Insights