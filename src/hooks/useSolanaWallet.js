import { useState, useEffect, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'

const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com'

export function useSolanaWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [balance, setBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [connection] = useState(() => new Connection(SOLANA_RPC_URL, 'confirmed'))

  // Check if Phantom wallet is installed
  const isPhantomInstalled = () => {
    return typeof window !== 'undefined' && window.solana && window.solana.isPhantom
  }

  // Fetch balance from Solana network
  const fetchBalance = useCallback(async (pubKey) => {
    try {
      if (!pubKey) {
        console.warn('No public key provided for balance fetch')
        return
      }
      
      const publicKeyObj = new PublicKey(pubKey)
      const balanceInLamports = await connection.getBalance(publicKeyObj)
      const balanceInSOL = balanceInLamports / 1_000_000_000 // Convert lamports to SOL
      setBalance(balanceInSOL)
      // Always clear error on successful balance fetch
      setError(null)
      return true
    } catch (err) {
      console.error('Error fetching balance:', err)
      // Don't set error for balance fetch failures - it's not critical
      // The balance will just show as null/loading
      return false
    }
  }, [connection])

  // Connect to Phantom wallet
  const connect = useCallback(async () => {
    try {
      if (!isPhantomInstalled()) {
        const errorMsg = 'Phantom wallet is not installed. Please install it from https://phantom.app'
        setError(errorMsg)
        return false
      }

      setIsLoading(true)
      setError(null)

      // Check if wallet object is available
      if (!window.solana || typeof window.solana.connect !== 'function') {
        throw new Error('Phantom wallet is not properly initialized. Please refresh the page.')
      }

      const response = await window.solana.connect({ onlyIfTrusted: false })
      
      if (!response) {
        throw new Error('No response from wallet')
      }
      
      if (!response.publicKey) {
        throw new Error('Invalid response from wallet: missing public key')
      }
      
      const pubKey = response.publicKey.toString()
      
      if (!pubKey) {
        throw new Error('Failed to get wallet address')
      }
      
      setPublicKey(pubKey)
      setIsConnected(true)
      
      // Fetch initial balance (don't fail connection if balance fetch fails)
      // fetchBalance handles its own errors silently
      await fetchBalance(pubKey)
      
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Error connecting wallet:', err)
      let errorMessage = 'Failed to connect wallet'
      
      // Handle specific error codes
      if (err?.code === 4001) {
        errorMessage = 'User rejected the connection request'
      } else if (err?.code === -32002) {
        errorMessage = 'Connection request already pending. Please check your wallet.'
      } else if (err?.message) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (err?.toString && typeof err.toString === 'function') {
        errorMessage = err.toString()
      } else {
        errorMessage = `Connection failed: ${JSON.stringify(err)}`
      }
      
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [fetchBalance])

  // Disconnect from wallet
  const disconnect = useCallback(async () => {
    try {
      if (window.solana && isConnected) {
        await window.solana.disconnect()
      }
      setPublicKey(null)
      setIsConnected(false)
      setBalance(null)
      setError(null)
    } catch (err) {
      console.error('Error disconnecting wallet:', err)
      setError('Failed to disconnect wallet')
    }
  }, [isConnected])

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (publicKey) {
      await fetchBalance(publicKey)
    }
  }, [publicKey, fetchBalance])

  // Check if already connected on mount
  useEffect(() => {
    if (isPhantomInstalled() && window.solana.isConnected) {
      const pubKey = window.solana.publicKey?.toString()
      if (pubKey) {
        setPublicKey(pubKey)
        setIsConnected(true)
        fetchBalance(pubKey)
      }
    }

    // Listen for account changes
    const handleAccountChange = (publicKey) => {
      if (publicKey) {
        const pubKey = publicKey.toString()
        setPublicKey(pubKey)
        setIsConnected(true)
        fetchBalance(pubKey)
      } else {
        setPublicKey(null)
        setIsConnected(false)
        setBalance(null)
      }
    }

    if (isPhantomInstalled()) {
      window.solana.on('accountChanged', handleAccountChange)
      window.solana.on('disconnect', () => {
        setPublicKey(null)
        setIsConnected(false)
        setBalance(null)
      })
    }

    return () => {
      if (isPhantomInstalled()) {
        window.solana.removeListener('accountChanged', handleAccountChange)
        window.solana.removeListener('disconnect', () => {})
      }
    }
  }, [fetchBalance])

  return {
    isConnected,
    publicKey,
    balance,
    isLoading,
    error,
    connect,
    disconnect,
    refreshBalance,
    isPhantomInstalled: isPhantomInstalled()
  }
}

