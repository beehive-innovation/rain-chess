
<script> 


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
//   import { writable, type Writable } from "svelte/store";
  import IconLibrary from "$components/IconLibrary.svelte";
  import StakeNBuy from "$routes/rain-chess/Stake&Buy.svelte";
  import { getContext } from "svelte";
  import { params, push, pop, replace } from "svelte-spa-router";
  import Select from "$components/Select.svelte";
//   import {  EmissionsERC20JSVM, type StateConfig } from "rain-sdk"; 
  import {EmissionsERC20} from "rain-sdk" 
  import { ethers } from 'ethers';  
  import axios from 'axios'
  import {auth } from '$src/stores'
  import { location, querystring } from 'svelte-spa-router'
  import { EmissionContracts } from "$src/constants"; 
  import { Verify } from "rain-sdk"  
  import ContractsConfigs from "../../../mumbai.json"


  import  { Auth } from "$src/test";
  const { open } = getContext('simple-modal') 
  
  const urlParams = new URLSearchParams(window.location.search);
  console.log("Has data ? = ", urlParams.has('code'));
  console.log("\nWOrld");   
  
  function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

  $: if(urlParams.has('code')) { 
    const data =async () => {
      console.log("init called ") 
     await $auth.init() 
     console.log($auth.me,"hii") 
     if($auth.me && $signer){

       let verifyContract = new Verify('0xb8c01dee6a0f920d51ea137d4908f65b13c41bc1' , $signer)  
       
       let encoder = new TextEncoder()
  
        let verifySubmit = await verifyContract.approve([{
          account : $signerAddress , data : str2ab($auth.me.id)
        }])  
      console.log(verifySubmit)
     }
    //  pop()
    console.log("urlParams", window.location);  
     replace('/player')
    } 
    data()
  } 
  $ : console.log("urlParams", window.location);

  const loginWithLichess = async () => { 

console.log("auth", $auth);

  let data = await $auth.login()   
  console.log("data", data);
  
};

</script>

<div>
    <div>
        <button on:click={loginWithLichess}>Login With LiChess </button>
        <!-- <div>
          current page location:   {$location}
         </div>
         <div>current page query:   {$querystring}</div>
         <div>current page param:   {params}</div> -->
      </div>
      
</div>