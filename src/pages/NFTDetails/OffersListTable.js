import React from 'react'
import { CurrencyConvert } from '../../components'
import conf from '../../global/constants'

export default function OffersList(props) {
  return (
    <div className="grid grid-cols-1 divide-y rounded-md mt-5 bg-white shadow-2xl hover:shadow-purple-400 duration-200">
      <div className="flex p-4">
        <span className="material-symbols-outlined mr-2">view_headline</span>{' '}
        <h1 className="text-sm font-bold">Offers</h1>
      </div>

      <div className="flex p-2 justify-between">
        <p className="text-xs text-gray-600 flex-1">Price</p>
        <p className="text-xs text-gray-600 flex-1">USD Price</p>
        <p className="text-xs text-gray-600 flex-1">Floor Difference</p>
        <p className="text-xs text-gray-600 flex-1">Expiration</p>
        <p className="text-xs text-gray-600 flex-1 mr-5">From</p>
      </div>
      {/* work area */}

      {props.offersList.map((item, key) => {
        return (
          <div key={key} className="flex p-3 justify-between">
            <img src={conf.coin_icon} className="w-4 h-4" />
            <p className="flex flex-1 items-center text-xs text-gray-600 font-bold">
              <span className="ml-2">{item?.price} BNB</span>
            </p>
            <p className="text-xs text-gray-500 flex-1">
              <CurrencyConvert
                className="text-xs text-gray-500 ml-2"
                value={item.price}
              />
            </p>
            <p className="text-xs text-gray-500 flex-1">
              {item?.floorDifference}
            </p>
            <p className="text-xs text-gray-500 flex-1">{item?.expiration}</p>
            <p className="text-xs text-gray-600 flex-1 mr-5">
              <a className="text-sky-500" href="">
                {item?.from.substring(0, 4) +
                  '...' +
                  item?.from.substring(
                    item?.from.length - 3,
                    item?.from.length,
                  )}
              </a>
            </p>
          </div>
        )
      })}
    </div>
  )
}
