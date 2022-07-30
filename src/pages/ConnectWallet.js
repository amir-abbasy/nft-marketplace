import React from 'react'
import { Footer, Header } from '../components'


export default function ConnectWallet() {
  return (
    <>
      <Header />

      <div className=" flex justify-center items-center">
        <div className="p-20 pt-10">
          <h1 className="text-2xl font-bold">Connect your wallet.</h1>
          <p className="text-sm mt-2 text-gray-500">
            Connect with one of our available wallet providers or create a new
            one.
          </p>
          <div className="border-gray-200 border rounded-lg bg-white p-1 divide-y my-5">
            <div>
              <a href="" className="flex items-center p-2">
                <img
                  className="w-5 h-5"
                  src="https://opensea.io/static/images/logos/metamask-fox.svg"
                />
                <h1 className="text-sm font-bold ml-4">MetaMask</h1>
              </a>
            </div>

            <div>
              <a href="" className="flex items-center p-2">
                <img
                  className="w-5 h-5"
                  src="https://static.opensea.io/logos/walletlink-alternative.png"
                />
                <h1 className="text-sm font-bold ml-4">Coinbase Wallet</h1>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
