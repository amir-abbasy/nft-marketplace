import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Footer, Header, Input, Modal, Alert } from '../components'
import { createVoucher } from '../services/createVoucher'
import config from '../global/constants'
import { ConnectMetaMask } from '../services/MetaMask'
import Web3Context from '../store/web3-context'

export default function CreateNFT() {
  const web3Ctx = useContext(Web3Context)

  const [form, setForm] = useState()
  const [collection, setCollection] = useState()
  const [showPropertiesModal, setShowPropertiesModal] = useState(false)
  const [properties, setProperties] = useState({ pairs: [] })
  const [fileUrl, setFileUrl] = useState()
  const [alert, setAlert] = useState()
  const [tokenID, setTokenID] = useState(0)
  
  // https://avatars.dicebear.com/croodles

  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

  // START NFT CREATION

  async function onPicKFile(file) {
    // const file = etarget.files[0]

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

    if (!file) {
      setAlert({
        show: true,
        title: 'Pick your NFT file',
        type: 'error',
        message: 'NFT file is required',
      })
      return
    }

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  // Phase 2
  async function createMetaData(callback) {
    const { name, description, price, collection } = form
    if (!name || !description || !fileUrl || !collection) return
    /* first, upload to IPFS */
    const data = {
      tokenID: tokenID,
      name: name,
      price: 0,
      description: description,
      image: fileUrl,
      attributes: properties.pairs,
    }

    try {
      const added = await client.add(JSON.stringify(data), {
        progress: (prog) => console.log(`received nft json: ${prog}`),
      })
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      console.log(added)
      callback({ path: added.path, tokenID: data.tokenID, meta: data })
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const createNft = async () => {
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
      return
    }

    if (!form.name || !form.description || !form.collection) {
      setAlert({
        show: true,
        title: 'Enter *Required fields',
        type: 'error',
        message: 'name, description, collection are required',
      })
      return
    }

    createMetaData(async (file) => {
      const uri = 'https://ipfs.io/ipfs/' + file.path

      const body = {
        ipfs_meta: file.meta,
        ipfs_meta_url: uri,
        createdBy: sessionStorage.getItem('address'),
        owner: sessionStorage.getItem('address'),
        collection: form.collection?.value,
        listed: false,
        minted: false,
        signature: null,
        createdDate: new Date().toLocaleDateString(),
      }
      try {
        var response = await axios.post(
          config.api_url + '/user/createNft',
          body,
        )
        console.log('--', response.data)
        console.log('-ID-', response.data.data.insertedId)

        // Add Activity as Created
        _createActivity(response.data.data.insertedId)
      } catch (error) {
        console.log(error)
      }

      // const voucher = (async () => await createVoucher(file.tokenID, uri))()
      // voucher.then((data) => console.log('Voucher :', data))
      // voucher.then((voucher) => {
      //   console.log('Voucher :', voucher)
      //   if (data.hasOwnProperty('signature')) {
      //     updateDB(file.meta)
      //   }
      // })
    })
  }

  const _createActivity = async (_token) => {
    const activity = {
      token: _token,
      event: 'Created', // Minted // Transfer // Sale // Offer
      price: '',
      from: sessionStorage.getItem('address'),
      to: null,
      date: new Date().toLocaleString(),
    }

    try {
      var response = await axios.post(
        `${config.api_url}/user/newActivity`,
        activity,
      )
      // alert(response.data.message)

      setAlert({
        show: true,
        title: 'NFT Created successfully',
        type: 'success',
        message: 'sell your nft now',
      })

      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  //  END NFT CREATION

  useEffect(() => {
    getUserCollection()
    getLastTokenId()
  }, [])

  // const voucher = (async () => await createVoucher(tokenId, uri))();
  // voucher.then((data) => console.log("Voucher :", data));
  const getUserCollection = async () => {
    try {
      var response = await axios.get(
        config.api_url +
          `/user/getUserCollection/${sessionStorage.getItem('address')}`,
      )
      setCollection(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getLastTokenId = async () => {
    try {
      var response = await axios.get(config.api_url + `/user/getNftLastId`)
      setTokenID(parseInt(response.data.data) + 1)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header />
      {true && (
        <Alert {...alert} onClose={() => setAlert({ ...alert, show: false })} />
      )}
      <div className=" flex justify-center items-cente max-w-5xl m-auto">
        <div className="p-40 pt-10">
          <h1 className="text-2xl font-bold">Create New Item</h1>
          <p className="text-xs text-gray-500 my-3">* Required fields</p>
          <p className="text-sm"> Image, Video, Audio, or 3D Model</p>
          <p className="text-xs text-gray-500">
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
            GLB, GLTF. Max size: 100 MB
          </p>

          <Input
            type="file"
            // onChange={(file) => setForm({ ...form, file })}
            onChange={(file) => onPicKFile(file)}
            value={fileUrl}
          />
          {collection && (
            <Input
              type="dropdownpicker"
              title="Collection"
              required
              placeholder="Select collection"
              onChange={(val) => setForm({ ...form, collection: val })}
              options={collection.map((_) => ({ name: _.name, value: _.url }))}
              description="This is the collection where your item will appear."
            />
          )}
          <button
            className="w-full flex border p-2 justify-between rounded-md"
            onClick={() => setShowPropertiesModal(true)}
          >
            <p className="text-gray-600">Properties</p>
            <span className="material-symbols-outlined mx-5 text-blue-500">
              add
            </span>
          </button>

          <Input
            type="text"
            title="Name"
            description="OpenSea will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
            required
            placeholder="Item Name"
            onChange={(val) => setForm({ ...form, name: val })}
          />
          <Input
            type="textarea"
            title="description"
            placeholder="item description"
            description="You are welcome to link to your own webpage with more details."
            required
            onChange={(val) => setForm({ ...form, description: val })}
          />

          <button
            className="bg-sky-600 text-white p-5 py-2 rounded"
            onClick={() => createNft()}
          >
            Create
          </button>
        </div>
      </div>
      <Footer />

      {/*  MODAL FOR OFFER*/}
      <Modal
        show={showPropertiesModal}
        setShowModal={() => setShowPropertiesModal(false)}
        // successButtonColor="bg-blue-500"
        // onClickSuccessButton={() => makeOffer()}
        // successButtonTitle="Make offer"
        // onClickCancelButton={() => alert('no action!')}
        // cancelButtonTitle="Cancel"
      >
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div className="text-lg leading-6 font-medium text-gray-900 text-center mb-4">
              Add Properties
            </div>

            <div className="flex justify-between">
              <Input
                type="text"
                title="Type"
                onChange={(val) => setProperties({ ...properties, type: val })}
                className="my-0"
                errorMessage={showPropertiesModal?.err}
              />
              <span className="mx-2"></span>
              <Input
                type="text"
                title="Name"
                onChange={(val) => setProperties({ ...properties, name: val })}
                className="my-0"
                errorMessage={showPropertiesModal?.err}
              />
              <button
                onClick={() => {
                  var newPairs = [...properties.pairs]
                  newPairs.push({
                    type: properties.type,
                    name: properties.name,
                  })
                  setProperties({ ...properties, pairs: newPairs })
                }}
              >
                <span className="material-symbols-outlined mx-5 mt-5 text-blue-500 border p-1 rounded-md">
                  add
                </span>
              </button>
            </div>

            {properties?.pairs &&
              properties.pairs.map((__, k) => {
                return (
                  <div className="flex justify-between  items-center border mx-20 my-2 p-1">
                    <p className="text-left">{__.type}</p>-
                    <p className="text-left">{__.name}</p>
                  </div>
                )
              })}
            {/* 
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Properties show up underneath your item, are clickable, and can
                be filtered in your collection's sidebar.{' '}
              </p>
            </div> */}
          </div>
        </div>
      </Modal>
    </>
  )
}
