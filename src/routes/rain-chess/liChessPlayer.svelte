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
  import {auth } from '$src/stores'
  import { location, querystring } from 'svelte-spa-router'
  import { EmissionContracts } from "$src/constants"; 
  import { Verify } from "rain-sdk" 


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

    } 

    
    data()
    

   

  } 

  


  let fields: any = {};

  let tweetURL = "";
  let tknUnits
  let getPromise

  let parserVmStateConfig: Writable<StateConfig> = writable(null)


  const Options = [
    {value: 2, label: "Select UserType"},
    { value: 0, label: "Verify Account" },
    { value: 1, label: "Verify Game" },
  ]
  let option: { value: number; label: string }

  // const tknOptions = [
  //   {value: 2, label: "Select Token Type"},
  //   { value: 0, label: "Buy Enery TKN" },
  //   { value: 1, label: "Stake Chess TKN" },
  // ]
  // let tknOption: { value: number; label: string }

  // let parserVmStateConfig: Writable<StateConfig> = writable(null)
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

  const handleSubmit = async () =>{  

     let id = tweetURL.split('/').pop()  

     let gameId = `vpNeHkst`   

    let contractAgruments : GameStruct = {
      timestamp : 1665036973200 , 
      white : '0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440' ,
      black : '0x0000000000000000000000000000000000000000' ,
      whiteResult : 0 , 
      blackResult : 1 ,
      whiteElo : 1500 ,
      BlackElo : 1520
   }

     // , WhiteRatingDiff , BlackRatingDiff added later 
     // arr = [ timestamp , white , black , whiteResult , blackResult , whiteElo , BlackElo  ]  
     // sample values = (uint256 of )[ 1665036973200 , 0x973EbeF3889daACBb9bB7f97AbfD4f6e20D26440 , 0x0000000000000000000000000000000000000000 , 0 , 1 , 1500 , 1520  ]

    //  let verifyReq
    //  if(option.value == 0){
    //    verifyReq = await axios.post('http://localhost:5000/api/v2/registerChessId' , {
    //      tweetId :  id
    //    })  
       
    //  }else if(option.value == 1){
    //    let address = await $signer.getAddress() 
       
    //    verifyReq = await axios.post('http://localhost:5000/api/v2/chessGame' , {
    //      tweetId :  id ,
    //      address : address.toLowerCase()
    //    })   
    //  }  
    //  console.log(verifyReq)
    //  simulatedResult = `Claimable Tokens : ${verifyReq.data.data.gameTokens}` 
    //  tweetURL = `` 
} 

const handleClaim =async () => {
  let emissionsContract = new EmissionsERC20(EmissionContracts.contractAddress, $signer)   

     let tx = await emissionsContract.claim( $signerAddress ,ethers.constants.AddressZero , {
         gasPrice : ethers.utils.parseUnits('350', 'gwei'),
         gasLimit :  '200000'
     })  

     let reuslt = await tx.wait()
     console.log(reuslt )  

    //  claimFlag = !claimFlag
}

const handleClick = async () => { 

    const { validationResult } = await validateFields(fields);
    if (!validationResult) return;
    deployPromise = handleSubmit();
  }; 

  const loginWithLichess = async () => { 

    console.log("auth", $auth);
    
      let data = await $auth.login()   
      console.log("data", data);
      
};
console.log("data", params);


</script>

<!-- <div class="flex gap-x-3 relative">
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
              <img src="/assets/twitter.png" width='32' height='32' alt='twitter' class='me-4' />
            </div>
            <div class="col-span-11">
                <p>
                  Verify via Twitter, make a <a target='_blank' class="text-blue-400 underline" href='https://twitter.com/intent/tweet?text=Requesting%20verifcation%20of%20address%200x0000000000000000000000000000000000000000%20for%20%40rainprotocol.%20Check%20out%20Rain%20Rrotocol%20at%20https%3A%2F%2Fdocs.rainprotocol.xyz%2F%20%23rainprotocol%20%23nft'>tweet</a> with your Ethereum address pasted into the contents (surrounding text doesn't matter).                  Copy-paste the tweets URL into the above input box and fire away!
                </p>
            </div>
          </div>
          <div class="grid grid-cols-12 items-center" >
            <div class="col-span-1 grid justify-center gap-y-4">
              <img src="/assets/lichess.svg" width='32' height='32' alt='twitter' class='me-4' />
            </div>
            <div class="col-span-11">
                <p>
                  Verify via Twitter, make a <a target='_blank' class="text-blue-400 underline" href='https://twitter.com/intent/tweet?text=Requesting%20verifcation%20of%20address%200x0000000000000000000000000000000000000000%20for%20%40rainprotocol.%20Check%20out%20Rain%20Rrotocol%20at%20https%3A%2F%2Fdocs.rainprotocol.xyz%2F%20%23rainprotocol%20%23nft'>tweet</a> with your Ethereum address pasted into the contents (surrounding text doesn't matter).
                  Copy-paste the tweets URL into the above input box and fire away!
                </p>
            </div>
          </div>
        </div>
        <span class="text-xl font-semibold">Claimable amount expression</span>
          <div class="max-w-prose">Enter the tweet URL and check claimable</div>
          <div class="grid grid-cols-2 gap-4">
            <Input
              type="text"
             
              placeholder="Tweet URL"
              bind:this={fields.tweetURL}
              bind:value={tweetURL}
              validator={required}
            >
              <span slot="label">Name</span>
            </Input>
            <Select
              items={Options}
              bind:value={option}
              on:change={() => {
                  if(option.value != 2) document.getElementById("express").style.display = "grid";
                  else document.getElementById("express").style.display = "none";
              }}
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
                        Invalid expression
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

    <Section>
      <SectionHeading>Claim</SectionHeading>
      <SectionBody>
        <span class="text-xl font-semibold">Claimable amount</span>
          <div class="max-w-prose">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
        <div class="self-start flex flex-row items-center gap-x-2 py-4"> 
          <Button shrink disabled={!$signer || !deployPromise} on:click={handleClaim}> Claim </Button>
        {#if !$signer}
        <span class="text-gray-600">Connect your wallet to deploy</span>
        {/if}
      </div>
      </SectionBody>
      <!-- <SectionBody>
        <Select
              items={tknOptions}
              bind:value={tknOption}
              on:change={() => {
                   if(tknOption.value != 2) document.getElementById("exp").style.display = "grid";
                  else document.getElementById("exp").style.display = "none";
              }}
            >
              <span slot="label"> Select The Option: </span>
        </Select>
        <div id="exp" style="display: none;">
          <div class="grid grid-cols-2 gap-4 pb-4">
            <Item>
              <Label>You can {tknOption?.value == 0 ? "Buy token" : "Stake Token"} : </Label>
              <Info>{tknOption?.value == 0 ? "10 ETKN/0.01 Matic" : "10 ETKN/0.01 Chess TKN"}</Info>
            </Item>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="number of tokens"
              bind:this={fields.units}
              bind:value={tknUnits}
              validator={required}
            >
              <span slot="label">Number of tokens {tknOption?.value == 0 ? "want to Buy" : "want to stake"} </span>
            </Input>
          </div>
          <div class="self-start flex flex-row items-center py-4 gap-x-2">
            <Button shrink disabled={!$signer} on:click={handleEnergy}>Confirm</Button>
            {#if !$signer}
            <span class="text-gray-600">Connect your wallet to deploy</span>
            {/if}
          </div>
        </div>
      </SectionBody> 
    </Section>

    
  </div>

  <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400 ">
    <StakeNBuy />
  </div> 

</div>  -->

<div>
  <button on:click={loginWithLichess}>Login With LiChess </button>
  <!-- <div>
    current page location:   {$location}
   </div>
   <div>current page query:   {$querystring}</div>
   <div>current page param:   {params}</div> -->
</div>

