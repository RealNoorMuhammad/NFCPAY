import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" className="navbar-back-button" aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        
        <div className="navbar-logo">
          <span className="navbar-logo-text">NFCPAY</span>
        </div>
        
        <div className="navbar-right"></div>
      </div>
    </nav>
  )
}

export default Navbar

