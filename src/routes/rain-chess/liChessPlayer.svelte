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
  const { open } = getContext('simple-modal') 

  let fields: any = {};

  let gameID = "";
  let tknUnits = ""
  let getPromise 
  let accDetails
  let signedContext

  let claim = false

  $: if($signer){   
    const authorizeAccount = async () => { 

       let authToken = JSON.parse(localStorage.getItem('oauth2authcodepkce-state')) 
       console.log('authToken : ' , authToken)
       console.log('authToken : ' , authToken.accessToken.value) 
       oAuth = authToken

       let authResult = await axios.post('http://localhost:5000/api/v2/verifyAccount' , {address : $signerAddress , lichessToken : authToken?.accessToken?.value})  
       console.log('authResult : ' , authResult )
       if(!authResult.data.status){
        alert(`${authResult.data.message}`)
       } 

       alert(`${authResult.data.message}`)

    } 

    authorizeAccount()
  }
  

  $: if(oAuth) { 
    const data = async () =>{

      let tokenData = oAuth
      let data = await axios.get('https://lichess.org/api/account',{
        headers: { 
          'Authorization': `Bearer ${tokenData.accessToken.value}`
        }
      })
<<<<<<< HEAD
      console.log("data",data);
=======
>>>>>>> 52ed1cf (user details)
      accDetails = data.data
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

    let claimResult = option.value == 1 ? await axios.post(`http://localhost:5000/api/v2/computeGame` ,{gameId :gameID , winnerAddress : $signerAddress ,lichessToken: oAuth?.accessToken?.value}) : undefined
    console.log(claimResult?.data)

    simulatedResult = claimResult != undefined ? `
      GM Tokens Won : ${claimResult?.data?.data?.GM} ,
      IMPRV Tokens Won : ${claimResult?.data?.data?.IMPRV} ,
      XP Tokens Won : ${claimResult?.data?.data?.XP} ,
      Win Tokens Won : ${claimResult?.data?.data?.WIN} ,
    ` : "Please select Verify Game"
  } 

  const handleTokenOptionSubmit = async () => { 
    if(tokenOptionValue.value == 1){
      let contractWIN = new ethers.Contract(ContractsConfigs.flow_WIN , ContractsConfigs.contractABI, $signer)
      let tx = await contractWIN.flow(ContractsConfigs.flowStates_WIN.hex , gameID , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  
      console.log(receipt)  
    }
    else if(tokenOptionValue.value == 2){
      let contractXP = new ethers.Contract(ContractsConfigs.flow_XP , ContractsConfigs.contractABI, $signer)
      let tx = await contractXP.flow(ContractsConfigs.flowStates_XP.hex , gameID , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  

      console.log(receipt) 
    }
    else if(tokenOptionValue.value == 3){
      let contractGM = new ethers.Contract(ContractsConfigs.flow_GM , ContractsConfigs.contractABI, $signer)
      let tx = await contractGM.flow(ContractsConfigs.flowStates_GM.hex , gameID , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  

      console.log(receipt) 
    }
    else if(tokenOptionValue.value == 4){
      let contractImprove = new ethers.Contract(ContractsConfigs.flow_IMPROVE , ContractsConfigs.contractABI, $signer)
      let tx = await contractImprove.flow(ContractsConfigs.flowStates_IMPROVE.hex , gameID , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  

      console.log(receipt) 
    }
  }
  


  const claimFlowReward = async () => {  

      claim = true 
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
      <SectionHeading>User Details</SectionHeading>
      <div class="p-3 pl-5">
        {#if !accDetails?.profile}
<<<<<<< HEAD
          username : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>  {accDetails?.username}</a></span>
        {:else}
          Name : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>  {accDetails?.profile?.firstName} {accDetails?.profile?.lastName}</a></span>
=======
          username : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>{accDetails?.username}</a></span>
        {:else}
          Name : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>{accDetails?.profile?.firstName} {accDetails?.profile?.lastName}</a></span>
>>>>>>> 52ed1cf (user details)
        {/if}
      </div>
      <SectionBody>
        <div class="flex flex-row">
          <div class="w-1/2">
        <Item gap="gap-y-4">
          <Label>Game Details: </Label>
          <Info>
            <span class="flex gap-x-4 ">
              <img src="/assets/allGame.png" width='30' height='30' alt='all' class='me-4' /> All : {`${accDetails?.count.all}`}
            </span>
          </Info>
          <Info>
            <span class="flex gap-x-4 ">
              <img src="/assets/win.png" width='30' height='30' alt='all' class='me-4' /> Win : {`${accDetails?.count.win}`}
            </span>
          </Info>
          <Info>
            <span class="flex gap-x-4 ">
              <img src="/assets/drawn.png" width='30' height='30' alt='all' class='me-4' /> Draw : {`${accDetails?.count.draw}`}
            </span>
          </Info>
          <Info>
            <span class="flex gap-x-4 ">
              <img src="/assets/loss.png" width='30' height='30' alt='all' class='me-4' /> Loss : {`${accDetails?.count.loss}`}
            </span>
            </Info>
          <Info>
            <span class="flex gap-x-4 ">
              <img src="/assets/playing.png" width='30' height='30' alt='all' class='me-4' /> Playing : {`${accDetails?.count.playing}`}
            </span>
          </Info>
        </Item>
      </div>
      <div class="w-1/2">
        <Item>
          <Label>Performance : </Label>
          <Info></Info>
        </Item>
      </div>
        </div>
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
      <SectionHeading>Claim Rewarsds for game</SectionHeading>
      <SectionBody>
          <div class="max-w-prose">Claim Rewards</div>
          <div class="grid grid-cols-2 gap-4">
            
            <Select
              items={tokenOption}
              bind:value={tokenOptionValue}
            >
              <span slot="label"> Select The Option: </span>
            </Select>
            <div class="self-start flex flex-row items-center gap-x-2 py-4"> 
              <Button shrink disabled={!$signer} on:click={() =>{handleTokenOptionSubmit(tokenOptionValue)}}> Submit </Button>
            {#if !$signer}
            <span class="text-gray-600">Connect your wallet to deploy</span>
            {/if}
          </div>
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

