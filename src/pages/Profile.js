import axios from 'axios'
import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import { Footer, Header, NftSmallCard } from '../components'
import Web3Context from '../store/web3-context'
import conf from '../global/constants'
import { addrsSubStr } from '../global/helper'
import { useRouter } from 'next/router'
import contract_abi from '../abi/abi'
import Web3 from 'web3'
import { ConnectMetaMask } from '../services/MetaMask'
import { Alert } from '../components'
 
function active(active, index) {
  return active == index
    ? 'font-bold text-lg mr-5 '
    : ' text-lg mr-5 text-gray-500'
}

export default function Profile() {
  const web3Ctx = useContext(Web3Context)
  const [user, setUser] = useState()
  const [nfts, setNfts] = useState()
  const [tabIndex, setTabIndex] = useState(0)
  const [withdrawBalance, setWithdrawBalance] = useState(0)
  const [alert, setAlert] = useState()

  const router = useRouter()

  useEffect(() => {
    getUserCollection()
    getUser()
    getTokenBalance()
  }, [web3Ctx.account])

  const getUser = async () => {
    try {
      var response = await axios.get(
        `${conf.api_url}/user/getUser/${sessionStorage.getItem('address')}`,
      )
      setUser(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getUserCollection = async () => {
    try {
      var response = await axios.get(
        `${conf.api_url}/user/getUserNfts/${sessionStorage.getItem('address')}`,
      )
      setNfts(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getTokenBalance() {
    var balance = await contract_abi()
      .methods.availableToWithdraw()
      .call({ from: sessionStorage.getItem('address') })
    const etherValue = Web3.utils.fromWei(balance, 'ether')
    setWithdrawBalance(etherValue)
  }

  async function withdrawUserBalance() {
    const address = sessionStorage.getItem('address')
    if (!address) return null

    contract_abi()
      .methods.withdraw()
      .send({ from: address }, async function (err, res) {
        if (err) {
          console.log('An error occured', err)
          return
        }
        alert('withdraw successfull')
      })
  }

  return (
    <>
      <Header />
      {user && (
        <>
          <div className="bg-sky-100 h-40 relative">
            <div className="left-10 rounded-full flex-none absolute -bottom-5 overflow-hidden border-8 border-white shadow-lg">
              <img
                src={`https://avatars.dicebear.com/api/miniavs/${user.address}.svg`}
                className="w-28 h-28"
              />
            </div>
          </div>
          <div className="py-10 px-10 pb-0">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <a className="text-blue-500" href="">
              {addrsSubStr(user.address)}
            </a>
          </div>
        </>
      )}

      {/* Withdraw Balance */}
      {withdrawBalance > 0 && (
        <div className="inline-flex items-center mx-10 mt-4 border-orange-500 border">
          <img src={conf.coin_icon} className="w-5 h-5 ml-2" />
          <p className="p-3 font-bold">{withdrawBalance}</p>
          <button
            className="px-10 bg-orange-500 border p-3 border-orange-500  hover:bg-white hover:text-orange-500 text-white"
            onClick={() => withdrawUserBalance()}
          >
            Withdraw
          </button>
        </div>
      )}

      <div className="mx-10 my-5">
        <button onClick={() => setTabIndex(0)}>
          <p className={active(tabIndex, 0)}>Collected</p>
        </button>
        <button onClick={() => setTabIndex(1)}>
          <p className={active(tabIndex, 1)}>Created</p>
        </button>
        <button onClick={() => router.push('CreateColl')}>
          <p className={active(tabIndex, 2)}>Create Collection</p>
        </button>
        <button onClick={() => setTabIndex(3)}>
          <p className={active(tabIndex, 3)}>Settings</p>
        </button>
      </div>
      {/* TABS 2*/}
      {tabIndex == 0 && (
        <div className="grid grid-cols-4 gap-8 px-10 py-5">
          {nfts &&
            user &&
            nfts.map((item, key) => {
              if (item.createdBy != user.address)
                return <NftSmallCard key={key} {...item} user={user.username} />
            })}
        </div>
      )}
      {/* TABS */}
      {tabIndex == 1 && (
        <div className="grid grid-cols-4 gap-8 px-10 py-5">
          {nfts &&
            user &&
            nfts.map((item, key) => {
              if (item.createdBy == user.address)
                return <NftSmallCard key={key} {...item} user={user.username} />
            })}
        </div>
      )}

      <div>
        {tabIndex == 3 && (
          <button
            className="px-10 text-red-500 border mx-10 p-3 border-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => {
              sessionStorage.removeItem('address')
              window.location.reload()
            }}
          >
            Log Out
          </button>
        )}
      </div>

      {!user && (
        <div className='flex'>

        <button
          className="m-auto px-10 bg-blue-500 border p-3 border-blue-500  hover:bg-white hover:text-blue-500 text-white"
          onClick={async() =>  await ConnectMetaMask().then((result) => {
            if (result != undefined && result != null) {
              web3Ctx.loadAccount(result)
              setAlert({
                show: true,
                title: 'Wallet Connected',
                type: 'success',
                message: 'account connected successfully',
              })
            }
          })}
          >
          Connect Wallet
        </button>
          </div>
      )}
      <Footer />
    </>
  )
}
