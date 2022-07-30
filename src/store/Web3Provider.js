import { useReducer } from 'react'
import conf from '../global/constants'
import axios from 'axios'
import Web3Context from './web3-context'

const defaultWeb3State = {
  account: null,
  networkId: null,
}
const web3Reducer = (state, action) => {
  if (action.type === 'ACCOUNT') {
    return {
      account: action.account,
      networkId: state.networkId,
    }
  }

  if (action.type === 'LOGOUT') {
    return {
      account: null,
      networkId: null,
    }
  }

  return defaultWeb3State
}

const Web3Provider = (props) => {
  const [web3State, dispatchWeb3Action] = useReducer(
    web3Reducer,
    defaultWeb3State,
  )

  const loadAccountHandler = async (account) => {
    try {
      var response = await axios.post(conf.api_url + '/user/signUp', {
        address: account,
        username: 'user_' + Math.floor(Math.random() * 100000),
        profPic: null,
        nfts: [],
        nftCollections: [],
      })
      // console.log('-ACCOUNT-', response.data)
    } catch (error) {
      console.log("axios:", error)
    }

    dispatchWeb3Action({ type: 'ACCOUNT', account: account })
    sessionStorage.setItem('address', account)
    return account
  }
  const logoutAccountHandler = async () => {
    dispatchWeb3Action({ type: 'LOGOUT' })
  }

  const web3Context = {
    account: web3State.account,
    networkId: web3State.networkId,
    loadAccount: loadAccountHandler,
    logputAccount: logoutAccountHandler,
    // loadNetworkId: loadNetworkIdHandler
  }

  return (
    <Web3Context.Provider value={web3Context}>
      {props.children}
    </Web3Context.Provider>
  )
}

export default Web3Provider
