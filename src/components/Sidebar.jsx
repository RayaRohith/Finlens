import useStore from '../store/useStore'

const navItems = [
  { label: 'Dashboard',    page: 'dashboard',     icon: '◈' },
  { label: 'Transactions', page: 'transactions',  icon: '≡' },
  { label: 'Insights',     page: 'insights',      icon: '◎' },
]

function Sidebar({ currentPage, setCurrentPage }) {
  const { role, setRole } = useStore()

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-slate-900 border-r border-slate-800 flex flex-col py-6 z-50">

      <div className="px-5 mb-8">
        <span className="text-white font-bold text-lg tracking-tight">
          Zor<span className="text-blue-400">vyn</span>
        </span>
        <p className="text-slate-500 text-xs mt-0.5">FinTech Dashboard</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${currentPage === item.page
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 mt-4">
        <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Role</p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-700 text-slate-200 text-sm rounded-lg px-2 py-1.5 border border-slate-600 cursor-pointer"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <p className="text-slate-600 text-xs mt-2">
            {role === 'admin'
              ? '✓ Can add & edit transactions'
              : '✓ Read only access'}
          </p>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar