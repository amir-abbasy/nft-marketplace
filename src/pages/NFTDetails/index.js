import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Web3 from 'web3'

import {
  Header,
  Footer,
  Modal,
  Input,
  UserBalance,
  Alert,
  CurrencyConvert,
} from '../../components'
import ItemActivityTable from './ItemActivityTable'
import MoreFromCollectionTable from './MoreFromCollectionTable'
import conf from '../../global/constants'
import contract_abi from '../../abi/abi'
import { addrsSubStr } from '../../global/helper'
import OffersListTable from './OffersListTable'
import Web3Context from '../../store/web3-context'
import { createVoucher } from '../../services/createVoucher'
import { ConnectMetaMask } from '../../services/MetaMask'

export default function NFTDetails() {
  const web3Ctx = useContext(Web3Context)

  const [token, setToekn] = useState()
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState({
    show: false,
    price: null,
    expireDate: null,
    err: null,
  })
  const [showSellModal, setShowSellModal] = useState({
    show: false,
    price: null,
    expireDate: null,
    err: null,
  })

  const [offersList, setOffersList] = useState()
  const [activityList, setActivityList] = useState()
  const [moreCollection, setMoreCollection] = useState()
  const [alert, setAlert] = useState()

  const router = useRouter()
  const { asset } = router.query

  // console.log("PARAMS", asset);

  useEffect(() => {
    _getToken()
    _getOffersList()
    _getActivityList()
  }, [showSellModal, showBuyModal, showOfferModal, asset, web3Ctx.account])

  useEffect(() => {
    _getMoreCollection()
  }, [token])

  const _getToken = async () => {
    if (!asset) return

    try {
      var response = await axios.get(`${conf.api_url}/user/getNft/${asset}`)
      setToekn(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const _getOffersList = async () => {
    if (!asset) return
    try {
      var response = await axios.get(`${conf.api_url}/user/getOffers/${asset}`)
      setOffersList(response.data.data)
      // console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const _getActivityList = async () => {
    if (!asset) return

    try {
      var response = await axios.get(
        `${conf.api_url}/user/getActivity/${asset}`,
      )
      setActivityList(response.data.data)
      // console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const _getMoreCollection = async () => {
    if (!token) return
    try {
      var response = await axios.get(
        `${conf.api_url}/user/getCollection/${token.collection}`,
      )
      setMoreCollection(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function transfer() {
    const address = sessionStorage.getItem('address')
    if (!address) {
      await ConnectMetaMask().then((result) => {
        if (result != undefined && result != null) {
          web3Ctx.loadAccount(result)
          setAlert({
            show: true,
            title: 'Wallet Connected',
            type: 'success',
            message: 'account connected successfully',
          })
        }
      })
      return null
    }

    const web3 = new Web3(window.ethereum)

    var price = web3.utils.toWei(token['ipfs_meta']['price'], 'ether')

    contract_abi()
      .methods.transfer(
        address,
        // voucher
        [
          token['owner'],
          token['ipfs_meta']['tokenID'],
          price,
          token['ipfs_meta']['image'],
          token['signature'],
        ],
      )
      .send({ from: address, value: price }, async function (err, res) {
        if (err) {
          console.log('An error occured', err)
          return
        }
        console.log('Hash of the transaction: ' + res)

        try {
          var response = await axios.patch(
            `${conf.api_url}/user/updateNftMintedStatus`,
            {
              newOwner: address,
              assetId: token._id,
            },
          )
          console.log('_updateNftMintedStatus', response)
        } catch (error) {
          console.log(error)
        }
        _createActivity(
          'Transfer',
          token['createdBy'],
          sessionStorage.getItem('address'),
          token['ipfs_meta']['price'],
          res,
        )
        setShowBuyModal(false)
      })
  }

  async function redeem() {
    if (token.minted && token.listed) {
      transfer()
      return
    }

    const address = sessionStorage.getItem('address')
    if (!address) {
      await ConnectMetaMask().then((result) => {
        if (result != undefined && result != null) {
          web3Ctx.loadAccount(result)
          setAlert({
            show: true,
            title: 'Wallet Connected',
            type: 'success',
            message: 'account connected successfully',
          })
        }
      })
      return null
    }
    // if (true) {
    //   console.log("address", address);
    //   test()
    //   return null
    // }

    // get
    // var name = await contract_abi().methods.name().call()
    // const buy = await contract_abi().methods.buyTokens(accounts[0]).send({ from: accounts[0], value: wei });

    // const voucher = {
    //   assignedAddress: '0x4b04b0bd233e5cf6ebf7e293124143eaf1077f23',
    //   tokenId: '30',
    //   minPrice: 0,
    //   uri: 'https://www.img.test.co/file.png',
    //   signature:
    //     '0x608657e1b15462545f05b76e2df9181fc8cec51735c79fcb0771af9daa78c6d770bef0308f89b6e84a5d8148da306180c4be7e1288d62a1d33dd6510c1b8824c1b',
    // }

    const web3 = new Web3(window.ethereum)

    var price = web3.utils.toWei(token['ipfs_meta']['price'], 'ether')

    contract_abi()
      .methods.redeem(
        address,
        // voucher
        [
          token['createdBy'],
          token['ipfs_meta']['tokenID'],
          price,
          token['ipfs_meta']['image'],
          token['signature'],
        ],
      )
      .send({ from: address, value: price }, async function (err, res) {
        if (err) {
          console.log('An error occured', err)
          return
        }
        console.log('Hash of the transaction: ' + res)

        try {
          var response = await axios.patch(
            `${conf.api_url}/user/updateNftMintedStatus`,
            {
              newOwner: address,
              assetId: token._id,
            },
          )
          console.log('_updateNftMintedStatus', response)
        } catch (error) {
          console.log(error)
        }

        _createActivity('Minted', 'NullAddress', token['createdBy'], '')
        _createActivity(
          'Transfer',
          token['createdBy'],
          sessionStorage.getItem('address'),
          token['ipfs_meta']['price'],
          res,
        )
        setShowBuyModal(false)
      })
  }

  // Owner List
  async function _completeListing() {
    var assignedAddress = sessionStorage.getItem('address')
    if (!showSellModal.price || !assignedAddress) return null
    const web3 = new Web3(window.ethereum)
    console.log('toWei PRICE', web3.utils.toWei(showSellModal.price, 'ether'))
    const voucher = (async () =>
      await createVoucher(
        assignedAddress,
        token.ipfs_meta.tokenID,
        token.ipfs_meta.image,
        web3.utils.toWei(showSellModal.price, 'ether'),
      ))()
    // voucher.then((data) => console.log('Voucher :', data))
    voucher.then(async (voucher) => {
      if (voucher.hasOwnProperty('signature')) {
        console.log('Voucher :', voucher)
        try {
          var response = await axios.patch(`${conf.api_url}/user/updateNft`, {
            price: showSellModal.price,
            assetId: token._id,
            signature: voucher.signature,
          })
          console.log('_completeListing', response)
          setShowSellModal({ ...showSellModal, show: false })
          // Add new Activity
          _createActivity('List', undefined, undefined, showSellModal.price)
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  // var v_test = async () => await createVoucher('02', 'https://www.img.test.co/file.png', 2)
  var v_test = async () => {
    const web3 = new Web3(window.ethereum)
    console.log(web3.utils.toWei('0.001', 'ether'))
    console.log('addr --- ', conf.contract_address)
    return await createVoucher_(
      '0xe50bd82dA29B032F5F645e9ecdc44004DD148641',
      '1',
      'https://cdn-doohh.nitrocdn.com/jdJgWaYNUJXBrkHPhDgIEvKYRFhoIMMH/assets/static/optimized/rev-2504e71/wp-content/uploads/2019/08/logo-1.png',
      web3.utils.toWei('0.001', 'ether'),
    )
  }

  const makeOffer = async () => {
    const address = sessionStorage.getItem('address')
    if (!address) return null

    setShowOfferModal({ ...showOfferModal, err: null })
    if (showOfferModal.price == null || showOfferModal.expireDate == null) {
      setShowOfferModal({
        ...showOfferModal,
        err: 'Enter offer amount and expire date',
      }) //You don't have enough WETH
      return
    }
    const offer = {
      asset: token._id,
      price: showOfferModal.price,
      floorDifference: 'At floor',
      expiration: showOfferModal.expireDate,
      from: address,
    }
    try {
      var response = await axios.post(`${conf.api_url}/user/createOffer`, offer)
      alert(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  const _createActivity = async (
    event = 'List',
    from = token.owner,
    to = '',
    price = token.price,
    transID = null,
  ) => {
    const activity = {
      token: token._id,
      event: event, // Minted // Transfer // Sale // Offer
      price: price,
      from,
      to,
      date: new Date().toLocaleString(),
      transID,
    }

    try {
      var response = await axios.post(
        `${conf.api_url}/user/newActivity`,
        activity,
      )

      setAlert({
        show: true,
        title: 'Submitted successfully',
        type: 'success',
        message: 'Nft successfully transferd',
      })

      console.log('Activity Updated:', response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header />

      {alert && (
        <Alert {...alert} onClose={() => setAlert({ ...alert, show: false })} />
      )}

      {/* <main className="grid grid-cols-2 gap-2 px-40"> */}
      <main className="flex px-40 bg-gray-100 py-4 ">
        <div className="w-2/5">
          {token && (
            <div className="rounded-lg bg-white shadow-2xl hover:shadow-purple-400 duration-200 p-6">
              <div className="flex justify-between">
                <Link href={'/Collections?name=' + token.collection}>
                  <a className="text-sky-600 text-sm">{token.collection}</a>
                </Link>
                <div>
                  <span className="material-symbols-outlined text-gray-500 border-2 p-2 rounded-lg">
                    share
                  </span>
                  <span className="material-symbols-outlined text-gray-500 border-2 p-2 rounded-lg ml-1">
                    flag
                  </span>
                </div>
              </div>

              <img
                // props.collection+props.ipfs_meta.image
                src={token.ipfs_meta.image}
                // src={`https://avatars.dicebear.com/api/bottts/${
                //   token.collection + token.ipfs_meta.image
                // }.svg`}
              />

              <h1 className="font-bold text-2xl">{token.ipfs_meta.name}</h1>
              <div className="flex text-xs text-gray-500">
                <p>Owned by </p>
                <a href="#" className="text-sky-600 ml-2">
                  {token.owner
                    ? addrsSubStr(token.owner)
                    : addrsSubStr(token.createdBy)}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* /////////////////////  RIGHT  /////////////////////////////// */}

        {token && (
          <div className="flex-1 px-5">
            <div className="grid grid-cols-1 divide-y rounded-md bg-white shadow-2xl  hover:shadow-purple-400 duration-200">
              <div className="flex p-4">
                <span className="material-symbols-outlined text-sm mx-2 text-gray-500 ">
                  schedule
                </span>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleString()}
                </p>
              </div>

              <div className="px-3 pt-3">
                <p className="text-xs text-gray-500">Current price</p>

                <span className="flex items-center text-sm text-gray-500">
                  <img src={conf.coin_icon} className="w-5 h-5" />
                  <h1 className="font-bold text-2xl text-gray-900 mx-1 mt-2">
                    {token.ipfs_meta.price}
                  </h1>
                  <CurrencyConvert value={token.ipfs_meta.price} />
                </span>

                <div className="flex">
                  {token.owner.toLowerCase() ==
                  sessionStorage.getItem('address') ? (
                    <button
                      className={`flex items-center text-white px-10 py-2 my-5 mr-5 rounded-md ${
                        token.listed ? 'bg-gray-300' : 'bg-green-600'
                      }`}
                      disabled={token.listed == true}
                      onClick={() =>
                        setShowSellModal({ ...showSellModal, show: true })
                      }
                    >
                      <p> Sell now</p>
                    </button>
                  ) : (
                    <button
                      className="flex items-center bg-sky-600 text-white px-10 py-2 my-5 mr-5 rounded-md "
                      onClick={() => setShowBuyModal(true)}
                    >
                      <span className="material-symbols-outlined mr-2 text-white ">
                        account_balance_wallet
                      </span>
                      <p> Buy now {!token.minted && '*'}</p>
                    </button>
                  )}

                  {token.owner.toLowerCase() ==
                  sessionStorage.getItem('address') ? null : (
                    <button
                      onClick={() =>
                        setShowOfferModal({ ...showBuyModal, show: true })
                      }
                      className="flex items-center text-sky-600 px-6 py-1 my-5 rounded-md border-2 border-sky-600"
                    >
                      <span className="material-symbols-outlined mr-2 text-sky-600 ">
                        sell
                      </span>
                      <p>Make offer</p>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List */}

            {offersList && <OffersListTable offersList={offersList} />}
          </div>
        )}
      </main>

      {/* SECTION-2 Description, Properties, Details */}
      <div className="bg-gray-100">
        {token && (
          <div
            // className="grid grid-cols-1 divide-y border-gray-300 rounded-md my-5 "
            className="rounded-md my-5 flex mx-40 bg-white shadow-2xl hover:shadow-purple-400 mt-0"
          >
            {/* Description */}
            <div className="flex-1">
              <div className="flex items-center p-4 text-xs">
                <span className="material-symbols-outlined mr-2">
                  view_headline
                </span>{' '}
                <h1 className="text-sm font-bold">Description</h1>
              </div>
              <div className="p-6 py-3 text-xs font-thin">
                {token.ipfs_meta.description}
              </div>
            </div>

            {/* Properties */}
            <div className="flex-1">
              <div className="flex items-center p-4 text-xs">
                <span className="material-symbols-outlined mr-2">label</span>{' '}
                <h1 className="text-sm font-bold">Properties</h1>
              </div>
              <div className="p-3 text-xs font-thin">
                {token.ipfs_meta.attributes.length > 1 && (
                  <div className="flex flex-wrap">
                    {token.ipfs_meta.attributes.map((_, k) => {
                      return (
                        <div className="bg-blue-50 py-2 px-4 rounded-lg m-2 flex-1 border-blue-100 border">
                          <p
                            key={k}
                            className="text-center text-blue-500 text-xs"
                          >
                            {_.type}
                          </p>
                          <p
                            key={k}
                            className="text-center text-gray-700 text-sm"
                          >
                            {_.name}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center p-4 text-xs">
                <span className="material-symbols-outlined mr-2">info</span>{' '}
                <h1 className="text-sm font-bold">Details</h1>
              </div>
              <div className="p-3 text-xs font-thin">
                <h1 className="text-sm mb-1 text-gray-500">
                  Created by{' '}
                  <a href="" className="text-sky-700 font-medium">
                    {addrsSubStr(token.createdBy)}
                  </a>
                </h1>
              </div>
            </div>
          </div>
        )}

        {activityList && <ItemActivityTable data={activityList} />}
        {moreCollection && <MoreFromCollectionTable data={moreCollection} />}
      </div>
      <Footer />
      {/* /////////////////////  MODALS  /////////////////////////////// */}

      {/*  MODAL FOR BUY*/}
      <Modal
        show={showBuyModal}
        setShowModal={() => setShowBuyModal(false)}
        successButtonColor="bg-blue-500"
        onClickSuccessButton={() => redeem()}
        successButtonTitle="Checkout"
        // onClickCancelButton={() => alert('no action!')}
        // cancelButtonTitle="Cancel"
      >
        <div className="sm:flex sm:items-start">
          {token && (
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div className="text-lg leading-6 font-medium text-gray-900 text-center">
                Complete checkout
              </div>
              <div className="flex">
                <img
                  className="w-1/4"
                  src={token.ipfs_meta.image}
                  // src={`https://avatars.dicebear.com/api/bottts/${
                  //   token.collection + token.ipfs_meta.image
                  // }.svg`}
                />
                <div className="ml-4">
                  <p className="text-sm text-gray-700 text-bold border py-1 border-l-0 border-r-0  mt-2">
                    Item
                  </p>
                  <p className="flex items-center text-gray-700 text-bold text-lg my-2">
                    price :<img src={conf.coin_icon} className="w-5 h-5 mx-2" />{' '}
                    {token.ipfs_meta.price}
                  </p>
                </div>
              </div>
              <div>
                <p className=" text-sm text-gray-700 text-bold border py-1 border-l-0 border-r-0  mt-2">
                  Total
                </p>
                <p className=" text-gray-700 text-xs mt-3">fee : 0.05</p>
                <p className="flex items-center text-gray-700 text-bold text-lg">
                  <img src={conf.coin_icon} className="w-5 h-5 mr-2" />
                  {parseFloat(token.ipfs_meta.price) + 0.05}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {/* Are you sure you want to deactivate your account? All of your
                  data will be permanently removed. This action cannot be
                  undone. */}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/*  MODAL FOR OFFER*/}
      <Modal
        show={showOfferModal.show}
        setShowModal={() =>
          setShowOfferModal({ ...showOfferModal, show: false })
        }
        successButtonColor="bg-blue-500"
        onClickSuccessButton={() => makeOffer()}
        successButtonTitle="Make offer"
        // onClickCancelButton={() => alert('no action!')}
        // cancelButtonTitle="Cancel"
      >
        <div className="sm:flex sm:items-start">
          {token && (
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div className="text-lg leading-6 font-medium text-gray-900 text-center">
                Make an offer
              </div>

              <UserBalance />

              <Input
                type="text"
                title="Offer amount"
                keyboardType="number"
                onChange={(val) =>
                  setShowOfferModal({ ...showOfferModal, price: val })
                }
                className="my-0"
                errorMessage={showOfferModal?.err}
              />
              <Input
                type="date"
                title="Offer expiration"
                onChange={(val) =>
                  setShowOfferModal({ ...showOfferModal, expireDate: val })
                }
              />

              {/*            
              <div className="mt-2">
                <p className="text-sm text-gray-500">--
                </p>
              </div> */}
            </div>
          )}
        </div>
      </Modal>

      {/*  MODAL FOR SELL*/}
      <Modal
        show={showSellModal.show}
        setShowModal={() => setShowSellModal({ ...showSellModal, show: false })}
        // successButtonColor="bg-blue-500"
        onClickSuccessButton={() => _completeListing()}
        successButtonTitle="Complete Listing"
        // onClickCancelButton={() => alert('no action!')}
        // cancelButtonTitle="Cancel"
      >
        <div className="sm:flex sm:items-start">
          {token && (
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div className="text-lg leading-6 font-medium text-gray-900 text-center">
                Make an offer
              </div>

              <Input
                type="text"
                title="Price"
                keyboardType="number"
                onChange={(val) =>
                  setShowSellModal({ ...showSellModal, price: val })
                }
                className="my-0"
                errorMessage={showOfferModal?.err}
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
