import { useState, useEffect } from 'react'

const STORAGE_KEY = 'nfcpay_transactions'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // Load transactions from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setTransactions(parsed)
      } catch (e) {
        console.error('Error parsing transactions:', e)
      }
    }
  }, [])

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      timestamp: new Date().toISOString()
    }
    const updated = [newTransaction, ...transactions]
    setTransactions(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return newTransaction
  }

  const clearTransactions = () => {
    setTransactions([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    transactions,
    addTransaction,
    clearTransactions
  }
}



