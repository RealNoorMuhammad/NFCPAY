import { useState, useEffect } from 'react'

const STORAGE_KEY = 'nfcpay_balance'
const DEFAULT_BALANCE = 0.00

export function useBalance() {
  const [balance, setBalance] = useState(DEFAULT_BALANCE)

  useEffect(() => {
    // Load balance from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      const parsed = parseFloat(stored)
      if (!isNaN(parsed)) {
        setBalance(parsed)
      }
    } else {
      // Initialize with default balance
      localStorage.setItem(STORAGE_KEY, DEFAULT_BALANCE.toString())
    }
  }, [])

  const updateBalance = (newBalance) => {
    const rounded = Math.round(newBalance * 100) / 100
    setBalance(rounded)
    localStorage.setItem(STORAGE_KEY, rounded.toString())
  }

  const deduct = (amount) => {
    const newBalance = balance - amount
    if (newBalance >= 0) {
      updateBalance(newBalance)
      return true
    }
    return false
  }

  const add = (amount) => {
    const newBalance = balance + amount
    updateBalance(newBalance)
  }

  const reset = () => {
    updateBalance(DEFAULT_BALANCE)
  }

  return {
    balance,
    deduct,
    add,
    reset,
    updateBalance
  }
}

