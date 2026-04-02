function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-slate-300 text-sm font-medium">Fetching transaction data</p>
        <p className="text-slate-600 text-xs mt-1">Connecting to Zorvyn ledger...</p>
      </div>
    </div>
  )
}

export default LoadingScreen