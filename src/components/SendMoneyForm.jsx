import { useState } from 'react'
import { validateAmount } from '../utils/cardUtils'
import ErrorMessage from './ErrorMessage'
import QRScanner from './QRScanner'
import './SendMoneyForm.css'

export default function SendMoneyForm({ balance, onSendMoney }) {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [showQRScanner, setShowQRScanner] = useState(false)

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '')
 
    const parts = value.split('.')
    if (parts.length <= 2) {
      setAmount(value)
    }
  }

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value)
  }

  const handleQRScan = (qrData) => {

    setRecipient(qrData)
    setShowQRScanner(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)


    if (!recipient.trim()) {
      setError('Please enter recipient name or NFC destination')
      return
    }


    const amountValidation = validateAmount(amount)
    if (!amountValidation.valid) {
      setError(amountValidation.error)
      return
    }


    if (balance <= 0) {
      setError('Need to add money first')
      return
    }


    if (amountValidation.value > balance) {
      setError('Need to add money first')
      return
    }

    setIsProcessing(true)


    await new Promise(resolve => setTimeout(resolve, 2000))


    onSendMoney({
      merchant: recipient.trim(),
      amount: amountValidation.value
    })


    setAmount('')
    setRecipient('')
    setIsProcessing(false)
  }

  const hasBalance = balance > 0

  return (
    <div className="send-money-form glass fade-in">
      <h3 className="form-section-title">Send Money via NFC</h3>
      {!hasBalance && (
        <div className="deposit-warning">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p>You need to deposit money first before sending payments.</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-row-send">
          <div className="form-group">
            <label htmlFor="sendAmount" className="form-label">
              Amount ($)
            </label>
            <input
              type="text"
              id="sendAmount"
              className="input"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              disabled={isProcessing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipient" className="form-label">
              Recipient / NFC Tag
            </label>
            <input
              type="text"
              id="recipient"
              className="input"
              placeholder="Enter name or NFC destination"
              value={recipient}
              onChange={handleRecipientChange}
              disabled={isProcessing}
              required
            />
          </div>
        </div>

        <div className="qr-scanner-button-container">
          <button
            type="button"
            className="btn btn-secondary qr-scanner-button"
            onClick={() => setShowQRScanner(true)}
            disabled={isProcessing}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Tag Scanner
          </button>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError(null)}
          />
        )}

        <button
          type="submit"
          className="btn btn-primary form-submit-send"
          disabled={isProcessing || !amount || !recipient}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Send Payment
            </>
          )}
        </button>
      </form>

      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScan}
      />
    </div>
  )
}

