<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import { validateFields } from "../../utils";
  import { addressValidate, required } from "../../validation";
  import Parser from "$components/parser/Parser.svelte";
  import Label from "$routes/rain-chess/Label.svelte";
  import Info from "$routes/rain-chess/Info.svelte";
  import Section from "$routes/rain-chess/Section.svelte";
  import SectionHeading from "$routes/rain-chess/SectionHeading.svelte";
  import SectionBody from "$routes/rain-chess/SectionBody.svelte";
  import Item from "$routes/rain-chess/Item.svelte";
  import { writable, type Writable } from "svelte/store";
  import IconLibrary from "$components/IconLibrary.svelte";
  import StakeNBuy from "$routes/rain-chess/Stake&Buy.svelte";
  import { getContext } from "svelte";
  import { params, push } from "svelte-spa-router";
  import Select from "$components/Select.svelte";
  import {  EmissionsERC20JSVM, type StateConfig } from "rain-sdk"; 
  import {EmissionsERC20} from "rain-sdk" 
  import { ethers } from 'ethers';  
  import axios from 'axios'

  import ContractsConfigs from "../../../mumbai.json"

  $: oAuth = JSON.parse(localStorage.getItem('oauth2authcodepkce-state'))

  import  { Auth } from "$src/test";
  const { open } = getContext('simple-modal') 

  let fields: any = {};

  let gameID = "";
  let tknUnits = ""
  let getPromise 
  let signedContext

  let claim = false

  $: if($signer){   


    const authorizeAccount = async () => { 

       let authToken = JSON.parse(localStorage.getItem('oauth2authcodepkce-state')) 
       console.log('authToken : ' , authToken)
       console.log('authToken : ' , authToken.accessToken.value) 
       oAuth = authToken

       let authResult = await axios.post('http://localhost:5000/api/v2/verifyAccount' , {address : $signerAddress , lichessToken : authToken.accessToken.value})  
       console.log('authResult : ' , authResult )
       if(!authResult.data.status){
        alert(`${authResult.data.message}`)
       } 

       alert(`${authResult.data.message}`)

    } 

    authorizeAccount()

   
   
  }

  const urlParams = new URLSearchParams(window.location.search);

  $: if(urlParams.has('code')) { 
 
    //  if($auth.me && $signer){

    //    let verifyContract = new Verify('0xb8c01dee6a0f920d51ea137d4908f65b13c41bc1' , $signer)  
       
    //    let encoder = new TextEncoder()
  
    //     let verifySubmit = await verifyContract.approve([{
    //       account : $signerAddress , data : str2ab($auth.me.id)
    //     }])  
    //   console.log(verifySubmit)
    //  }

    const data = async () =>{
      let authToken = JSON.parse(localStorage.getItem('oauth2authcodepkce-state')) 
      console.log('authToken : ', authToken )
      
      
      window.history.pushState({}, null, '/');
      push('/player')

      let accData = await axios.get("https://lichess.org/api/account", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken.accessToken.value}`
                },
            })

      console.log("acc", accData);
      
    }
    data()

  } 

  let parserVmStateConfig: Writable<StateConfig> = writable(null)


  const Options = [
    {value: 2, label: "Select UserType"},
    { value: 0, label: "Verify Account" },
    { value: 1, label: "Verify Game" },
  ]
  let option: { value: number; label: string } 

  const tokenOption = [ 
    {value: 0, label: "Select UserType"},

    {value: 1, label: "Win Token"},
    { value: 2, label: "Experience Token" },
    { value: 3, label: "GM Token" },
    { value: 4, label: "Improve Token" }
  ]
  let tokenOptionValue: { value: number; label: string }

  let newEmissionsERC20
  let simulatedResult 
  let deployPromise

  $: if ($parserVmStateConfig && $signer) simulate()

  const simulate = async () => {
    simulatedResult = null
    if ($parserVmStateConfig?.sources[0].length) {
      const simulator = new EmissionsERC20JSVM($parserVmStateConfig, {signer: $signer})
      simulatedResult = await simulator.run({context: [$signerAddress]})
    }
  }   

  const handleOptionSubmit = async () => { 
    console.log("In handle Submit : " , gameID) 
    if(option.value != 2) document.getElementById("express").style.display = "grid";
    else document.getElementById("express").style.display = "none";  

    let claimResult = option.value == 1 ? await axios.post(`http://localhost:5000/api/v2/computeGame` ,{gameId :gameID , winnerAddress : $signerAddress ,lichessToken: oAuth.accessToken.value}) : undefined
    console.log(claimResult?.data)

    simulatedResult = claimResult != undefined ? `
      GM Tokens Won : ${claimResult?.data?.data?.GM} ,
      IMPRV Tokens Won : ${claimResult?.data?.data?.IMPRV} ,
      XP Tokens Won : ${claimResult?.data?.data?.XP} ,
      Win Tokens Won : ${claimResult?.data?.data?.WIN} ,
    ` : "Please select Verify Game"
  } 

  const handleTokenOptionSubmit = async () => {
    // console.log("gameId : " , gameId)  
    console.log("tokenOptionValue : " , tokenOptionValue)  
    console.log("signedContext : " , signedContext)  

    

    // let contract = new ethers.Contract(ContractsConfigs.flow_ENERGY , [{"inputs":[{"internalType":"address","name":"interpreterIntegrity_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_size","type":"uint256"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"InvalidCodeAtRange","type":"error"},{"inputs":[],"name":"WriteError","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"interpreterStateConfig","type":"tuple"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig[]","name":"flows","type":"tuple[]"}],"indexed":false,"internalType":"struct FlowERC20Config","name":"config","type":"tuple"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"indexed":false,"internalType":"struct StateConfig","name":"config","type":"tuple"}],"name":"SaveInterpreterState","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"flow_","type":"uint256"},{"internalType":"uint256","name":"id_","type":"uint256"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContexts_","type":"tuple[]"}],"name":"flow","outputs":[{"components":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"mints","type":"tuple[]"},{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"burns","type":"tuple[]"},{"components":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct NativeTransfer[]","name":"native","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20Transfer[]","name":"erc20","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"internalType":"struct ERC721Transfer[]","name":"erc721","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC1155Transfer[]","name":"erc1155","type":"tuple[]"}],"internalType":"struct FlowTransfer","name":"flow","type":"tuple"}],"internalType":"struct FlowERC20IO","name":"","type":"tuple"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"interpreterStateConfig","type":"tuple"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig[]","name":"flows","type":"tuple[]"}],"internalType":"struct FlowERC20Config","name":"config_","type":"tuple"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"flow_","type":"uint256"},{"internalType":"uint256","name":"id_","type":"uint256"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContexts_","type":"tuple[]"}],"name":"previewFlow","outputs":[{"components":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"mints","type":"tuple[]"},{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"burns","type":"tuple[]"},{"components":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct NativeTransfer[]","name":"native","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20Transfer[]","name":"erc20","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"internalType":"struct ERC721Transfer[]","name":"erc721","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC1155Transfer[]","name":"erc1155","type":"tuple[]"}],"internalType":"struct FlowTransfer","name":"flow","type":"tuple"}],"internalType":"struct FlowERC20IO","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"storageOpcodesRange","outputs":[{"components":[{"internalType":"uint256","name":"pointer","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"internalType":"struct StorageOpcodesRange","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]  , $signer)
    // let tx = await contract.flow(ContractsConfigs.flowStates_ENERGY_BURN.hex , 12341234 , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
    // let receipt = await tx.wait() 
    // console.log(receipt) 

    let contractWIN = new ethers.Contract(ContractsConfigs.flow_WIN , [{"inputs":[{"internalType":"address","name":"interpreterIntegrity_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_size","type":"uint256"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"InvalidCodeAtRange","type":"error"},{"inputs":[],"name":"WriteError","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"interpreterStateConfig","type":"tuple"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig[]","name":"flows","type":"tuple[]"}],"indexed":false,"internalType":"struct FlowERC20Config","name":"config","type":"tuple"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"indexed":false,"internalType":"struct StateConfig","name":"config","type":"tuple"}],"name":"SaveInterpreterState","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"flow_","type":"uint256"},{"internalType":"uint256","name":"id_","type":"uint256"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContexts_","type":"tuple[]"}],"name":"flow","outputs":[{"components":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"mints","type":"tuple[]"},{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"burns","type":"tuple[]"},{"components":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct NativeTransfer[]","name":"native","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20Transfer[]","name":"erc20","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"internalType":"struct ERC721Transfer[]","name":"erc721","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC1155Transfer[]","name":"erc1155","type":"tuple[]"}],"internalType":"struct FlowTransfer","name":"flow","type":"tuple"}],"internalType":"struct FlowERC20IO","name":"","type":"tuple"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"interpreterStateConfig","type":"tuple"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig[]","name":"flows","type":"tuple[]"}],"internalType":"struct FlowERC20Config","name":"config_","type":"tuple"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"flow_","type":"uint256"},{"internalType":"uint256","name":"id_","type":"uint256"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContexts_","type":"tuple[]"}],"name":"previewFlow","outputs":[{"components":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"mints","type":"tuple[]"},{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"burns","type":"tuple[]"},{"components":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct NativeTransfer[]","name":"native","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20Transfer[]","name":"erc20","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"internalType":"struct ERC721Transfer[]","name":"erc721","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC1155Transfer[]","name":"erc1155","type":"tuple[]"}],"internalType":"struct FlowTransfer","name":"flow","type":"tuple"}],"internalType":"struct FlowERC20IO","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"storageOpcodesRange","outputs":[{"components":[{"internalType":"uint256","name":"pointer","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"internalType":"struct StorageOpcodesRange","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]  , $signer)
    let tx2 = await contractWIN.flow(ContractsConfigs.flowStates_WIN.hex , 1234123411 , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
    let receipt2 = await tx2.wait()  

    console.log(receipt2)  

    let contractGM = new ethers.Contract(ContractsConfigs.flow_GM , [{"inputs":[{"internalType":"address","name":"interpreterIntegrity_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_size","type":"uint256"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"InvalidCodeAtRange","type":"error"},{"inputs":[],"name":"WriteError","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"interpreterStateConfig","type":"tuple"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig[]","name":"flows","type":"tuple[]"}],"indexed":false,"internalType":"struct FlowERC20Config","name":"config","type":"tuple"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"indexed":false,"internalType":"struct StateConfig","name":"config","type":"tuple"}],"name":"SaveInterpreterState","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"flow_","type":"uint256"},{"internalType":"uint256","name":"id_","type":"uint256"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContexts_","type":"tuple[]"}],"name":"flow","outputs":[{"components":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"mints","type":"tuple[]"},{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"burns","type":"tuple[]"},{"components":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct NativeTransfer[]","name":"native","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20Transfer[]","name":"erc20","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"internalType":"struct ERC721Transfer[]","name":"erc721","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC1155Transfer[]","name":"erc1155","type":"tuple[]"}],"internalType":"struct FlowTransfer","name":"flow","type":"tuple"}],"internalType":"struct FlowERC20IO","name":"","type":"tuple"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"interpreterStateConfig","type":"tuple"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig[]","name":"flows","type":"tuple[]"}],"internalType":"struct FlowERC20Config","name":"config_","type":"tuple"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"flow_","type":"uint256"},{"internalType":"uint256","name":"id_","type":"uint256"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContexts_","type":"tuple[]"}],"name":"previewFlow","outputs":[{"components":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"mints","type":"tuple[]"},{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20SupplyChange[]","name":"burns","type":"tuple[]"},{"components":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct NativeTransfer[]","name":"native","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC20Transfer[]","name":"erc20","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"internalType":"struct ERC721Transfer[]","name":"erc721","type":"tuple[]"},{"components":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ERC1155Transfer[]","name":"erc1155","type":"tuple[]"}],"internalType":"struct FlowTransfer","name":"flow","type":"tuple"}],"internalType":"struct FlowERC20IO","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"storageOpcodesRange","outputs":[{"components":[{"internalType":"uint256","name":"pointer","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"internalType":"struct StorageOpcodesRange","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]  , $signer)
    let tx3 = await contractGM.flow(ContractsConfigs.flowStates_GM.hex , 1234123411 , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
    let receipt3 = await tx3.wait()  

    console.log(receipt3) 



  }
  


  const claimFlowReward = async () => {  

     
      let gameData = await axios.post('http://localhost:5000/api/v2/processGame' , {gameId :gameID , winnerAddress : $signerAddress ,lichessToken: oAuth.accessToken.value}) 
      
      console.log("gameID  :" , ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(gameID))).toString())

      const contextLiChess = {
        winner: $signerAddress, // winner 
        experiencePoints: 10,
        isImproved: true,
        isBeatenGM: true,
        flow_ENERGY: ContractsConfigs.flow_ENERGY,
        id_ENERGY: ContractsConfigs.flowStates_ENERGY_BURN.hex,
        flow_WIN: ContractsConfigs.flow_WIN ,
        id_WIN: ContractsConfigs.flowStates_WIN.hex,
        flow_XP: ContractsConfigs.flow_XP ,
        id_XP: ContractsConfigs.flowStates_XP.hex,
        flow_GM: ContractsConfigs.flow_GM ,
        id_GM: ContractsConfigs.flowStates_GM.hex,
        flow_IMPROVE: ContractsConfigs.flow_IMPROVE ,
        id_IMPROVE: ContractsConfigs.flowStates_IMPROVE.hex ,
        gameId: ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(gameID))).toString()
      };   

      claim = true 
      signedContext = gameData.data.data 
     
      
      // let tx = await lichessContract.claimReward(contextLiChess, "0x00", [gameData.data.data]) 
      // let res =await  tx.wait() 
      // console.log(res)
  }

  const handleClick = async () => { 

    const { validationResult } = await validateFields(fields);
    if (!validationResult) return;
    deployPromise = claimFlowReward();
  }; 

</script>

<div class="flex gap-x-3 relative">
  <div class="flex w-2/3 flex-col gap-y-6 p-8">
    <span class="text-3xl font-semibold">liChess Player</span>
    
    <Section>
      <SectionHeading>Game</SectionHeading>
      <SectionBody>
        <Item>
          <span class="text-xl font-medium max-w-prose">Go to <a target='_blank' class="text-blue-400 underline" href="https://lichess.org/">lichess</a>, register account and play a game </span> 
        </Item>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Verify (2)</SectionHeading>
      <SectionBody>
        <div class="mb-2 flex flex-col w-full space-y-4"> 

          <div class="grid grid-cols-12 items-center" >
            <div class="col-span-1 grid justify-center gap-y-4">
              <img src="/assets/user.png" width='30' height='30' alt='twitter' class='me-4' />
            </div>
            <div class="col-span-11">
                <p>
                  Login through LiChess Account , Connect your wallet and submit verification 
                </p>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center" >
            <div class="col-span-1 grid justify-center gap-y-4">
              <img src="/assets/lichess.svg" width='32' height='32' alt='twitter' class='me-4' />
            </div>
            <div class="col-span-11">
                <p>
                  Go to <a target='_blank' class="text-blue-400 underline" href="https://lichess.org/">lichess</a> and participate in games, tournaments, streams . 
                  Copy-paste the game Id to claim tokens. 
                </p>
            </div>  
          </div>
        </div>
        <span class="text-xl font-semibold">Claimable amount expression</span>
          <div class="max-w-prose">Enter the GameId and check claimable</div>
          <div class="grid grid-cols-2 gap-4">
            <Input
              type="text"
             
              placeholder="Game ID"
              bind:this={fields.gameID}
              bind:value={gameID}
              validator={required}
            >
              <span slot="label">Name</span>
            </Input>
            <Select
              items={Options}
              bind:value={option}
              on:change={handleOptionSubmit}
            >
              <span slot="label"> Select The Option: </span>
            </Select>
          </div>

          <div class="flex flex-row gap-x-2 items-center  bg-violet-200 rounded-lg self-start p-3 max-w-prose">
            <IconLibrary width={30} icon="tip" />
            <div class="max-w-prose">Remember - You need energy to Register and Verify.</div>
          </div>
          <div id="express" style="display: none;">
          <div class="grid grid-cols-7 gap-4 items-stretch" >
            <div class="col-span-4 flex flex-col gap-y-4 break-words">
              <Parser vmStateConfig={parserVmStateConfig} />
            </div>
            <div class="col-span-3">
              <div class="bg-amber-200 rounded-lg p-4 h-full ">

                <div class="font-mono text-black text-sm break-words" >
                  <span>Simulated output: </span>
                  <span>
                    {#if $signer}
                      {#if simulatedResult}
                        {simulatedResult?.toString()}
                      {:else}
                        ''
                      {/if}
                    {:else}
                      Connect your wallet to simulate your expression
                    {/if}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="self-start flex flex-row items-center gap-x-2 py-4"> 
              <Button shrink disabled={!$signer} on:click={handleClick}> Submit </Button>
            {#if !$signer}
            <span class="text-gray-600">Connect your wallet to deploy</span>
            {/if}
          </div>
        </div>
      </SectionBody>
    </Section> 

    {#if claim} 

    <Section>
      <SectionHeading>Cliam Rewarsds for game</SectionHeading>
      <SectionBody>
        
       
          <div class="max-w-prose">Claim Rewards</div>
          <div class="grid grid-cols-2 gap-4">
            
            <Select
              items={tokenOption}
              bind:value={tokenOptionValue}
              on:change={handleTokenOptionSubmit}
            >
              <span slot="label"> Select The Option: </span>
            </Select>
          </div>

          
          <div id="express" style="display: none;">
         
          <div class="self-start flex flex-row items-center gap-x-2 py-4"> 
              <Button shrink disabled={!$signer} on:click={handleClick}> Submit </Button>
            {#if !$signer}
            <span class="text-gray-600">Connect your wallet to deploy</span>
            {/if}
          </div>
        </div>
      </SectionBody>
    </Section>
    {/if}  
    
  </div>

  <div class="w-1/3 gap-y-4 bottom-0 top-16 right-0 border-l border-gray-400 ">
    <StakeNBuy />
  </div> 

</div> 

