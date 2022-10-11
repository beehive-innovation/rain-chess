<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import { validateFields } from "../../utils";
  import { addressValidate, required } from "../../validation";
  import Parser from "$components/parser/Parser.svelte";
  import Label from "$routes/toy-token/Label.svelte";
  import Info from "$routes/toy-token/Info.svelte";
  import Section from "$routes/toy-token/Section.svelte";
  import SectionHeading from "$routes/toy-token/SectionHeading.svelte";
  import SectionBody from "$routes/toy-token/SectionBody.svelte";
  import Item from "$routes/toy-token/Item.svelte";
  import { writable, type Writable } from "svelte/store";
  import IconLibrary from "$components/IconLibrary.svelte";
  import OtherTokens from "$routes/toy-token/OtherTokens.svelte";
  import { getContext } from "svelte";
  import { push } from "svelte-spa-router";
  import Select from "$components/Select.svelte";
  import {  EmissionsERC20JSVM, type StateConfig } from "rain-sdk"; 
import {EmissionsERC20} from "rain-sdk" 
import { ethers } from 'ethers';  
  import axios from 'axios'
    import { EmissionConractDetails } from "$src/constants";
  const { open } = getContext('simple-modal')

  let fields: any = {};

  let tweetURL = "";
  let tknUnits

  let parserVmStateConfig: Writable<StateConfig> = writable(null)


  const Options = [
    {value: 2, label: "Select UserType"},
    { value: 0, label: "Register" },
    { value: 1, label: "Verify Game" },
  ]
  let option: { value: number; label: string }

  const tknOptions = [
    {value: 2, label: "Select Token Type"},
    { value: 0, label: "Buy Enery TKN" },
    { value: 1, label: "Stake Chess TKN" },
  ]
  let tknOption: { value: number; label: string }

  // let parserVmStateConfig: Writable<StateConfig> = writable(null)
  let newEmissionsERC20
  let simulatedResult 
  let claimFlag

  $: if ($parserVmStateConfig && $signer) simulate()

  const simulate = async () => {
    simulatedResult = null
    if ($parserVmStateConfig?.sources[0].length) {
      const simulator = new EmissionsERC20JSVM($parserVmStateConfig, {signer: $signer})
      simulatedResult = await simulator.run({context: [$signerAddress]})
    }
  }

  const handleClick = async () =>{ 
   
   if(!claimFlag){
     let id = tweetURL.split('/').pop() 
   
     let verifyReq
     if(option.value == 0){
       verifyReq = await axios.post('http://localhost:5000/api/v2/registerChessId' , {
         tweetId :  id
       })  
       
     }else if(option.value == 1){
       let address = await $signer.getAddress() 
       
       verifyReq = await axios.post('http://localhost:5000/api/v2/chessGame' , {
         tweetId :  id ,
         address : address.toLowerCase()
       })   
     }  
     console.log(verifyReq)
     simulatedResult = `Claimable Tokens : ${verifyReq.data.data.gameTokens}` 
     tweetURL = `` 
     claimFlag = !claimFlag

   }else{
     let emissionsContract = new EmissionsERC20(EmissionConractDetails.contractAddress, $signer)   

     let tx = await emissionsContract.claim( $signerAddress ,ethers.constants.AddressZero , {
         gasPrice : ethers.utils.parseUnits('350', 'gwei'),
         gasLimit :  '200000'
     })  

     let reuslt = await tx.wait()
     console.log(reuslt )  

     claimFlag = !claimFlag
   }
}
  const getExpressions = () =>{
    console.log("demo");
    
  }

  const calculateRate = () =>{
    console.log("demo");
    
  }

  const handleClick2 = async () => { 
    document.getElementById("express").style.display = "grid";
      if(option.value == 1) document.getElementById("exp").style.display = "none";
  }  

  const handleEnergy = async () => {  
 

    let emissionsContract = new EmissionsERC20(EmissionConractDetails.energyContractAddress, $signer)   

     let tx = await emissionsContract.claim( $signerAddress ,ethers.constants.AddressZero , {
         gasPrice : ethers.utils.parseUnits('350', 'gwei'),
         gasLimit :  '200000'
     })  

     let reuslt = await tx.wait()
     console.log(reuslt )  

  }

</script>

<div class="flex gap-x-3 relative">

  <div class="flex w-2/3 flex-col gap-y-6 p-8">

    <span class="text-3xl font-semibold">Rain Chess</span>

    <div class="mb-2 flex flex-col w-full">
      <Info>
        <div class='row mb-2'>
        <div class=' d-flex align-items-center'>
          <img src='../../../public/assets/twitter.png' width='32' height='32' alt='twitter' class='me-4' />
          <p>
          Verify via Twitter, make a <a target='_blank' href='https://twitter.com/intent/tweet?text=Requesting%20verifcation%20of%20address%200x0000000000000000000000000000000000000000%20for%20%40rainprotocol.%20Check%20out%20Rain%20Rrotocol%20at%20https%3A%2F%2Fdocs.rainprotocol.xyz%2F%20%23rainprotocol%20%23nft'>tweet</a> with your Ethereum address pasted into the contents (surrounding text doesn't matter).<br />
          Copy-paste the tweets URL into the above input box and fire away!
          </p>
      </div>
      <div class=' d-flex align-items-center'>
          <img src='../../../public/assets/lichess.svg' width='32' height='32' alt='twitter' class='me-4' />
          <p>
          Verify via Twitter, make a <a target='_blank' href='https://twitter.com/intent/tweet?text=Requesting%20verifcation%20of%20address%200x0000000000000000000000000000000000000000%20for%20%40rainprotocol.%20Check%20out%20Rain%20Rrotocol%20at%20https%3A%2F%2Fdocs.rainprotocol.xyz%2F%20%23rainprotocol%20%23nft'>tweet</a> with your Ethereum address pasted into the contents (surrounding text doesn't matter).<br />
          Copy-paste the tweets URL into the above input box and fire away!
          </p>
      </div> 
    </div>  


      </Info>
      <!-- <div>example expressions...</div> -->
    </div>
    <Section>
      <SectionHeading>Contract</SectionHeading>
      <SectionBody>
        <Item>
          <Label>Name</Label> 
          <Info> 
            <img src="../../../public/assets/knight2.png" class="h-6 w-6" />
            Chess TKN</Info>
        </Item>
        <Item>
          <Label>Source</Label>
          <Info>Rain</Info>
        </Item>
        <Item>
          <Label>Token</Label>
          <Info>ERC20</Info>
        </Item>
        <Item>
          <Label>Contract details</Label>
          <Info>Mint a new ERC20 which releases new supply whenever a valid claim is made. We script the claim step, and each wallet trying to claim needs to be meet the criteria to mint their ERC20s. In this way claiming criteria can implicitly set a total supply cap, wallet supply cap and more. Can be used for game credits, project tokens, rewards.</Info>
        </Item>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Expressions (1)</SectionHeading>
      <SectionBody>
        <span class="text-xl font-semibold">Claimable amount expression</span>
          <div class="max-w-prose">Enter the tweet URL and check claimable  <img src="../../../public/assets/knight2.png" class="h-6 w-6" /> ChessTKN</div>
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
              <Button shrink disabled={!$signer} on:click={handleClick}> {!claimFlag ? "Submit" : "Claim"} </Button>
            {#if !$signer}
            <span class="text-gray-600">Connect your wallet to deploy</span>
            {/if}
          </div>
        </div>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Configuration (4)</SectionHeading>
      <SectionBody>
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

  <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400 grid grid-rows-2">
    <OtherTokens />
  </div>

</div>
