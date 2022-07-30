import { useState } from 'react';
import Web3 from 'web3';
import contract_abi from '../abi/abi';

function App() {

    const [account, setAccount] = useState(0);
    const connectMeta = () => {
        const accounts = (async () => await ConnectMeta())();
        accounts.then( result => { setAccount(result) } );
    }

    return (
        <div className="App">
            <button className="cntbtn" onClick={() => connectMeta()}>CONNECT</button>
            <p id="accounts">Connected Account = {account}</p>
        </div>
    );
}

async function test(){
    // get balance
// const balance = await web3.eth.getBalance(address)
// console.log(`balance : ${balance}`)
// await contract_abi.methods.call();
const web3 = new Web3(window.ethereum);
var name  =  await contract_abi(web3).methods.symbol().call()
console.log("-------",name);
// await contract_abi.methods.enter().send({
//   from: accounts[0],
//   value: web3.utils.toWei(value, 'ether'),
// });
}

async function ConnectMeta() {

    const web3 = new Web3(window.ethereum);

    // check if any wallets are present
    try {
        if (typeof window.ethereum == 'undefined') {
            alert('Wallet is not installed!');
            return
        }
    } catch (checkError) {
        alert('checkError ' + checkError);
        return
    }

    // Select metamask as default provder
    if (window.ethereum.providers) {
        var provider = await window.ethereum.providers.find((provider) => provider.isMetaMask);
    } else {
        if (window.ethereum.isMetaMask) {
            provider = window.ethereum;
        } else {
            alert('Metamask Wallet is not installed!');
            return
        }
    }

    // Ask for connection and get user address from metamask
    try {
        var accounts = await provider.request({method: 'eth_requestAccounts'});
        await test();
    } catch (reqError) {
        if (reqError.code === 4001) {
            alert('User rejected the request')
        } else {
            alert(reqError);
        }
        return
    }

    return accounts[0];
}

export default App;
