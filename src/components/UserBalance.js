import React, { useContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import { ConnectMetaMask } from '../services/MetaMask'
import Web3Context from '../store/web3-context'

export default function UserBalance() {
  const web3Ctx = useContext(Web3Context)
  const [balance, setBalance] = useState(0)
  useEffect(() => {
    getBalance()
  }, [web3Ctx.account])

  async function getBalance() {
    var address = sessionStorage.getItem('address')
    if (!address) {
      await ConnectMetaMask().then((result) => {
        if (result != undefined && result != null) {
          web3Ctx.loadAccount(result)
        }
      })
    }
    if (
      typeof window.ethereum !== 'undefined' &&
      sessionStorage.getItem('address') != null
    ) {
      // Instance web3 with the provided information
      var web3 = new Web3(window.ethereum)
      //   var accounts = await web3.eth.getAccounts()
      var balance = await web3.eth.getBalance(sessionStorage.getItem('address'))
      setBalance(web3.utils.fromWei(balance))
      try {
        // Request account access
        await window.ethereum.enable()
        return true
      } catch (e) {
        // User denied access
        return false
      }
    }
  }

  return (
    <div>
      balance: {Math.round((parseFloat(balance) + Number.EPSILON) * 100) / 100}
    </div>
  )
}
