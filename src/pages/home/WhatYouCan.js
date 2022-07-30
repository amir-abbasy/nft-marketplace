import React from 'react'
export default function WhatYouCan() {
  return (
    <div className="mx-40 my-20">
      <h1 className="text-center font-bold text-xl m-10 mt-0">
        Create and sell your NFTs
      </h1>
      <div className="flex justify-between">
        {[
          { text: ' Set up your wallet', icon: 'account_balance_wallet' },
          { text: 'Create your collection', icon: 'category' },
          { text: 'Add your NFTs', icon: 'filter_vintage' },
          { text: ' List them for sale', icon: 'sell' },
        ].map((_, k) => (
          <div key={k} className="justify-center items-center">
            <div style={{ marginLeft: '23%' }}>
              <span
                class={`material-symbols-outlined text-6xl duration-300 text-gray-300 hover:text-purple-400`}
              >
                {_.icon}
              </span>
            </div>
            <h1 className="text-center font-bold text-sm">{_.text}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}
