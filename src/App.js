import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers"
import { useState } from 'react';
import getLinker from './deeplink';
import mobileCheck from './mobileCheck';


function App() {

  const [isConnect, setIsConnect] = useState("")


  const pay =async() =>{
    try {
      const currentURl = window.location.href
      const yourWebUrl = currentURl.split("https://")[1]
      const deepLink = `https://metamask.app.link/dapp/${yourWebUrl}`;
      const downloadMetamaskUrl = "https://metamask.io/download.html";
      if(mobileCheck() && !window?.ethereum){
        const linker = getLinker(downloadMetamaskUrl);
        linker.openURL(deepLink);
      }
      const provider = new ethers.BrowserProvider(window.ethereum)


      // MetaMask requires requesting permission to connect users accounts
      await provider.send("eth_requestAccounts", []);

      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const signer = provider.getSigner()

      const tx = await (await signer).sendTransaction({
        to: "0x77BC322f05f1728465428a9788612CFE029EeEC1",
        value: ethers.parseEther(".01")
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
