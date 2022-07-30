import Web3 from 'web3'
import {ethers} from 'ethers'


import conf from '../global/constants'

// METHOD 1

export async function createVoucher(assignedAddress, tokenId, uri, minPrice = 0,) { // const assignedAddress =  accounts[0];

    const voucher = {
        assignedAddress,
        tokenId,
        minPrice,
        uri
    }
    const domain = {
        name: 'infiniteNFT-Voucher',
        version: '1',
        verifyingContract: conf.contract_address,
        // chainId: '80001', // polygon testnet
        chainId: '97', // binance testnet
    }
    const types = {
        NFTVoucher: [
            {
                name: 'assignedAddress',
                type: 'address'
            }, {
                name: 'tokenId',
                type: 'uint256'
            }, {
                name: 'minPrice',
                type: 'uint256'
            }, {
                name: 'uri',
                type: 'string'
            },
        ]
    }
    // const signature = await signer._signTypedData(domain, types, voucher)

    var privateKey = '83945d516a3871cd36b573796e6dafb8469e493a24b5da481dbd46e01f5f8bb1'
    // let signer = new Web3.ethers.Wallet(privateKey)
    let signer = new ethers.Wallet(privateKey)


    const signature = await signer._signTypedData(domain, types, voucher)
    return {
        ... voucher,
        signature
    }
}



// METHOD 2

// export default async function createVoucher_(assignedAddress, tokenId, uri, minPrice = 0,) {
//     try {
//         if (typeof window.ethereum !== 'undefined') {
//             console.log('Wallet is installed!')
//         } else {
//             console.log('Metamask Wallet is not installed!')
//             return
//         }
//     } catch (checkError) {
//         alert('checkError ' + checkError)
//         return
//     }

//     if (window.ethereum.providers) {
//         console.log('Multiple wallet providers detected')
//         var provider = await window.ethereum.providers.find((provider) => provider.isMetaMask,)
//         console.log('Selected metamask as default wallet')
//     } else {
//         if (window.ethereum.isMetaMask) {
//             provider = window.ethereum
//             console.log('Metamask found and selected as default wallet')
//         } else {
//             console.log('Metamask Wallet is not installed!')
//             return
//         }
//     }

//     try {
//         var accounts = await provider.request({method: 'eth_requestAccounts'})
//         console.log('address received : ' + accounts[0])
//     } catch (reqError) {
//         if (reqError.code === 4001) {
//             alert('User rejected the request')
//         } else {
//             alert(reqError)
//         }
//         return
//     }

//     const msgParams = {
//         domain: {
//             name: 'LazyNFT-Voucher',
//             version: '1',
//             verifyingContract: conf.contract_address, // '0x4C2207f1ae4e2d4BD0cB4F0CCC1e43546f5b0a11',
//             // chainId: '80001', // polygon testnet
//             chainId: '97', // binance testnet
//         },
//         message: {
//             assignedAddress,
//             tokenId,
//             minPrice,
//             uri
//         },
//         primaryType: 'NFTVoucher',

//         types: {
//             NFTVoucher: [
//                 {
//                     name: 'assignedAddress',
//                     type: 'address'
//                 }, {
//                     name: 'tokenId',
//                     type: 'uint256'
//                 }, {
//                     name: 'minPrice',
//                     type: 'uint256'
//                 }, {
//                     name: 'uri',
//                     type: 'string'
//                 },
//             ]
//         }
//     }
//     const msgParamsString = JSON.stringify(msgParams)

//     var from = accounts[0]
//     var params = [from, msgParamsString]
//     var method = 'eth_signTypedData_v4'
//     // var method = 'eth_signTypedData'

//     var signature = await provider.request({method, params, from})
//     // console.log(signature);

//     return {
//         ... msgParams.message,
//         signature
//     }
// }


// value={"types":["address","tuple(address,uint256,uint256,string,bytes)"],
// Voucher return

// {
//     "tokenId": "21",
//     "minPrice": 0,
//     "uri": "https://asdddd.com/asdd.json",
//     "signature": "0xa454999fcab9e8ee27fe86e7dc2e5fbdf473240ee2d1ddd417b61c84bc23979c0a09bbca79b9e6a3477b267cf99205967b592164a1438a85d93606ba44ddb45e1c"
// }


// ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "21",0,"https://asdddd.com/asdd.json","0xa454999fcab9e8ee27fe86e7dc2e5fbdf473240ee2d1ddd417b61c84bc23979c0a09bbca79b9e6a3477b267cf99205967b592164a1438a85d93606ba44ddb45e1c"]

