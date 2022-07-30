const conf = {
  // api_url: 'http://localhost:4000', //local
  // api_url: 'http://127.0.0.1:7401', //docker
  api_url: 'https://nft-marketplace-ioss.herokuapp.com', // live
  // contract_address: '0xBE2FC973AF47066f73e2d11149B5547dA8fb0701', //old polygon
  contract_address: '0x4D89a82002E0e8cfA42AAb52307E136339FC00a6', //bsc new
  categories: [
    'All',
    'Art',
    'Collectibles',
    'Domain Names',
    'Music',
    'Photography',
    'Sports',
    'Trading Cards',
    'Utility',
    'Virtual Worlds',
    'Other',
  ],
  coin_icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  eth_icon: "https://openseauserdata.com/files/265128aa51521c90f7905e5a43dcb456_new.svg"
}
export default conf
