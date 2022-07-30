
export async function ConnectMetaMask() {
    // check if any wallets are present
    try {
      if (typeof window.ethereum == 'undefined') {
        alert('Wallet is not installed!')
        return
      }
    } catch (checkError) {
      alert('checkError ' + checkError)
      return
    }
  
    // Select metamask as default provder
    if (window.ethereum.providers) {
      var provider = await window.ethereum.providers.find(
        (provider) => provider.isMetaMask,
      )
    } else {
      if (window.ethereum.isMetaMask) {
        provider = window.ethereum
      } else {
        alert('Metamask Wallet is not installed!')
        return
      }
    }
  
    // Ask for connection and get user address from metamask
    try {
      var accounts = await provider.request({ method: 'eth_requestAccounts' })
    } catch (reqError) {
      if (reqError.code === 4001) {
        alert('User rejected the request')
      } else {
        alert(reqError)
      }
      return
    }
    return accounts[0]
  }