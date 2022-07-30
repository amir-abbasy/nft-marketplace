import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Footer, Header, NftSmallCard } from '../components'
import Web3Context from '../store/web3-context'
import conf from '../global/constants'

export default function Collections() {
  const [collection, setCollection] = useState()


  const router = useRouter()
  const { name } = router.query

  useEffect(() => {
    getCollection()
  }, [name])


  const getCollection = async () => {
    try {
      var response = await axios.get(
        `${conf.api_url}/user/getCollection/${name}`,
      )
      setCollection(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <Header />
      {collection?.collectionDetails && (
        <>
          <div className="bg-blue-50 h-40 relative ">
            <div className="h-full overflow-hidden">
              <img
                src={`https://avatars.dicebear.com/api/big-smile/${collection.collectionDetails._id}.svg`}
                className="w-1/2 opacity-50 m-auto -translate-y-64"
              />
            </div>

            <div className="left-10 rounded-full flex-none absolute -bottom-5 overflow-hidden border-8 border-white shadow-lg">
              <img
                src={`https://avatars.dicebear.com/api/big-smile/${collection.collectionDetails._id}.svg`}
                className="w-28 h-28 bg-white"
              />
            </div>
          </div>
          <div className="py-10 px-10 pb-0">
            <h1 className="text-3xl font-bold">
              {collection.collectionDetails.name}
            </h1>
            <p className="">{collection.collectionDetails.description}</p>
          </div>
        </>
      )}
     {collection &&  <div className="flex py-6 px-10">
        <p className="font-bold text-lg mr-5 ">{collection.items.length} items</p>
        {/* <p className="font-bold text-lg mr-5 text-gray-500">13.0K owners</p> */}
      </div>}

      <div className="grid grid-cols-4 gap-8 px-10 py-5">
        {collection &&
          collection.items.map((item, key) => {
            return <NftSmallCard {...item}  />
          })}
      </div>
      <Footer />
    </>
  )
}
