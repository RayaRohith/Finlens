import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'
import LoadingScreen from './components/LoadingScreen'
import useStore from './store/useStore'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { fetchTransactions, loading, error } = useStore()

  useEffect(() => {
    fetchTransactions()
  }, [])

  const renderPage = () => {
    if (loading) return <LoadingScreen />
    if (error) return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-rose-400 text-sm font-medium">Failed to load transactions</p>
        <p className="text-slate-500 text-xs">{error}</p>
        <button
          onClick={fetchTransactions}
          className="text-blue-400 text-xs border border-blue-400/30 px-4 py-2 rounded-lg hover:bg-blue-400/10 transition-all"
        >
          Retry
        </button>
      </div>
    )

    switch (currentPage) {
      case 'dashboard':    return <Dashboard />
      case 'transactions': return <Transactions />
      case 'insights':     return <Insights />
      default:             return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App