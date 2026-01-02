
export function formatCardNumber(value) {
  const cleaned = value.replace(/\s/g, '')
  const chunks = cleaned.match(/.{1,4}/g) || []
  return chunks.join(' ')
}

export function validateVisaCard(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '')
  

  if (!cleaned.startsWith('4')) {
    return { valid: false, error: 'Visa cards must start with 4' }
  }
  

  if (!/^\d{13,19}$/.test(cleaned)) {
    return { valid: false, error: 'Card number must be 13-19 digits' }
  }
  

  if (!luhnCheck(cleaned)) {
    return { valid: false, error: 'Invalid card number' }
  }
  
  return { valid: true }
}


function luhnCheck(cardNumber) {
  let sum = 0
  let isEven = false
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}


export function validateAmount(amount) {
  const num = parseFloat(amount)
  
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' }
  }
  
  if (num > 10000) {
    return { valid: false, error: 'Amount cannot exceed $10,000' }
  }
  
  return { valid: true, value: num }
}



