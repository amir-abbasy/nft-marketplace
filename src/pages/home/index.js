import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import config from '../../global/constants'
import { CurrencyConvert, Footer, Header, UserBalance } from '../../components'
import WhatYouCan from './WhatYouCan'
import contract_abi from '../../abi/abi'
import { addrsSubStr } from '../../global/helper'

export default function Home() {
  const [collection, setCollection] = useState()
  const [randumNum, setRandomNum] = useState(12)
  const router = useRouter()

  useEffect(() => {
    getUserCollection()
    setNewCover()
  }, [])

  function setNewCover() {
    setInterval(() => setRandomNum(new Date().getTime()), 5000)
  }

  const getUserCollection = async () => {
    try {
      var response = await axios.get(config.api_url + `/user/getNewCollections`)
      setCollection(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function test() {
    var name = await contract_abi().methods.symbol().call()
    console.log('-------', name)
  }

  return (
    <>
      <Header />
      <main className="p-20 items-center bg-gray-50">
        <div className="grid grid-cols-2 px-20">
          <div className="">
            <h1 className="text-4xl font-black mb-3">
              Discover, collect, and sell NFTs here.
            </h1>
            <h1 className="text-lg">
              Discover, collect, and sell extraordinary NFTs
            </h1>
            <button
              className="bg-white ml-4 text-gray-600 px-10 py-10 my-5 rounded-md border-2 border-gray-200 hover:opacity-80 hover:scale-105 duration-100 shadow-xl hover:text-purple-600 hover:shadow-purple-200 hover:border-purple-200"
              onClick={() => router.push('/Explore')}
              // onClick={() => test()}
            >
              <span class="material-symbols-outlined text-4xl">search</span>
              <p>Explore</p>
            </button>
            <button
              className="bg-white ml-4 text-gray-600 px-10 py-10 my-5 rounded-md border-2 border-gray-200 hover:opacity-80 hover:scale-105 duration-100 shadow-xl hover:text-purple-600 hover:shadow-purple-200"
              onClick={() => router.push('/CreateNFT')}
            >
              <span class="material-symbols-outlined text-4xl">add</span>
              <p>Create</p>
            </button>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-2xl">
            <div
              class="w-full h-72 bg-cover bg-center"
              // bg-[url('https://avatars.dicebear.com/api/big-smile/sdf.svg')]
              style={{
                backgroundImage: `url('https://avatars.dicebear.com/api/big-smile/${randumNum}.svg')`,
              }}
            >
              <div class="w-full h-full flex flex-col justify-center items-center backdrop-blur-3xl">
                <img
                  // src="https://ipfs.infura.io/ipfs/QmSL7qKkLy1vQjbaT1qrEpoFQdMYPcTKJ65d8BHNhoz79U"
                  src={`https://avatars.dicebear.com/api/big-smile/${randumNum}.svg`}
                  alt="Cover"
                  // className="object-cover"
                  className="m-auto w-1/2"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="px-40 bg-gray-50">
        <h1 className="text-center font-bold text-xl m-10 mt-0">
          Notable Drops
        </h1>
        <div className="grid grid-cols-3 gap-8 relative">
          {collection &&
            collection.map((item, key) => {
              return (
                <div
                  key={key}
                  className="h-4/12 bg-whtie rounded-lg overflow-hidden opacity-90 hover:opacity-100 shadow-2xl p-4 hover:shadow-purple-300 duration-300 cursor-pointer"
                  onClick={() => router.push('/Collections?name=' + item.url)}
                
                >
                  <div className="bg-blue-100 rounded-lg"
                    style={{backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)+'40'}}
                  >
                    <img
                      src={`https://avatars.dicebear.com/api/big-smile/${item._id}.svg`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-medium text-xl text-black mt-2">
                        #{item.name} ({item.category})
                      </h1>
                      <p className="font-thin text-sm text-gray-400 ">
                        {item.description.substr(0, 40)}...
                      </p>
                      <a href="" className="font-normal text-sm text-blue-500 ">
                        {addrsSubStr(item.owner)}
                      </a>
                    </div>
                    <img
                      src={`https://avatars.dicebear.com/api/miniavs/${item.owner}.svg`}
                      className="w-10 h-10 bg-blue-50 rounded-lg"
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <WhatYouCan />

      <Footer />
    </>
  )
}
