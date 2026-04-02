import { useState } from 'react'
import useStore from '../store/useStore'
import { CATEGORIES, CATEGORY_COLORS } from '../data/transactions'
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from '../utils/formatters'

function DeleteConfirmModal({ transaction, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm mx-4">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-lg">
            ⚠
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">Confirm Deletion</h2>
            <p className="text-slate-500 text-xs">This action cannot be undone</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 mb-5 border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
            Transaction to be removed
          </p>
          <p className="text-white text-sm font-medium">{transaction.desc}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-slate-400 text-xs">{formatDate(transaction.date)}</span>
            <span className={`text-sm font-mono font-medium
              ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed mb-5">
          You are about to permanently remove this transaction record from the Zorvyn ledger.
          Please confirm that you wish to proceed with this irreversible action.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-all"
          >
            Remove Transaction
          </button>
        </div>

      </div>
    </div>
  )
}

function AddTransactionModal({ onClose }) {
  const { addTransaction } = useStore()
  const [form, setForm] = useState({
    desc: '',
    amount: '',
    date: '',
    type: 'expense',
    category: 'Food',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (!form.desc || !form.amount || !form.date) return
    addTransaction({
      ...form,
      amount: parseFloat(form.amount),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-white font-semibold text-lg mb-5">Add Transaction</h2>
        <div className="space-y-3">
          <input
            name="desc"
            placeholder="Description"
            value={form.desc}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            name="amount"
            type="number"
            placeholder="Amount (£)"
            value={form.amount}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function CategoryPill({ category }) {
  const color = CATEGORY_COLORS[category] || '#8a93a8'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: `${color}20`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}></span>
      {category}
    </span>
  )
}

function Transactions() {
  const {
    role,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    searchQuery, setSearchQuery,
    getFilteredTransactions,
    deleteTransaction,
  } = useStore()

  const [showModal, setShowModal]         = useState(false)
  const [txToDelete, setTxToDelete]       = useState(null)
  const [sortKey, setSortKey]             = useState('date')
  const [sortDir, setSortDir]             = useState(-1)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir * -1)
    } else {
      setSortKey(key)
      setSortDir(-1)
    }
  }

  const handleDeleteClick = (tx) => {
    setTxToDelete(tx)
  }

  const handleDeleteConfirm = () => {
    deleteTransaction(txToDelete.id)
    setTxToDelete(null)
  }

  const SortIcon = ({ col }) => (
    <span className="text-slate-600 ml-1 text-xs">
      {sortKey === col ? (sortDir === 1 ? '↑' : '↓') : '↕'}
    </span>
  )

  const transactions = getFilteredTransactions().sort((a, b) => {
    if (sortKey === 'amount') return sortDir * (a.amount - b.amount)
    return sortDir * String(a[sortKey]).localeCompare(String(b[sortKey]))
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-semibold">Transactions</h1>
          <p className="text-slate-400 text-sm mt-1">Filter, search and manage</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(transactions)}
            className="border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all"
          >
            ↓ CSV
          </button>
          <button
            onClick={() => exportToJSON(transactions)}
            className="border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm px-4 py-2.5 rounded-xl transition-all"
          >
            ↓ JSON
          </button>
          {role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
          />
          <div className="flex gap-2">
            {['all', 'income', 'expense'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                  ${filterType === type
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className="text-slate-500 text-xs ml-auto">
            {transactions.length} transactions
          </span>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">No transactions found.</p>
            <p className="text-slate-600 text-xs mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th
                  onClick={() => handleSort('date')}
                  className="text-left px-5 py-3.5 text-xs text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                >
                  Date <SortIcon col="date" />
                </th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-5 py-3.5 text-xs text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="text-right px-5 py-3.5 text-xs text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                >
                  Amount <SortIcon col="amount" />
                </th>
                {role === 'admin' && (
                  <th className="px-5 py-3.5 text-xs text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors
                    ${i === transactions.length - 1 ? 'border-none' : ''}`}
                >
                  <td className="px-5 py-3.5 text-slate-400 text-sm font-mono">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-5 py-3.5 text-slate-200 text-sm">
                    {tx.desc}
                  </td>
                  <td className="px-5 py-3.5">
                    <CategoryPill category={tx.category} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium uppercase tracking-wide
                      ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-right text-sm font-mono font-medium
                    ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteClick(tx)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <AddTransactionModal onClose={() => setShowModal(false)} />
      )}
      {txToDelete && (
        <DeleteConfirmModal
          transaction={txToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setTxToDelete(null)}
        />
      )}
    </div>
  )
}

export default Transactions