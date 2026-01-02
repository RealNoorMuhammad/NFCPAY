
export function isNFCAvailable() {
  return 'NDEFReader' in window
}


export async function checkAdBlocker() {
  try {

    const test = document.createElement('div')
    test.innerHTML = '&nbsp;'
    test.className = 'adsbox'
    test.style.position = 'absolute'
    test.style.left = '-9999px'
    document.body.appendChild(test)
    

    await new Promise(resolve => setTimeout(resolve, 100))
    const blocked = !document.body.contains(test) || test.offsetHeight === 0
    
    if (test.parentNode) {
      test.parentNode.removeChild(test)
    }
    
    return blocked
  } catch (e) {
    return false
  }
}


export async function readNFCTag() {
  if (!isNFCAvailable()) {
    throw new Error('Web NFC API is not available in this browser. Please use Chrome on Android or Edge on Windows.')
  }

  try {
    const reader = new NDEFReader()
    

    const hasAdBlocker = await checkAdBlocker()
    if (hasAdBlocker) {
      throw new Error('Ad blocker detected. Please disable your ad blocker to use NFC functionality. Web NFC requires certain browser features that may be blocked.')
    }

    await reader.scan()
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('NFC scan timeout. Please try again and make sure your NFC tag is close to your device.'))
      }, 30000) 

      reader.addEventListener('reading', (event) => {
        clearTimeout(timeout)
        try {
          const decoder = new TextDecoder()
          let merchantName = 'Unknown Merchant'
          let amount = 0

  
          for (const record of event.message.records) {
            if (record.recordType === 'text') {
              const text = decoder.decode(record.data)
           
              try {
                const data = JSON.parse(text)
                merchantName = data.merchant || merchantName
                amount = parseFloat(data.amount) || amount
              } catch (e) {
        
                const parts = text.split('|')
                if (parts.length >= 2) {
                  merchantName = parts[0].trim()
                  amount = parseFloat(parts[1].trim()) || amount
                } else {
                  merchantName = text.trim()
                }
              }
            } else if (record.recordType === 'mime' && record.mediaType === 'application/json') {
              const text = decoder.decode(record.data)
              const data = JSON.parse(text)
              merchantName = data.merchant || merchantName
              amount = parseFloat(data.amount) || amount
            }
          }

          if (amount <= 0) {
            reject(new Error('Invalid amount in NFC tag. Amount must be greater than 0.'))
            return
          }

          resolve({
            merchant: merchantName,
            amount: amount
          })
        } catch (error) {
          clearTimeout(timeout)
          reject(new Error(`Error reading NFC data: ${error.message}`))
        }
      })

      reader.addEventListener('readingerror', (error) => {
        clearTimeout(timeout)
        reject(new Error(`NFC reading error: ${error.message || 'Unknown error'}`))
      })
    })
  } catch (error) {
    if (error.message.includes('ad blocker')) {
      throw error
    }
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      throw new Error('NFC permission denied. Please allow NFC access in your browser settings.')
    }
    if (error.name === 'NotSupportedError') {
      throw new Error('NFC is not supported on this device or browser.')
    }
    throw new Error(`Failed to read NFC tag: ${error.message}`)
  }
}


export function simulateNFCTag(merchant = 'Test Merchant', amount = 25.50) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        merchant,
        amount
      })
    }, 1500) 
  })
}




