import axios from 'axios'
import React, { useState } from 'react'
import { Footer, Header, Input, Alert } from '../components'
import config from '../global/constants'

export default function CreateCollection() {
  const [form, setForm] = useState()
  const [alert, setAlert] = useState()
  const createNft = async () => {
    try {
      var response = await axios.post(config.api_url + '/user/createColl', {
        ...form,
        owner: sessionStorage.getItem('address'),
      })
      if (response.data.status) {
        setAlert({
          show: true,
          title: 'Collection Created successfully',
          type: 'success',
          message: 'create to new nfts for this collection',
        })
        console.log('--', response.data.message)
      } else console.log('api error')
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
          <h1 className="text-2xl font-bold">Create a Collection</h1>
          <p className="text-xs text-gray-500 my-3">* Required fields</p>
          <p className="text-sm">Featured image</p>
          <p className="text-xs text-gray-500">
            This image will be used for featuring your collection on the
            homepage, category pages, or other promotional areas of OpenSea. 600
            x 400 recommended.
          </p>

          <Input
            type="file"
            onChange={(featuredImage) => setForm({ ...form, featuredImage })}
          />
          <Input
            type="text"
            title="Name"
            description=""
            required
            placeholder="collection-name"
            onChange={(val) => setForm({ ...form, name: val })}
          />
          <Input
            type="text"
            title="Url"
            description="Customize your URL on OpenSea. Must only contain lowercase letters, numbers, and hyphens."
            required
            placeholder="https://site.io/collection/collection-name"
            onChange={(val) => setForm({ ...form, url: val })}
          />

          <Input
            type="textarea"
            title="description"
            placeholder="item description"
            description="You are welcome to link to your own webpage with more details."
            required
            onChange={(val) => setForm({ ...form, description: val })}
          />

          <Input
            type="dropdownpicker"
            title="Category"
            required
            placeholder="Select category"
            onChange={(val) => setForm({ ...form, category: val.value })}
            options={[
              'Trending',
              'Top',
              'Art',
              'Collectibles',
              'Domain Names',
              'Music',
              'Photography',
              'Sports',
              'Trading Cards',
              'Utility',
              'Virtual Worlds',
            ].map((_) => ({
              name: _,
              value: _.toLocaleLowerCase().replace(' ', '_'),
            }))}
            description="Adding a category will help make your item discoverable on Site."
          />

          <button
            className="bg-sky-600 text-white p-5 py-2 rounded"
            onClick={createNft}
          >
            Create
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}
