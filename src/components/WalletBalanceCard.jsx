import { useEffect, useState } from 'react'
import './WalletBalanceCard.css'

export default function WalletBalanceCard({ publicKey, balance, onDisconnect, onRefresh }) {
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNetworkError, setShowNetworkError] = useState(false)

  const truncateAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatBalance = (bal) => {
    if (bal === null || bal === undefined) return '0.00'
    return bal.toFixed(4)
  }

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    if (publicKey && onRefresh) {
      const interval = setInterval(() => {
        onRefresh()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [publicKey, onRefresh])

  const handleDeposit = async () => {
    setShowDepositModal(true)
    setIsLoading(true)
    setShowNetworkError(false)

    // Simulate loading for 2-3 seconds
    setTimeout(() => {
      setIsLoading(false)
      setShowNetworkError(true)
    }, 2500)
  }

  const handleCloseModal = () => {
    setShowDepositModal(false)
    setIsLoading(false)
    setShowNetworkError(false)
  }

  if (!publicKey) return null

  return (
    <>
      <div className="wallet-balance-card glass">
        <div className="wallet-balance-header">
          <div className="wallet-status">
            <div className="wallet-status-indicator"></div>
            <span className="wallet-status-text">Connected</span>
          </div>
          <button
            className="wallet-refresh-btn"
            onClick={onRefresh}
            title="Refresh balance"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4V10H7M23 20V14H17M17 14L21 10C21.5 9.5 21.5 8.5 21 8M17 14L13 18C12.5 18.5 11.5 18.5 11 18M3 20L7 16C7.5 15.5 8.5 15.5 9 16M3 20L9 14M3 4L9 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="wallet-address">
          <span className="wallet-address-label">Wallet Address:</span>
          <span className="wallet-address-value" title={publicKey}>
            {truncateAddress(publicKey)}
          </span>
        </div>

        <div className="wallet-balance">
          <span className="wallet-balance-label">Balance:</span>
          <div className="wallet-balance-value">
            <span className="wallet-balance-amount">{formatBalance(balance)}</span>
            <span className="wallet-balance-currency">SOL</span>
          </div>
        </div>

        <div className="wallet-actions">
          <button
            className="btn btn-primary wallet-deposit-btn"
            onClick={handleDeposit}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Deposit
          </button>
          <button
            className="btn btn-secondary wallet-disconnect-btn"
            onClick={onDisconnect}
          >
            Disconnect Wallet
          </button>
        </div>
      </div>

      {showDepositModal && (
        <div className="deposit-modal-overlay" onClick={handleCloseModal}>
          <div className="deposit-modal glass" onClick={(e) => e.stopPropagation()}>
            {isLoading ? (
              <div className="deposit-loading-content">
                <div className="deposit-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <h2 className="deposit-loading-title">Processing Deposit</h2>
                <p className="deposit-loading-subtitle">Please wait...</p>
              </div>
            ) : showNetworkError ? (
              <div className="deposit-error-content">
                <div className="deposit-error-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="deposit-error-title">Network Error</h2>
                <p className="deposit-error-message">Unable to process deposit. Please check your connection and try again.</p>
                <button
                  className="btn btn-primary deposit-close-btn"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}

