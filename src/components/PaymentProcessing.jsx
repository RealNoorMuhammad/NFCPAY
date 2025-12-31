import './PaymentProcessing.css'

export default function PaymentProcessing({ merchant, amount }) {
  return (
    <div className="payment-processing fade-in">
      <div className="processing-content glass">
        <div className="processing-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h2 className="processing-title">Processing Payment</h2>
        <div className="processing-details">
          <div className="detail-row">
            <span className="detail-label">Merchant:</span>
            <span className="detail-value">{merchant}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">${amount.toFixed(2)}</span>
          </div>
        </div>
        <div className="processing-status">Please wait...</div>
      </div>
    </div>
  )
}

