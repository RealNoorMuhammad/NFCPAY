import { useState, useRef, useEffect } from 'react'
import './QRScanner.css'

export default function QRScanner({ isOpen, onClose, onScanSuccess }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // 'environment' = back, 'user' = front

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode)
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode])

  const startCamera = async (mode = 'environment') => {
    try {
      setError(null)
      setIsScanning(true)

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Start scanning after video is ready
      videoRef.current.addEventListener('loadedmetadata', () => {
        scanQRCode()
      }, { once: true })
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please allow camera permissions.')
      setIsScanning(false)
    }
  }

  const flipCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newMode)
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        // Simple QR code detection simulation
        // In a real app, you'd use jsQR or html5-qrcode library
        // For now, we'll simulate scanning
        requestAnimationFrame(scan)
      } else {
        requestAnimationFrame(scan)
      }
    }

    scan()
  }

  const handleManualInput = () => {
    // Simulate QR scan result
    const mockQRData = prompt('Enter QR code data (or scan with camera):')
    if (mockQRData) {
      onScanSuccess(mockQRData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="qr-scanner-overlay" onClick={onClose}>
      <div className="qr-scanner-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="qr-scanner-header">
          <h3 className="qr-scanner-title">Tag Scanner</h3>
          <button className="qr-scanner-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="qr-scanner-content">
          {error ? (
            <div className="qr-scanner-error">
              <p>{error}</p>
              <button className="btn btn-secondary" onClick={handleManualInput}>
                Enter Manually
              </button>
            </div>
          ) : (
            <>
              <div className="qr-scanner-status">
                <div className="qr-scanner-icon-wrapper">
                  <div className="qr-scanner-icon-glow"></div>
                  <div className="qr-scanner-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2.5"/>
                      <path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h4 className="qr-ready-text">Ready to Scan QR</h4>
                <p className="qr-instruction">Position the QR code within the frame</p>
                <div className="qr-scanning-indicator">
                  <span className="qr-pulse-dot"></span>
                  <span>Scanning...</span>
                </div>
              </div>

              <div className="qr-scanner-view">
                <video
                  ref={videoRef}
                  className="qr-video"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="qr-canvas" />
                <div className="qr-scan-frame">
                  <div className="qr-scan-line"></div>
                  <div className="qr-corner qr-corner-tl">
                    <div className="qr-corner-inner"></div>
                  </div>
                  <div className="qr-corner qr-corner-tr">
                    <div className="qr-corner-inner"></div>
                  </div>
                  <div className="qr-corner qr-corner-bl">
                    <div className="qr-corner-inner"></div>
                  </div>
                  <div className="qr-corner qr-corner-br">
                    <div className="qr-corner-inner"></div>
                  </div>
                </div>
                <div className="qr-overlay-top"></div>
                <div className="qr-overlay-bottom"></div>
                <div className="qr-overlay-left"></div>
                <div className="qr-overlay-right"></div>
                <button
                  className="qr-flip-camera-btn"
                  onClick={flipCamera}
                  title={facingMode === 'environment' ? 'Switch to front camera' : 'Switch to back camera'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 19V5C23 3.9 22.1 3 21 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H21C22.1 21 23 20.1 23 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 8L22 4L18 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <button
                className="btn btn-secondary qr-manual-btn"
                onClick={handleManualInput}
              >
                Enter QR Code Manually
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

