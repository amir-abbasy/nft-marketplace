import Home from './home'
import Profile from './Profile'
import Test from './_test'
import NFTDetails from './NFTDetails/index'
import ConnectWallet from './ConnectWallet'
import CreateNFT from './CreateNFT'
import Explore from './Explore'
import Connect from './connect'



import Web3Provider from '../store/Web3Provider'

export default function App() {
  return (
      <Web3Provider>
        <Home />
      </Web3Provider>
  )
}
