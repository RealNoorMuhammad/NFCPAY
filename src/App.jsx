import { useState } from 'react'
import { useBalance } from './hooks/useBalance'
import { useTransactions } from './hooks/useTransactions'
import Background3D from './components/Background3D'
import NFCScanner from './components/NFCScanner'
import PaymentProcessing from './components/PaymentProcessing'
import PaymentSuccess from './components/PaymentSuccess'
import AddMoneyForm from './components/AddMoneyForm'
import SendMoneyForm from './components/SendMoneyForm'
import ErrorMessage from './components/ErrorMessage'
import Footer from './components/Footer'
import './App.css'

function App() {
  const { balance, deduct, add } = useBalance()
  const { transactions, addTransaction, clearTransactions } = useTransactions()
  
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

  if (view === 'processing' && currentTransaction) {
    return (
      <div className="app">
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
      <Background3D />
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">NFCPAY</h1>
          <p className="app-subtitle">NFC Payment Simulator</p>
        </header>

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
          </div>

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
    
    </div>
  )
}

export default App

