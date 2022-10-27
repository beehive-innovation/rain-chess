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
  import { ethers } from 'ethers';  
  import axios from 'axios'

  import ContractsConfigs from "../../../mumbai.json"

  $: oAuth = JSON.parse(localStorage.getItem('oauth2authcodepkce-state'))
  const { open } = getContext('simple-modal') 

  let fields: any = {};

  let gameID = "", accDetails, signedContext
  let parserVmStateConfig: Writable<StateConfig> = writable(null)
  let simulatedResult , deployPromise, claim = false  

  let walletVerified = true
  

  const Options = [
    {value: 2, label: "Select UserType"},
    { value: 0, label: "Verify Account" },
    { value: 1, label: "Verify Game" },
  ]
  let option: { value: number; label: string } 

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
       console.log('authToken : ' , authToken)
       console.log('authToken : ' , authToken.accessToken.value) 
       oAuth = authToken

       let authResult = await axios.post('https://18d66c4b6c88.in.ngrok.io/api/v2/verifyAccount' , {address : $signerAddress , lichessToken : authToken?.accessToken?.value})  
       console.log('authResult : ' , authResult ) 
      //  if(!authResult.data.status){
      //   alert(`${authResult.data.message}`)
      //  }  

     

       alert(`${authResult.data.message}`)
        
       } catch (error) {
          console.log("error : " ,error) 

          if(!error?.response?.data?.status && error?.response?.data?.code == 401){
              alert(`${error?.response?.data?.message}`)
            }
            else if(!error?.response?.data?.status && error?.response?.data?.code == 404){ 
              walletVerified = false
              alert(`${error?.response?.data?.message}`)
            }
          console.log(error?.response?.data)

       }

  } 
  
    const getAccountData = async () =>{

      let tokenData = JSON.parse(localStorage.getItem('oauth2authcodepkce-state')) 
      
      let data = await axios.get('https://lichess.org/api/account',{
        headers: { 
          'Authorization': `Bearer ${tokenData?.accessToken?.value}`
        }
      })
      console.log("data", data);
      
      accDetails = data.data
    }
    authorizeAccount()
    getAccountData()
  }
  // setTimeout(getAccountData, 3000);

  const urlParams = new URLSearchParams(window.location.search);

  $: if(urlParams.has('code')) { 
    const data = async () =>{
      window.history.pushState({}, null, '/');
      push('/player')

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
    console.log("In handle Submit : " , gameID) 
    if(option.value != 2) document.getElementById("express").style.display = "grid";
    else document.getElementById("express").style.display = "none";  

    let claimResult = option.value == 1 ? await axios.post(`https://18d66c4b6c88.in.ngrok.io/api/v2/computeGame` ,{gameId :gameID , winnerAddress : $signerAddress ,lichessToken: oAuth?.accessToken?.value}) : undefined
    console.log(claimResult?.data)

    simulatedResult = claimResult != undefined ? `
      GM Tokens Won : ${claimResult?.data?.data?.GM} ,
      IMPRV Tokens Won : ${claimResult?.data?.data?.IMPRV} ,
      XP Tokens Won : ${claimResult?.data?.data?.XP} ,
      Win Tokens Won : ${claimResult?.data?.data?.WIN} ,
    ` : "Please select Verify Game"
  } 

  const handleTokenOptionSubmit = async () => { 
    try { 
      
      let gameIdUint = ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(gameID))).toString() 
      
      let contractEnergy = new ethers.Contract(ContractsConfigs.flow_ENERGY , ContractsConfigs.contractABI, $signer)
      let tx = await contractEnergy.flow(ContractsConfigs.flowStates_ENERGY_BURN.hex , gameIdUint , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  
      console.log(receipt)   

    if(tokenOptionValue.value == 1){ 
      
      let contractWIN = new ethers.Contract(ContractsConfigs.flow_WIN , ContractsConfigs.contractABI, $signer)
      let tx = await contractWIN.flow(ContractsConfigs.flowStates_WIN.hex , gameIdUint , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  
      console.log(receipt)  
    }
    else if(tokenOptionValue.value == 2){
      let contractXP = new ethers.Contract(ContractsConfigs.flow_XP , ContractsConfigs.contractABI, $signer)
      let tx = await contractXP.flow(ContractsConfigs.flowStates_XP.hex , gameIdUint , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  

      console.log(receipt) 
    }
    else if(tokenOptionValue.value == 3){
      let contractGM = new ethers.Contract(ContractsConfigs.flow_GM , ContractsConfigs.contractABI, $signer)
      let tx = await contractGM.flow(ContractsConfigs.flowStates_GM.hex , gameIdUint , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  

      console.log(receipt) 
    }
    else if(tokenOptionValue.value == 4){
      let contractImprove = new ethers.Contract(ContractsConfigs.flow_IMPROVE , ContractsConfigs.contractABI, $signer)
      let tx = await contractImprove.flow(ContractsConfigs.flowStates_IMPROVE.hex , gameIdUint , [signedContext] , {value : ethers.utils.parseEther('0')} ) 
      let receipt = await tx.wait()  

      console.log(receipt) 
    }
      
    } catch (error) { 
      console.log(error) 
      alert('CANT_FLOW')
      
    }
  }

  const claimFlowReward = async () => {  
      claim = true 
      let gameData = await axios.post('https://18d66c4b6c88.in.ngrok.io/api/v2/processGame' , {gameId :gameID , winnerAddress : $signerAddress ,lichessToken: oAuth.accessToken.value}) 
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

    let verifyReq = await axios.post('https://18d66c4b6c88.in.ngrok.io/api/v2/registerWallet' , {signature : sig ,lichessToken: oAuth?.accessToken?.value }) 
    console.log(verifyReq.data) 
    walletVerified = true 
  } 

  const mintEnergy = async () => { 
    let energyContract = new ethers.Contract(ContractsConfigs.flow_ENERGY , ContractsConfigs.contractABI , $signer) 
    let tx = await energyContract.flow( ContractsConfigs.flowStates_ENERGY_MINT.hex , 12323223, [] , {value : ethers.utils.parseEther('0')} ) 
    let receipt = await tx.wait() 
    console.log(receipt)


  }

</script>

<div class="flex gap-x-3 relative">
  <div class="flex w-2/3 flex-col gap-y-6 p-8">
    <span class="text-3xl font-semibold">liChess Player</span>

    {#if !walletVerified} 
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

        {#if $signer}
          <Section>
            <SectionHeading>User Details</SectionHeading>
            <div class="p-3 pl-5">
              {#if !accDetails?.profile}
                Username : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>{accDetails ? accDetails?.username : "John Doe"}</a></span>
              {:else}
                Name : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>{`${accDetails ? (accDetails?.profile?.firstName + " " + accDetails?.profile?.lastName) : "John Doe"}`}</a></span>
              {/if}
            </div>
            <SectionBody>
              <div class="flex flex-row">
                <div class="w-1/2">
              <Item gap="gap-y-4">
                <Label>Games Details: </Label>
                <Info>
                  <span class="flex gap-x-4 ">
                    <img src="/assets/allGame.png" width='30' height='30' alt='all' class='me-4' /> Total games : {`${accDetails ? accDetails?.count.all : 0}`}
                  </span>
                </Info>
                <Info>
                  <span class="flex gap-x-4 ">
                    <img src="/assets/win.png" width='30' height='30' alt='all' class='me-4' /> Win games : {`${accDetails ? accDetails?.count.win : 0}`}
                  </span>
                </Info>
                <Info>
                  <span class="flex gap-x-4 ">
                    <img src="/assets/drawn.png" width='30' height='30' alt='all' class='me-4' /> Draw games : {`${accDetails ? accDetails?.count.draw : 0}`}
                  </span>
                </Info>
                <Info>
                  <span class="flex gap-x-4 ">
                    <img src="/assets/loss.png" width='30' height='30' alt='all' class='me-4' /> Loss games : {`${accDetails ? accDetails?.count.loss : 0}`}
                  </span>
                  </Info>
                <Info>
                  <span class="flex gap-x-4 ">
                    <img src="/assets/playing.png" width='30' height='30' alt='all' class='me-4' /> Playing games : {`${accDetails ? accDetails?.count.playing : 0}`}
                  </span>
                </Info>
              </Item>
            </div>
            <div class="w-1/2">
              <Item>
                <Label>Performance : </Label>
                <div class="flex py-4">
                  <div class="flex w-1/2 gap-x-4">
                    <img src="/assets/bullet.png" width='35' height='35' alt='all' class='me-4' />
                    <div class="flex flex-col">
                      <div>BULLET</div>
                      <div>{`${accDetails ? accDetails?.perfs?.bullet?.games : 0} games`}</div>
                    </div>
                  </div>

                  <div class="flex w-1/2 gap-x-4">
                    <img src="/assets/blitz.png" width='40' height='26' alt='all' class='me-4' />
                    <div class="flex flex-col">
                      <div>BLITZ</div>
                      <div>{`${accDetails ? accDetails?.perfs?.blitz?.games : 0} games`}</div>
                    </div>
                  </div>
                </div>

                <div class="flex py-4">
                  <div class="flex w-1/2 gap-x-4">
                    <img src="/assets/rapid.png" width='35' height='35' alt='all' class='me-4' />
                    <div class="flex flex-col">
                      <div>RAPID</div>
                      <div>{`${accDetails ? accDetails?.perfs?.rapid?.games : 0} games`}</div>
                    </div>
                  </div>

                  <div class="flex w-1/2 gap-x-4">
                    <img src="/assets/classical.png" width='35' height='35' alt='all' class='me-4' />
                    <div class="flex flex-col">
                      <div>CLASSICAL</div>
                      <div>{`${accDetails ? accDetails?.perfs?.classical?.games : 0} games`}</div>
                    </div>
                  </div>
                </div>

                <div class="flex py-4">
                  <div class="flex w-1/2 gap-x-4">
                    <img src="/assets/correspondence.png" width='35' height='35' alt='all' class='me-4' />
                    <div class="flex flex-col">
                      <div>CORRESPONDENCE</div>
                      <div>{`${accDetails ? accDetails?.perfs?.correspondence?.games : 0} games`}</div>
                    </div>
                  </div>
                </div>
              </Item>
            </div>
              </div>
            </SectionBody>
          </Section>  

          <Section>
            <SectionHeading>
              <div class="mb-2 flex flex-row w-full space-y-4"> 
              <div class="col-span-1 grid justify-center gap-y-4 pr-2">
                <img src="/assets/EnergyToken.png" width='30' height='30' alt='twitter' class='me-4' />
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

          
        {/if}

        <Section>
          <SectionHeading>Play</SectionHeading>
          <SectionBody>
            <div class="mb-2 flex flex-col w-full space-y-4"> 
              <div class="grid grid-cols-12 items-center" >
                <div class="col-span-1 grid justify-center gap-y-4">
                  <img src="/assets/user.png" width='30' height='30' alt='twitter' class='me-4' />
                </div>
                <div class="col-span-11">
                    <p>
                      Play a game on lichess and paste the game ID only into the input form below to verify for game.
                    </p>
                </div>
              </div>
              <div class="grid grid-cols-12 items-center" >
                <div class="col-span-1 grid justify-center gap-y-4">
                  <img src="/assets/lichess.svg" width='32' height='32' alt='twitter' class='me-4' />
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
            <SectionHeading>Claim Rewards for game</SectionHeading>
            <SectionBody>
              <div class="flex flex-col">          
                <Select
                  items={tokenOption}
                  bind:value={tokenOptionValue}
                >
                  <span slot="label"> Select The Token to Claim Reward for: </span>
                </Select>
                <div class="self-start flex flex-row items-center gap-x-2 pt-4"> 
                  <Button shrink disabled={!$signer} on:click={() =>{handleTokenOptionSubmit()}}> Submit </Button>
                  {#if !$signer}
                  <span class="text-gray-600">Connect your wallet to deploy</span>
                  {/if}
                </div>
              </div>
            </SectionBody>
          </Section>
        {/if}  
        

    {/if}

    
  </div>

  <div class="w-1/3 gap-y-4 bottom-0 top-16 right-0 border-l border-gray-400 ">
    <StakeNBuy />
  </div> 

</div> 

