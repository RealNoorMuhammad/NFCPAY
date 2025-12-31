import './ScanningModal.css'

export default function ScanningModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="scanning-modal-overlay" onClick={onClose}>
      <div className="scanning-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="scanning-content">
          <div className="scanning-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h2 className="scanning-title">Scanning NFC</h2>
          <p className="scanning-subtitle">Please hold your device near the NFC tag</p>
          <div className="scanning-pulse">
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

