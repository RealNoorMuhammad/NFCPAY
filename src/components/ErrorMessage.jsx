import './ErrorMessage.css'

export default function ErrorMessage({ message, onClose, onRetry }) {
  return (
    <div className="error-message glass fade-in">
      <div className="error-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="error-content">
        <h3 className="error-title">Error</h3>
        <p className="error-text">{message || 'An unexpected error occurred'}</p>
      </div>
      <div className="error-actions">
        {onRetry && (
          <button className="btn btn-primary error-retry" onClick={onRetry}>
            Retry
          </button>
        )}
        {onClose && (
          <button className="btn btn-secondary error-close" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  )
}


