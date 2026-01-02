import './BalanceCard.css'

export default function BalanceCard({ balance }) {
  return (
    <div className="balance-card glass fade-in">
      <div className="balance-label">Available Balance</div>
      <div className="balance-amount">
        ${balance.toFixed(2)}
      </div>
      <div className="balance-subtitle">NFCPAY Wallet</div>
    </div>
  )
}



