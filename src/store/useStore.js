import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { transactions as initialTransactions } from '../data/transactions'
import { api } from '../data/api'

const useStore = create(
  persist(
    (set, get) => ({

      transactions: initialTransactions,

      loading: false,
      error: null,
      apiLoaded: false,

      fetchTransactions: async () => {
        const { apiLoaded } = get()
        if (apiLoaded) return

        set({ loading: true, error: null })
        try {
          const data = await api.getTransactions()
          set({ transactions: data, loading: false, apiLoaded: true })
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      role: 'viewer',
      setRole: (role) => set({ role }),

      filterType: 'all',
      filterCategory: 'all',
      searchQuery: '',

      setFilterType:     (val) => set({ filterType: val }),
      setFilterCategory: (val) => set({ filterCategory: val }),
      setSearchQuery:    (val) => set({ searchQuery: val }),

      addTransaction: (tx) => set((state) => ({
        transactions: [
          ...state.transactions,
          { ...tx, id: Date.now() }
        ]
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(tx => tx.id !== id)
      })),

      resetTransactions: () => set({
        transactions: initialTransactions,
        apiLoaded: false
      }),

      getFilteredTransactions: () => {
        const { transactions, filterType, filterCategory, searchQuery } = get()
        return transactions.filter((tx) => {
          const matchesType =
            filterType === 'all' || tx.type === filterType
          const matchesCategory =
            filterCategory === 'all' || tx.category === filterCategory
          const matchesSearch =
            tx.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.category.toLowerCase().includes(searchQuery.toLowerCase())
          return matchesType && matchesCategory && matchesSearch
        })
      },

    }),
    {
      name: 'zorvyn-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        apiLoaded: state.apiLoaded,
      }),
    }
  )
)

export default useStore