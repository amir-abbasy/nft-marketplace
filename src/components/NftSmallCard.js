import React from 'react'
import { useRouter } from 'next/router'
import { addrsSubStr } from '../global/helper'

export default function NftSmallCard(props) {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    router.push(`/NFTDetails?asset=${props._id}`)
  }

  return (
    <div>
      <div
        className="m-auto relative border rounded-lg overflow-hidden hover:scale-105 duration-200 shadow-2xl"
        onClick={(e) => handleClick(e)}
      >
        <div className="bg-sky-50 h-52">
          <img
            src={props.ipfs_meta.image}
            // src={`https://avatars.dicebear.com/api/bottts/${props.collection+props.ipfs_meta.image}.svg`}
            className="hover:scale-75 duration-300 w-8/12 h-8/12  m-auto"
          />
        </div>
        <img
          src={`https://avatars.dicebear.com/api/miniavs/${props.owner}.svg`}
          className="bg-white w-8 h-8 rounded-full m-auto border -translate-y-3"
        />
        <div className="p-5 pt-0">
          <h2 className="text-center font-bold text-sm">
            <a href="">{props.ipfs_meta.name}</a>
          </h2>
          <p className="text-center text-sm">
            by{' '}
            <a className="text-sm text-sky-500" href="">
              {addrsSubStr(props.createdBy)}
            </a>
          </p>
          <p className="text-xs text-gray-500 leading-4 my-2 text-center">
            {props.ipfs_meta.description.substr(0, 70)}...
          </p>
        </div>
      </div>
    </div>
  )
}
