import { useState, useEffect } from 'react'
import { useBalance } from './hooks/useBalance'
import { useTransactions } from './hooks/useTransactions'
import { useSolanaWallet } from './hooks/useSolanaWallet'
import Background3D from './components/Background3D'
import Navbar from './components/Navbar'
import NFCScanner from './components/NFCScanner'
import PaymentProcessing from './components/PaymentProcessing'
import PaymentSuccess from './components/PaymentSuccess'
import AddMoneyForm from './components/AddMoneyForm'
import SendMoneyForm from './components/SendMoneyForm'
import WalletBalanceCard from './components/WalletBalanceCard'
import ErrorMessage from './components/ErrorMessage'
import Footer from './components/Footer'
import './App.css'

function App() {
  const { balance, deduct, add } = useBalance()
  const { transactions, addTransaction, clearTransactions } = useTransactions()
  const {
    isConnected,
    publicKey,
    balance: solBalance,
    isLoading: walletLoading,
    error: walletError,
    connect: connectWallet,
    disconnect: disconnectWallet,
    refreshBalance: refreshWalletBalance
  } = useSolanaWallet()
  
  const [view, setView] = useState('main') // 'main', 'processing', 'success'
  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [error, setError] = useState(null)
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)

  const handleNFCSuccess = (data) => {
    if (data.amount > balance) {
      setError('Insufficient balance. Please add money to your account.')
      return
    }

    setCurrentTransaction(data)
    setView('processing')

    // Simulate processing delay
    setTimeout(() => {
      const success = deduct(data.amount)
      if (success) {
        const transaction = addTransaction({
          merchant: data.merchant,
          amount: data.amount,
          type: 'payment'
        })
        setCurrentTransaction(transaction)
        setView('success')
      } else {
        setError('Payment failed. Insufficient balance.')
        setView('main')
      }
    }, 2500)
  }

  const handleNFCError = (errorMessage) => {
    setError(errorMessage)
    setView('main')
  }

  const handleAddMoney = (amount) => {
    add(amount)
    addTransaction({
      merchant: 'Visa Card',
      amount: amount,
      type: 'add'
    })
    setShowAddMoneyModal(false)
  }

  const handleSendMoney = (data) => {
    if (data.amount > balance) {
      setError('Insufficient balance. Please add money to your account.')
      return
    }

    setCurrentTransaction(data)
    setView('processing')

    // Simulate processing delay
    setTimeout(() => {
      const success = deduct(data.amount)
      if (success) {
        const transaction = addTransaction({
          merchant: data.merchant,
          amount: data.amount,
          type: 'payment'
        })
        setCurrentTransaction(transaction)
        setView('success')
      } else {
        setError('Payment failed. Insufficient balance.')
        setView('main')
      }
    }, 2500)
  }

  const handleCloseSuccess = () => {
    setView('main')
    setCurrentTransaction(null)
  }

  const handleCloseError = () => {
    setError(null)
  }

  const handleConnectWallet = async () => {
    setError(null) // Clear any previous errors
    const success = await connectWallet()
    // Error will be synced via useEffect when walletError changes
    if (!success && !walletError) {
      // Fallback if no error was set
      setError('Failed to connect wallet. Please make sure Phantom wallet is installed and try again.')
    }
  }

  const handleDisconnectWallet = async () => {
    await disconnectWallet()
    setError(null) // Clear error when disconnecting
  }

  // Sync wallet errors with app error state (but clear if balance is successfully fetched)
  useEffect(() => {
    if (walletError) {
      // Only show connection errors, not balance fetch errors
      if (walletError.includes('Failed to fetch balance')) {
        // Don't show balance fetch errors - they're not critical
        // Clear any existing error if balance is loaded
        if (solBalance !== null) {
          setError(null)
        }
        return
      }
      setError(walletError)
    } else if (isConnected && solBalance !== null) {
      // Clear error if wallet is connected and balance is loaded
      setError(null)
    }
  }, [walletError, isConnected, solBalance])

  if (view === 'processing' && currentTransaction) {
    return (
      <div className="app">
        <Navbar />
        <Background3D />
        <div className="app-container">
          <PaymentProcessing
            merchant={currentTransaction.merchant}
            amount={currentTransaction.amount}
          />
        </div>
        <Footer />
      </div>
    )
  }

  if (view === 'success' && currentTransaction) {
    return (
      <div className="app">
        <Navbar />
        <Background3D />
        <div className="app-container">
          <PaymentSuccess
            transaction={currentTransaction}
            onClose={handleCloseSuccess}
          />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar />
      <Background3D />
      <div className="app-container">
        <main className="app-main">
          {error && (
            <ErrorMessage
              message={error}
              onClose={handleCloseError}
            />
          )}

          <NFCScanner
            onScanSuccess={handleNFCSuccess}
            onError={handleNFCError}
          />

          <div className="add-money-button-container">
            <button
              className="btn btn-primary add-money-button"
              onClick={() => setShowAddMoneyModal(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Money
            </button>
            <button
              className="btn btn-secondary wallet-connect-button"
              onClick={handleConnectWallet}
              disabled={walletLoading || isConnected}
            >
              {walletLoading ? (
                <>
                  <span className="spinner"></span>
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Connected
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H3M12 21C7.02944 21 3 16.9706 3 12M12 21C13.6569 21 15 16.9706 15 12C15 7.02944 13.6569 3 12 3M12 21C10.3431 21 9 16.9706 9 12C9 7.02944 10.3431 3 12 3M3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          </div>

          {isConnected && (
            <WalletBalanceCard
              publicKey={publicKey}
              balance={solBalance}
              onDisconnect={handleDisconnectWallet}
              onRefresh={refreshWalletBalance}
            />
          )}

          <SendMoneyForm
            balance={balance}
            onSendMoney={handleSendMoney}
          />

          <AddMoneyForm
            isOpen={showAddMoneyModal}
            onClose={() => setShowAddMoneyModal(false)}
            onAddMoney={handleAddMoney}
          />
        </main>
      </div>
    <Footer/>
    </div>
  )
}

export default App

