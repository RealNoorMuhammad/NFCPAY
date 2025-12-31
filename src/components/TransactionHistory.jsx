import './TransactionHistory.css'

export default function TransactionHistory({ transactions, onClear }) {
  if (transactions.length === 0) {
    return (
      <div className="transaction-history glass fade-in">
        <div className="history-header">
          <h2 className="history-title">Transaction History</h2>
        </div>
        <div className="empty-history">
          <p>No transactions yet</p>
          <p className="empty-subtitle">Your payment history will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="transaction-history glass fade-in">
      <div className="history-header">
        <h2 className="history-title">Transaction History</h2>
        {onClear && (
          <button className="btn btn-secondary clear-button" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <div className="history-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-main">
              <div className="transaction-info">
                <div className="transaction-merchant">{transaction.merchant}</div>
                <div className="transaction-date">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type === 'add' ? 'positive' : 'negative'}`}>
                {transaction.type === 'add' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
            </div>
            <div className="transaction-id">ID: {transaction.id.slice(-8)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

