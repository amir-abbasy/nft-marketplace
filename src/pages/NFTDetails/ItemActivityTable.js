import React from 'react'
import { DropDown, CurrencyConvert } from '../../components'
import conf from '../../global/constants'
import { addrsSubStr } from '../../global/helper'

export default function ItemActivityTable(props) {
  return (
    <div className="px-40 bg-gray-100 mt-0">
      <div className="grid grid-cols-1 rounded-md mt-5 shadow-2xl bg-white hover:shadow-purple-400 p-8">
        <div className="flex justify-between">
          <div className='flex'>
          <span className="material-symbols-outlined mr-2">swap_vert</span>{' '}
          <h1 className="text-sm font-bold">Item Activity</h1>
          </div>
          <DropDown
            single
            options={[
              {
                title: 'Filter',
                submenu: [
                  { title: 'Listings' },
                  { title: 'Sales' },
                  { title: 'Offers' },
                  { title: 'Transfers' },
                ],
              },
            ]}
          />
        </div>

        <div className="flex p-2 justify-between">
          <p className="text-xs text-gray-600 flex-1">Event</p>
          <p className="text-xs text-gray-600 flex-1">Price</p>
          <p className="text-xs text-gray-600 flex-1">From</p>
          <p className="text-xs text-gray-600 flex-1">To</p>
          <p className="text-xs text-gray-600 flex-1">Date</p>
          <p className="w-20"></p>
        </div>

        {props.data
          .slice(0)
          .reverse()
          .map((__, k) => {
            return (
              <div key={k} className="flex p-3 justify-between border-b border-gray-200 hover:bg-gray-50">
                <p className="flex flex-1 items-center text-xs text-gray-600 font-bold">
                  {__.event == 'List' && (
                    <span className="material-symbols-outlined">sell</span>
                  )}
                  {__.event == 'Minted' && (
                    <span className="material-symbols-outlined">
                      magic_button
                    </span>
                  )}
                  {__.event == 'Transfer' && (
                    <span className="material-symbols-outlined">
                      swap_horiz
                    </span>
                  )}
                  {__.event == 'Sale' && (
                    <span className="material-symbols-outlined">
                      shopping_cart
                    </span>
                  )}
                  <span className="ml-2">{__.event}</span>
                </p>
                {__.price ? (
                  <div className="inline-flex flex-1 items-center">
                    <img className="w-3 h-3 mr-1" src={conf.coin_icon} />
                    <p className="font-bold text-xs text-gray-500 ">
                      {__.price}
                    </p>
                    <CurrencyConvert
                      className="text-xs text-gray-500 ml-2"
                      value={__.price}
                    />
                  </div>
                ) : (
                  <p className="flex-1"></p>
                )}
                <p className="text-xs text-gray-600 flex-1 ">
                  <a href="" className="text-sky-500">
                    {' '}
                    {addrsSubStr(__.from)}
                  </a>
                </p>
                <p className="text-xs text-gray-600 flex-1 ">
                  <a href="" className="text-sky-500">
                    {addrsSubStr(__.to)}
                  </a>
                </p>
                <p className="text-xs text-gray-600 flex-1">
                  <a className="text-gray-500">{__.date}</a>
                </p>
                {__?.transID ? (
                  <p className="text-xs text-gray-600 w-20">
                    <a
                      href={`https://testnet.bscscan.com/tx/${__.transID}`}
                      className="text-sky-500"
                      target="_blank"
                    >
                      view block
                    </a>
                  </p>
                ) : (
                  <p className="w-20"></p>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
