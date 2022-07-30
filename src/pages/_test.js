import React, { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Image from 'next/image'
import { Modal } from '../components'

export default function _test() {
  const [showModal, setShowModal] = useState(true)
  const [fileUrl, setFileUrl] = useState(
    'https://ipfs.infura.io/ipfs/QmSL7qKkLy1vQjbaT1qrEpoFQdMYPcTKJ65d8BHNhoz79U',
  )
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  })

  const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

  async function onChange(e) {
    const file = e.target.files[0]
    // const cid = await ipfsHttpClient.add(
    //   { path: 'metadata.json', content: aJsonString },
    //   { wrapWithDirectory: true }
    //  )

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

  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    })
    try {
      const added = await client.add(data, {
        progress: (prog) => console.log(`received nft json: ${prog}`),
      })
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`

      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      // createSale(url);
      console.log(added)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function getFile() {
    const res = await client.get(
      'Qmca6rNaRs4m7oH1cDmqkwP7hNg4zQTTzMUiQiomGZynzh',
    )
    console.log(res)
    // unpack File objects from the response
    const files = await res.files()
    for (const file of files) {
      console.log(`${file.cid} -- ${file.path} -- ${file.size}`)
    }
  }
 

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <img
          className="rounded mt-4"
          width="350"
          height="200"
          src="https://ipfs.infura.io/ipfs/QmSL7qKkLy1vQjbaT1qrEpoFQdMYPcTKJ65d8BHNhoz79U"
        />
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {/* {fileUrl && <Image className="rounded mt-4" width="350" src={fileUrl} />} */}
        <button
          // onClick={createMarket}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Test
        </button>
        <Modal
          show={showModal}
          setShowModal={() => setShowModal(false)}
          successButtonColor="bg-green-500"
          onClickSuccessButton={() => alert('ji')}
          successButtonTitle="Checkout"
          onClickCancelButton={() => alert('ji')}
          cancelButtonTitle="asd"
        >
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              {/* <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" /> */}
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <div
                as="h3"
                className="text-lg leading-6 font-medium text-gray-900"
              >
               Complete checkout
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to deactivate your account? All of your
                  data will be permanently removed. This action cannot be
                  undone.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
