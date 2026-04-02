# FinLens - Finance Dashboard UI

A clean, interactive finance dashboard built as part of a frontend internship assignment. Allows users to track financial activity, explore transactions, and understand spending patterns through visualizations.

---

## Tech Stack

- **React 18** - component-based UI
- **Vite** - build tool and dev server
- **Tailwind CSS** - utility-first styling
- **Recharts** - charting library (line, bar, donut)
- **Zustand** - lightweight state management with localStorage persistence

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
- **Viewer** - read-only access
- **Admin** - can add new transactions and delete existing ones
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

- **Zustand over Context/Redux** - I went with Zustand because it's straightforward to set up and the built-in persist middleware handled localStorage without any extra wiring. For a project at this scale it felt like the right call.
- **Mock API layer** - Instead of importing the data directly into the store, I kept a separate api.js that simulates a real network request with a delay. That way swapping in a real endpoint later is just a one-line change.
- **Role simulation on the frontend** - Roles are stored in state and control what the UI renders. No auth logic, just enough to demonstrate the viewer/admin difference as the brief asked for.
- **Dark theme** - Finance dashboards tend to be something people stare at for a while, so a dark UI felt like the more comfortable choice over a bright one.

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
