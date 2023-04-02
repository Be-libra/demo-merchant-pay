import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers"
import { useEffect, useState } from 'react';
import getLinker from './deeplink';
import mobileCheck from './mobileCheck';
import { disconnect } from "@wagmi/core";


function App() {

  const [isConnect, setIsConnect] = useState("")
  const [params,setParams] = useState()

  useEffect(()=>{
    disconnect();

    const urlParams = new URLSearchParams(window.location.search);
    const query_params ={}
    for (const [key, value] of urlParams) {
        console.log(`${key}:${value}`);
        query_params.key = value
    }

    setParams(query_params)
},[])

// http://localhost:3000/one-time-payment?amount=1000&recipient=0x485BB49FfCa23b98a625f317CafEdc0C14c95615&chainId=5&label=abc&token=0x485BB49FfCa23b98a625f317CafEdc0C14c95615

  const pay =async() =>{
    try {
      if(!params?.orderId){
        setIsConnect("OrderId missing, scan QR again")
        return
      }
      const currentURl = window.location.href
      const yourWebUrl = currentURl.split("https://")[1]
      const deepLink = `https://metamask.app.link/dapp/${yourWebUrl}`;
      const downloadMetamaskUrl = "https://metamask.io/download.html";
      if(mobileCheck() && !window?.ethereum){
        const linker = getLinker(downloadMetamaskUrl);
        linker.openURL(deepLink);
      }
      const provider = new ethers.providers.Provider(window.ethereum)


      // MetaMask requires requesting permission to connect users accounts
      await provider.send("eth_requestAccounts", []);

      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const signer = provider.getSigner()

      const tx = await (await signer).sendTransaction({
        to: params?.recipient,
        value: params?.amount
      });

      setIsConnect(tx.hash)
      console.log(tx);
      if(tx){
        await tx.wait();
        console.log(tx);
        setIsConnect("new hash")
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={pay}>
          pay
        </button>
        {isConnect}
      </header>
    </div>
  );
}

export default App;
