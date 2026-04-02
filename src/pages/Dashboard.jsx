import useStore from '../store/useStore'
import { BalanceTrendChart, SpendingDonutChart } from '../components/Charts'
import { formatCurrency } from '../utils/formatters'

function StatCard({ label, value, change, accent, delay }) {
  return (
    <div
      className="bg-slate-900 rounded-2xl p-5 border border-slate-800 animate-fadein-up"
      style={{ animationDelay: delay }}
    >
      <div className="w-8 h-1 rounded-full mb-4" style={{ background: accent }}></div>
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">{label}</p>
      <p className="text-white text-2xl font-semibold font-mono">{value}</p>
      <p className="text-slate-500 text-xs mt-2">{change}</p>
    </div>
  )
}

function Dashboard() {
  const { transactions } = useStore()

  const currentMonth = '2026-04'

  const monthlyTxs = transactions.filter(tx =>
    tx.date.startsWith(currentMonth)
  )

  const income = monthlyTxs
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const expenses = monthlyTxs
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const balance = transactions.reduce((sum, tx) =>
    tx.type === 'income' ? sum + tx.amount : sum - tx.amount, 0
  )

  const savingsRate = income > 0
    ? (((income - expenses) / income) * 100).toFixed(1)
    : 0

  return (
    <div>
      <div className="mb-8 animate-fadein-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-white text-2xl font-semibold">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">April 2026 - financial summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Balance"
          value={formatCurrency(balance)}
          change="All time"
          accent="#4f8ef7"
          delay="75ms"
        />
        <StatCard
          label="Monthly Income"
          value={formatCurrency(income)}
          change="▲ This month"
          accent="#52c496"
          delay="150ms"
        />
        <StatCard
          label="Monthly Expenses"
          value={formatCurrency(expenses)}
          change="▼ This month"
          accent="#f05a7e"
          delay="225ms"
        />
        <StatCard
          label="Savings Rate"
          value={`${savingsRate}%`}
          change="Of income saved"
          accent="#f5a623"
          delay="300ms"
        />
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadein-up"
        style={{ animationDelay: '375ms' }}
      >
        <BalanceTrendChart />
        <SpendingDonutChart />
      </div>
    </div>
  )
}

export default Dashboard