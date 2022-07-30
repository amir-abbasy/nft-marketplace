import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="flex p-20 bg-gray-700">
        <div className="flex-initial w-2/6 mr-20">
          <h1 className="text-white text-lg font-black mb-5">NFT Marketplace</h1>
          <p className="text-sm text-white ">
            Build your own marketplace for crypto
            collectibles and non-fungible tokens (NFTs). Buy, sell, and discover
            exclusive digital items.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-14 justify-between">
          <div>
            <h1 className="text-white text-sm font-black mb-3">Marketplace</h1>

            <ui>
              {[
                'All NFTs',
                'Art',
                'Collectibles',
                'Domain Names',
                'Music',
                'Photography',
                'Sports',
                'Trading Cards',
                'Utility',
                'Virtual Worlds',
              ].map((_, k) => (
                <li key={k} className="text-white text-xs list-none mb-2 font-thin">
                  <a href="#">{_}</a>
                </li>
              ))}
            </ui>
          </div>

          <div>
            <h1 className="text-white text-sm font-black mb-3">My Account</h1>

            <ui>
              {[
                'Account',
              ].map((_, k) => (
                <li key={k}  className="text-white text-xs list-none mb-2 font-thin">
                  <a href="#">{_}</a>
                </li>
              ))}
            </ui>
          </div>

          <div>
            <h1 className="text-white text-sm font-black mb-3">Resources</h1>

            <ui>
              {[
                'How to create your nft',
         
              ].map((_, k) => (
                <li key={k}  className="text-white text-xs list-none mb-2 font-thin">
                  <a href="#">{_}</a>
                </li>
              ))}
            </ui>
          </div>

        
        </div>
      </div>

      {/* WATER MARK */}

      <div className="text-center">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' ioss '}
          <span className={''}>
            {/* <Image src="" alt="Vercel Logo" width={72} height={16} /> */}
          </span>
        </a>
      </div>
    </footer>
  )
}
