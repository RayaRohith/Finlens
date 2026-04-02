export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map(tx => [
    tx.date,
    `"${tx.desc}"`,
    tx.category,
    tx.type,
    tx.amount.toFixed(2)
  ])

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'zorvyn-transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToJSON(transactions) {
  const json = JSON.stringify(transactions, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'zorvyn-transactions.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function groupByMonth(transactions) {
  const groups = {}
  transactions.forEach(tx => {
    const month = tx.date.slice(0, 7)
    if (!groups[month]) groups[month] = []
    groups[month].push(tx)
  })
  return Object.entries(groups)
    .sort((a, b) => b[0].localeCompare(a[0]))
}

export function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  const labels = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ]
  return `${labels[parseInt(month) - 1]} ${year}`
}