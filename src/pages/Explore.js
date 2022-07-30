import React, { useEffect, useState } from 'react'
import { Footer, Header } from '../components'
import { useRouter } from 'next/router'
import axios from 'axios'
import conf from '../global/constants'
import { addrsSubStr } from '../global/helper'

export default function Explore() {
  const router = useRouter()
  const [coll, setColl] = useState()
  const [tabIndex, setTabIndex] = useState('all')

  useEffect(() => {
    getColl()
  }, [])

  const getColl = async () => {
    try {
      var response = await axios.get(conf.api_url + '/user/getNfts')
      if (response.data.status) setColl(response.data.data)
      else console.log('api error')
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = (path) => {
    router.push('/NFTDetails?asset=' + path)
  }


  return (
    <>
      <Header />
      <div className="bg-gray-50">
        <h1 className="text-center p-10 font-bold text-3xl">
          Explore Collections
        </h1>
        <div className="flex justify-center mb-5">
          {conf.categories.map((_, k) => (
            <h2
              key={k}
              className={`px-5 py-1 rounded-2xl mx-2 text-sm hover:font-bold hover:underline hover:tracking-wider duration-75`}
              style={{
                backgroundColor:
                  '#' +
                  Math.floor(Math.random() * 16777215).toString(16) +
                  (tabIndex == _.toLocaleLowerCase().replace(' ', '')
                    ? ''
                    : '25'),
              }}
            >
              <button
                onClick={() =>
                  setTabIndex(_.toLocaleLowerCase().replace(' ', ''))
                }
              >
                <p
                  className={
                    tabIndex == _.toLocaleLowerCase().replace(' ', '')
                      ? 'text-white'
                      : ''
                  }
                >
                  {_}
                </p>
              </button>
            </h2>
          ))}
        </div>

        <main className="grid grid-cols-4 gap-8 px-40 py-5">
          {coll &&
            coll.map((__, key) => {
              var render = tabIndex == 'all' ? true : __.category == tabIndex
              if (!render && key == 0) return <p>no items!</p>
              return (
                render &&
                __.nfts.map((_, idx) => {
                  return (
                    <div
                      key={idx + key}
                      className="w-full bg-white m-auto relative border rounded-lg overflow-hidden hover:scale-105 duration-200 shadow-xl"
                      onClick={() => handleClick(_['_id'])}
                    >
                      <div className="bg-sky-50">
                        <img
                          src={
                            _.ipfs_meta.image
                              ? _.ipfs_meta.image
                              : 'https://avatars.dicebear.com/api/bottts/' +
                                _._id +
                                '.svg'
                          }
                          className="hover:scale-75 duration-300"
                        />
                      </div>
                      <img
                        src={`https://avatars.dicebear.com/api/miniavs/${_.owner}.svg`}
                        className="bg-white w-8 h-8 rounded-full m-auto border -translate-y-3"
                      />
                      <div className="p-5 pt-0">
                        <h2 className="text-center font-bold text-sm">
                          <a href="">{_.ipfs_meta.name}</a>
                        </h2>
                        <p className="text-center text-sm">
                          by{' '}
                          <a className="text-sm text-sky-500" href="">
                            {_.owner
                              ? addrsSubStr(_.owner)
                              : addrsSubStr(_.createdBy)}
                          </a>
                        </p>
                        <p className="text-center text-sm">
                          {_.ipfs_meta.price}
                        </p>
                        <p className="text-xs text-gray-500 leading-4 my-2 text-center">
                          {_.ipfs_meta.description.substr(0, 50)}...
                        </p>
                      </div>
                    </div>
                  )
                })
              )
            })}
        </main>
      </div>
      <Footer />
    </>
  )
}
