import { useState, useEffect, useRef } from 'react'
import { readNFCTag, isNFCAvailable } from '../utils/nfcUtils'
import ScanningModal from './ScanningModal'
import './NFCScanner.css'

export default function NFCScanner({ onScanSuccess, onError }) {
  const [isScanning, setIsScanning] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleScan = async () => {
    setIsScanning(true)
    setShowModal(true)

    // Set timeout to show ad blocker error after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsScanning(false)
      setShowModal(false)
      onError('Remove ads blocker from browser to show NFCs')
    }, 5000)

    // Only try to read NFC if available
    if (isNFCAvailable()) {
      try {
        const data = await readNFCTag()
        // Clear the timeout if scan succeeds before 5 seconds
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        setIsScanning(false)
        setShowModal(false)
        onScanSuccess(data)
      } catch (error) {
        // Clear the timeout if there's an error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        setIsScanning(false)
        setShowModal(false)
        onError(error.message)
      }
    }
    // If NFC is not available, the timeout will trigger after 5 seconds
  }

  const handleCloseModal = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsScanning(false)
    setShowModal(false)
  }

  return (
    <>
      <div className="nfc-scanner">
        <button
          className="btn btn-primary nfc-button"
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <span className="spinner"></span>
              Scanning NFC...
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Scan NFC
            </>
          )}
        </button>
      </div>
      <ScanningModal isOpen={showModal} onClose={handleCloseModal} />
    </>
  )
}

