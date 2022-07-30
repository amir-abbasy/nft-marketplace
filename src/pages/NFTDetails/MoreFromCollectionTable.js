import React from 'react'
import { addrsSubStr } from '../../global/helper'
import Link from 'next/link'

export default function MoreFromCollectionTable(props) {
  if(!props.data)return
  return (
    <div className="mx-40 my-20 rounded-md mt-5 bg-white">
      <div className="flex p-4">
        <span className="material-symbols-outlined mr-2">view_headline</span>{' '}
        <h1 className="text-sm font-bold">
          More from collection ({props.data.collectionDetails.name})
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-8 p-10">
        {props?.data && props.data.items.map((_, k) => {
          return (
            <div
              key={k}
              className=" bg-white rounded-lg overflow-hidden opacity-90 hover:opacity-100 border"
            >
              <div className="bg-white p-2 text-center">
                <div  className="h-52">
                <img 
                src={`${_.ipfs_meta.image ? _.ipfs_meta.image : "https://avatars.dicebear.com/api/bottts/"+_._id+".svg"}`}
                />
                </div>
                <h1 className="text-md font-normal">{_.ipfs_meta.name}</h1>
                <a className="font-medium text-sm text-blue-400">
                  {_.owner ? addrsSubStr(_.owner) : addrsSubStr(_.createdBy)}
                </a>
                <h1 className="font-medium text-md text-black">
                   {_.ipfs_meta.price}
                </h1>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4">
        <button className="flex m-auto border px-3  py-2 rounded-lg border-sky-500 text-sky-500">
          <Link href={'/Collections?name=' + props.data.collectionDetails.url}>
            <h1 className="text-sm font-bold">View collections</h1>
          </Link>
        </button>
      </div>
    </div>
  )
}
