import React, { useEffect, useState } from "react";
import { useConnect, usePrepareSendTransaction, useSendTransaction, useSigner, useWaitForTransaction } from "wagmi";
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import mobileCheck from "./mobileCheck";
import { disconnect } from "@wagmi/core";
import { ethers } from "ethers";



export default function Payment (){

    const { connectAsync } = useConnect();
    const { data: signer, isError } = useSigner()
    const walletConnectWagmi = useConnect({
      connector: new WalletConnectConnector({ options: { showQrModal: true, projectId:"cb38f918cf392b9e5e0c5dfbf9cbd0bb" } })
    });

    const [isConnected, setIsConnected] = useState(false)

    const { config } = usePrepareSendTransaction({
        request: {
          to: "0x485BB49FfCa23b98a625f317CafEdc0C14c95615",
          value:  ethers.utils.parseEther("0.001"),
        },
      })

      const { data, sendTransaction } = useSendTransaction(config)
     
      const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
      })


    useEffect(()=>{
        disconnect();
    },[])

    
    const onPay = async() =>{
        if((mobileCheck() && !window.ethereum)){
            //wallet connect
            try {
                const connect = await walletConnectWagmi.connectAsync;
                const { account, chain } = await connect();
                console.log(account, chain, "this is connect");
                setIsConnected(true)
            } catch (error) {
                return
            }
        }
        else{
            try {
                const { account, chain, provider } = await connectAsync({ connector: new MetaMaskConnector({options: {
                    shimChainChangedDisconnect: false,
                  }}),chainId:5 });

                  setIsConnected(true)

            } catch (error) {
                console.log(error,"here is error");
                return
            }
      
        }

       
    }

    
    return(
        <div style={{display : "flex", flexDirection : "column", justifyContent:"center", height:"100vh", alignItems : "center"}}>
            <button style={{width:"120px", height:"50px", marginBottom:"30px"}} onClick={() => (!isConnected ? onPay() : sendTransaction?.())}>{isConnected ? "Pay Amount" : "Login"}</button>
            {data?.hash}
            <p style={{color : "orange"}}>{isLoading ? "Wait for confirmation" : ""}</p>
            <p style={{color : "green"}}>{isSuccess ? "User Paid successfully" : ""}</p>
        </div>
    )
}