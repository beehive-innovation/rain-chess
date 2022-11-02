<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import Input from "$components/Input.svelte";
  import { validateFields } from "../../utils";
  import { addressValidate, required } from "../../validation";
  import Parser from "$components/parser/Parser.svelte";
  import Section from "$routes/rain-chess/Section.svelte";
  import SectionHeading from "$routes/rain-chess/SectionHeading.svelte";
  import SectionBody from "$routes/rain-chess/SectionBody.svelte";
  import { writable, type Writable } from "svelte/store";
  import IconLibrary from "$components/IconLibrary.svelte";
  import StakeNBuy from "$routes/rain-chess/Stake&Buy.svelte";
  import { getContext } from "svelte";
  import { params, push } from "svelte-spa-router";
  import Select from "$components/Select.svelte";
  import {  EmissionsERC20JSVM, type StateConfig } from "rain-sdk"; 
  import { ethers } from 'ethers';  
  import axios from 'axios'
  import LiChessLogin from "$routes/rain-chess/LiChessLogin.svelte";

  import ContractsConfigs from "../../../mumbai.json"
  import { Logger, parseUnits } from "ethers/lib/utils";
  import UserDetails from "./UserDetails.svelte";
    import Label from "./Label.svelte";

  $: oAuth = JSON.parse(localStorage.getItem('oauth2authcodepkce-state'))
  const { open } = getContext('simple-modal') 

  let fields: any = {};

  let gameID = "", accDetails, signedContext
  let parserVmStateConfig: Writable<StateConfig> = writable(null)
  let simulatedResult , deployPromise, claim = false  

  let walletVerified = true, isWalletCorrect = false
  let isClaimRes = false, approved = false
  let energyContract 

  const tokenOption = [ 
    {value: 0, label: "Select Token"},

    {value: 1, label: "Win Token"},
    { value: 2, label: "Experience Token" },
    { value: 3, label: "GM Token" },
    { value: 4, label: "Improve Token" }
  ]
  let tokenOptionValue: { value: number; label: string }

  $: if($signer){   
    const authorizeAccount = async () => { 
      try { 
        let authToken = JSON.parse(localStorage.getItem('oauth2authcodepkce-state')) 
        oAuth = authToken

        let authResult = await axios.post('https://gildlab-ipfs.in.ngrok.io/lichess/api/v2/verifyAccount' , {address : $signerAddress , lichessToken : authToken?.accessToken?.value})  
        isWalletCorrect = true
        alert(`${authResult.data.message}`)
        
      } catch (error) {
        console.log("error : " ,error)  
        isWalletCorrect = false
        if(!error?.response?.data?.status && error?.response?.data?.code == 401){
          alert(`${error?.response?.data?.message}`)
        }
        else if(!error?.response?.data?.status && error?.response?.data?.code == 404){ 
          walletVerified = false
          alert(`${error?.response?.data?.message}`)
        }
      }
  } 
  
    authorizeAccount()
    energyContract = new ethers.Contract(ContractsConfigs.flow_ENERGY , ContractsConfigs.contractABI , $signer) 
  }

  const urlParams = new URLSearchParams(window.location.search);

  $: if(urlParams.has('code')) { 
    const data = async () =>{
      window.history.pushState({}, null, '/');
      // push('/player')

    }
    data()

  } 

  $: if ($parserVmStateConfig && $signer) simulate()

  const simulate = async () => {
    simulatedResult = null
    if ($parserVmStateConfig?.sources[0].length) {
      const simulator = new EmissionsERC20JSVM($parserVmStateConfig, {signer: $signer})
      simulatedResult = await simulator.run({context: [$signerAddress]})
    }
  }   

 

  const handleOptionSubmit = async () => { 
    isClaimRes = true
    try{
      let claimResult = await axios.post(`https://gildlab-ipfs.in.ngrok.io/lichess/api/v2/computeGame` , {gameId :gameID , winnerAddress : $signerAddress ,lichessToken: oAuth.accessToken.value})
      // isClaimRes = true
      document.getElementById("express").style.display = "grid";

      simulatedResult = `
        GM Tokens Won : ${claimResult?.data?.data?.GM} ,
        IMPRV Tokens Won : ${claimResult?.data?.data?.IMPRV} ,
        XP Tokens Won : ${claimResult?.data?.data?.XP} ,
        Win Tokens Won : ${claimResult?.data?.data?.WIN} ,
      `
    }catch(error){
      console.log("err", error);
      document.getElementById("express").style.display = "none"; 
      isClaimRes = false
      alert(error?.response?.data?.message)
      
    }
  } 

  const claimFlowReward = async () => {  
    claim = true 
    let gameData = await axios.post('https://gildlab-ipfs.in.ngrok.io/lichess/api/v2/processGame' , {gameId :gameID , winnerAddress : $signerAddress ,lichessToken: oAuth.accessToken.value}) 
    claim = true 
    signedContext = gameData.data.data 
}

  const handleClick = async () => { 
    const { validationResult } = await validateFields(fields);
    if (!validationResult) return;
    deployPromise = claimFlowReward();
  };  

  const verifyWallet = async () => {
    let sig = await $signer.signMessage("RAIN_LI_CHESS_ACCOUNT_VERFICATION")   

    let verifyReq = await axios.post('https://gildlab-ipfs.in.ngrok.io/lichess/api/v2/registerWallet' , {signature : sig ,lichessToken: oAuth?.accessToken?.value }) 
    walletVerified = true 
  } 

  const mintEnergy = async () => { 
    let tx = await energyContract.flow( ContractsConfigs.flowStates_ENERGY_MINT , 12323223, [] , {value : ethers.utils.parseEther('0')} ) 
    let receipt = await tx.wait() 
    
  } 

  const claimToken = async () => { 
    try { 
      let gameIdUint = ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(gameID))).toString()  
      // let gameIdUint = 12312345678
      
      if(tokenOptionValue.value == 1){ 
        let contractWIN = new ethers.Contract(ContractsConfigs.flow_WIN , ContractsConfigs.contractABI, $signer)
        let tx = await contractWIN.flow(ContractsConfigs.flowStates_WIN , gameIdUint , [signedContext[0]] , {value : ethers.utils.parseEther('0')} ) 
        let receipt = await tx.wait()  
          
      }
      else if(tokenOptionValue.value == 2){
        let contractXP = new ethers.Contract(ContractsConfigs.flow_XP , ContractsConfigs.contractABI, $signer)
        
        let tx = await contractXP.flow(ContractsConfigs.flowStates_XP , gameIdUint , [signedContext[1]] , {value : ethers.utils.parseEther('0')} ) 
        let receipt = await tx.wait()  
      }
      else if(tokenOptionValue.value == 3){
        let contractGM = new ethers.Contract(ContractsConfigs.flow_GM , ContractsConfigs.contractABI, $signer) 
        let tx = await contractGM.flow(ContractsConfigs.flowStates_GM , gameIdUint , [signedContext[0]] , {value : ethers.utils.parseEther('0')} ) 
        let receipt = await tx.wait()  
         
      }
      else if(tokenOptionValue.value == 4){
        let contractImprove = new ethers.Contract(ContractsConfigs.flow_IMPROVE , ContractsConfigs.contractABI, $signer)
       
        let tx = await contractImprove.flow(ContractsConfigs.flowStates_IMPROVE , gameIdUint , [signedContext[0]] , {value : ethers.utils.parseEther('0')} ) 
        let receipt = await tx.wait()
      }
    } catch (error) { 
      console.log(error) 
      alert('CANT_FLOW')
    }
  }

  const checkApproval = async () => { 

    if(tokenOptionValue.value == 1){  
      let allowance = await energyContract.allowance($signerAddress ,ContractsConfigs.flow_WIN )  
      approved =  allowance.gt(ethers.BigNumber.from('10'))

    } else  if(tokenOptionValue.value == 2){  
      let allowance = await energyContract.allowance($signerAddress ,ContractsConfigs.flow_XP )  
      approved =  allowance.gt(ethers.BigNumber.from('10'))

    } else  if(tokenOptionValue.value == 3){  
      let allowance = await energyContract.allowance($signerAddress ,ContractsConfigs.flow_GM )  
      approved =  allowance.gt(ethers.BigNumber.from('10'))

    } else  if(tokenOptionValue.value == 4){  
      let allowance = await energyContract.allowance($signerAddress ,ContractsConfigs.flow_IMPROVE )  
      approved =  allowance.gt(ethers.BigNumber.from('10'))

    } 
  } 

  const approveTokens = async () => {   

    if(tokenOptionValue.value == 1){ 
      let approveTx = await energyContract.approve(ContractsConfigs.flow_WIN, ethers.constants.MaxUint256) 
      await approveTx.wait()
      approved = true
    }else if(tokenOptionValue.value == 2){ 
      let approveTx = await energyContract.approve(ContractsConfigs.flow_XP, ethers.constants.MaxUint256) 
      await approveTx.wait() 
      approved = true
    }else if(tokenOptionValue.value == 3){
      let approveTx = await energyContract.approve(ContractsConfigs.flow_GM, ethers.constants.MaxUint256) 
      await approveTx.wait()
      approved = true  
    }else if(tokenOptionValue.value == 4){ 
      let approveTx = await energyContract.approve(ContractsConfigs.flow_IMPROVE, ethers.constants.MaxUint256) 
      await approveTx.wait()
      approved = true
    } 
  }

</script>

{#if oAuth}  
  <div class="flex gap-x-3 relative">
    <div class="flex w-2/3 flex-col gap-y-6 p-8">
      {#if !walletVerified }
      <span class="text-3xl font-semibold">liChess Player</span>
          <Section>
            <SectionHeading>Verify Wallet</SectionHeading>
            <SectionBody>
              <div class="flex flex-col">          
                <div class="self-start flex flex-row items-center gap-x-2 pt-4">  
                  <span class="uppercase font-semibold">Click On Verify Button to map wallet with liChess account</span>
                  <Button shrink  on:click={() =>{verifyWallet()}}> Verify Wallet </Button>
                </div>
              </div>
            </SectionBody>
          </Section>
      {:else}  
        <UserDetails />

        {#if isWalletCorrect}
            <Section>
              <SectionHeading>
                <div class="mb-2 flex flex-row w-full space-y-4"> 
                <div class="col-span-1 grid justify-center gap-y-4 pr-2">
                  <img src="/assets/EnergyToken.png" width='30' height='30' alt='energyToken' class='me-4' />
                </div>  
                Claim Energy Token 
                </div>
              </SectionHeading>
              {#if $signerAddress}
              <SectionBody> 
                  <span class="text-gray-600">Click below to claim game energy</span>
                  <div class="self-start flex flex-row items-center gap-x-2 pt-4"> 
                    <Button shrink on:click={() =>{mintEnergy()}}> Claim Energy </Button>
                  </div> 
                </SectionBody>
              {:else}
                <span class="p-4">Please Connect your wallet</span>
              {/if}
            </Section>

            <Section>
              <SectionHeading>Play</SectionHeading>
              <SectionBody>
                <div class="mb-2 flex flex-col w-full space-y-4"> 
                  <div class="grid grid-cols-12 items-center" >
                    <div class="col-span-1 grid justify-center gap-y-4">
                      <img src="/assets/play.png" width='30' height='30' alt='play' class='me-4' />
                    </div>
                    <div class="col-span-11">
                        <p>
                          Play a game on lichess and paste the game ID only into the input form below to verify for game.
                        </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-12 items-center" >
                    <div class="col-span-1 grid justify-center gap-y-4">
                      <img src="/assets/claim.png" width='32' height='32' alt='rewards' class='me-4' />
                    </div>
                    <div class="col-span-11">
                        <p>
                          Based on your game id and registration, you can claim tokens !! 
    
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
                    <span class="inline self-end"><Button shrink small on:click={handleOptionSubmit}> Check Claim </Button></span>
                  </div>
                  <div class="flex flex-row gap-x-2 items-center  bg-violet-200 rounded-lg self-start p-3 max-w-prose">
                    <IconLibrary width={30} icon="tip" />
                    <div class="max-w-prose">If you lose a game, you can only claim <span class="font-bold">Experience(XP) Token</span>!</div>
                  </div>
                  {#if isClaimRes}
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
                                  {#if simulatedResult }
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
                  {/if}
              </SectionBody>
            </Section> 

            {#if claim}
             
              <Section>
                <SectionHeading>Claim Rewards for game</SectionHeading>
                <SectionBody>
                  <div class="flex flex-col gap-4">          
                    <Select
                      items={tokenOption}
                      bind:value={tokenOptionValue}
                      on:change={checkApproval}
                    >
                      <span slot="label"> Select The Token to Claim Reward for: </span>
                    </Select> 
                    {#if approved}  
                      <div class="self-start flex flex-row items-center gap-x-2"> 
                        <Button shrink disabled={!$signer} on:click={() =>{claimToken()}}> Claim </Button>
                        {#if !$signer}
                        <span class="text-gray-600">Connect your wallet to deploy</span>
                        {/if}
                      </div>
                    {:else}
                      <div class="self-start flex flex-col items-start gap-x-2 gap-y-2"> 
                        <div>Approve the {tokenOptionValue?.label} contract to spend your FENERGY20</div>
                        <Button shrink disabled={!$signer} on:click={() =>{approveTokens()}}> Approve </Button>
                        {#if !$signer}
                        <span class="text-gray-600">Connect your wallet to deploy</span>
                        {/if}
                      </div>
                    {/if}
                  </div>
                </SectionBody>
              </Section>
            {/if}  
        {/if}
      {/if}

      {#if !$signer}
      <span class="text-2xl font-semibold">Connect your wallet to get started.</span>
      {/if}
      
    </div>

    <div class="w-1/3 gap-y-4 bottom-0 top-16 right-0 border-l border-gray-400 ">
      <StakeNBuy />
    </div> 
  </div> 
{:else}
  <div id="getHeight">
    <LiChessLogin />
  </div>
{/if}

<style>
	#getHeight{
		height: 83vh;
	}
</style>
