# FinLens — Finance Dashboard UI

A clean, interactive finance dashboard built as part of a frontend internship assignment. Allows users to track financial activity, explore transactions, and understand spending patterns through visualizations.

---

## Tech Stack

- **React 18** — component-based UI
- **Vite** — build tool and dev server
- **Tailwind CSS** — utility-first styling
- **Recharts** — charting library (line, bar, donut)
- **Zustand** — lightweight state management with localStorage persistence

---

## Features

### Dashboard
- Summary cards: Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- Balance Trend line chart (running balance across months)
- Spending Breakdown donut chart (expenses by category)

### Transactions
- Full transaction table with date, description, category, type, and amount
- Filter by type (all / income / expense) and by category
- Text search across description and category
- Sortable columns (date, amount)
- Export to CSV or JSON

### Insights
- Top spending category
- Highest spending month
- Overall savings rate
- Monthly Income vs Expenses bar chart
- Spending by category with proportional bars
- Auto-generated observations from the data

### Role-Based UI
- **Viewer** — read-only access
- **Admin** — can add new transactions and delete existing ones
- Role switcher in the sidebar (no login required, frontend simulation)

### Optional Enhancements Implemented
- Dark mode (default theme)
- localStorage persistence via Zustand `persist` middleware
- Mock API with simulated network delay, loading state, and error/retry handling
- Smooth page transition animations
- CSV and JSON export

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation

```bash
git clone https://github.com/your-username/finlens.git
cd finlens
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── Charts.jsx        # BalanceTrendChart and SpendingDonutChart
│   ├── Layout.jsx        # App shell with sidebar and page transitions
│   ├── LoadingScreen.jsx # Loading spinner shown during data fetch
│   └── Sidebar.jsx       # Navigation and role switcher
├── pages/
│   ├── Dashboard.jsx     # Overview with summary cards and charts
│   ├── Transactions.jsx  # Transaction table with filters and modals
│   └── Insights.jsx      # Spending analysis and visualizations
├── store/
│   └── useStore.js       # Zustand store (transactions, filters, role)
├── data/
│   ├── transactions.js   # Static mock transaction data
│   └── api.js            # Mock API with simulated delay
└── utils/
    └── formatters.js     # Currency, date formatting and export helpers
```

---

## Design Decisions

- **Zustand over Context/Redux** — simple API, minimal boilerplate, and built-in persistence support made it the right fit for this scale
- **Static mock data + mock API layer** — separating the data source from the store mirrors how a real API integration would work, making it straightforward to swap in a real endpoint
- **Role simulation on the frontend** — as specified in the brief, no backend auth; roles are stored in state and control which UI elements are rendered
- **Dark theme** — chosen for a finance dashboard context where users may spend extended time reviewing data

---

## Assignment Requirements Coverage

| Requirement | Implemented |
|---|---|
| Dashboard summary cards | ✅ |
| Time-based visualization | ✅ Balance Trend line chart |
| Categorical visualization | ✅ Spending donut chart |
| Transaction list with details | ✅ |
| Filtering and search | ✅ Type, category, text search |
| Sorting | ✅ Date and amount |
| Role-based UI (viewer/admin) | ✅ |
| Insights section | ✅ |
| State management | ✅ Zustand |
| Empty state handling | ✅ |
| Data persistence | ✅ localStorage |
| Mock API integration | ✅ |
| Export functionality | ✅ CSV and JSON |
| Animations and transitions | ✅ |
