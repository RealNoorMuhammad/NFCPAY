import { useState } from 'react'
import { formatCardNumber, validateVisaCard, validateAmount } from '../utils/cardUtils'
import ErrorMessage from './ErrorMessage'
import './AddMoneyForm.css'

export default function AddMoneyForm({ isOpen, onClose, onAddMoney }) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [showNetworkError, setShowNetworkError] = useState(false)

  if (!isOpen) return null

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only digits
    if (value.length <= 19) {
      setCardNumber(formatCardNumber(value))
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '')
    // Allow only one decimal point
    const parts = value.split('.')
    if (parts.length <= 2) {
      setAmount(value)
    }
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setExpiryDate(value)
  }

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3)
    setCvv(value)
  }

  const handleCardholderChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
    setCardholderName(value)
  }

  const handleClose = () => {
    setCardNumber('')
    setCardholderName('')
    setExpiryDate('')
    setCvv('')
    setAmount('')
    setError(null)
    setShowNetworkError(false)
    setIsProcessing(false)
    onClose()
  }

  const handleSubmit = async (e, isRetry = false) => {
    e.preventDefault()
    setError(null)

    // Validate card number
    const cardValidation = validateVisaCard(cardNumber)
    if (!cardValidation.valid) {
      setError(cardValidation.error)
      return
    }

    // Validate amount
    const amountValidation = validateAmount(amount)
    if (!amountValidation.valid) {
      setError(amountValidation.error)
      return
    }

    setIsProcessing(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Simulate network error on first attempt only
    if (!isRetry && !showNetworkError) {
      setIsProcessing(false)
      setShowNetworkError(true)
      setError('Network error. Please check your connection and try again.')
      return
    }

    // Success - add money
    onAddMoney(amountValidation.value)
    handleClose()
  }

  const handleRetry = () => {
    setError(null)
    handleSubmit({ preventDefault: () => {} }, true)
  }

  return (
    <div className="add-money-modal-overlay" onClick={handleClose}>
      <div className="add-money-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="form-title">Add Money</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-money-form">
          <div className="form-group">
            <label htmlFor="cardNumber" className="form-label">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className="input card-input"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              disabled={isProcessing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardholderName" className="form-label">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholderName"
              className="input"
              placeholder="John Doe"
              value={cardholderName}
              onChange={handleCardholderChange}
              disabled={isProcessing}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                className="input"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                maxLength={5}
                disabled={isProcessing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv" className="form-label">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                className="input"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={3}
                disabled={isProcessing}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount ($)
            </label>
            <input
              type="text"
              id="amount"
              className="input"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              disabled={isProcessing}
              required
            />
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onClose={() => {
                setError(null)
                setShowNetworkError(false)
              }}
              onRetry={showNetworkError ? handleRetry : null}
            />
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary form-cancel"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary form-submit"
              disabled={isProcessing || !cardNumber || !cardholderName || !expiryDate || !cvv || !amount}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Add Money'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

