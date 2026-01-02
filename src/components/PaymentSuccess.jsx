import './PaymentSuccess.css'

export default function PaymentSuccess({ transaction, onClose }) {
  return (
    <div className="payment-success fade-in">
      <div className="success-content glass">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="success-circle"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="success-check"/>
          </svg>
        </div>
        <h2 className="success-title">Payment Successful!</h2>
        <div className="success-details">
          <div className="detail-row">
            <span className="detail-label">Merchant:</span>
            <span className="detail-value">{transaction.merchant}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value amount">-${transaction.amount.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{new Date(transaction.timestamp).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value id">{transaction.id.slice(-8)}</span>
          </div>
        </div>
        <button className="btn btn-primary success-button" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}


