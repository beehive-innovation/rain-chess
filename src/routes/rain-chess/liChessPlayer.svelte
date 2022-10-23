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

  let fields: any = {};

  let gameID = "";
  let tknUnits, gameId = ""
  let getPromise

  let parserVmStateConfig: Writable<StateConfig> = writable(null)


  const Options = [
    {value: 2, label: "Select UserType"},
    { value: 0, label: "Verify Account" },
    { value: 1, label: "Verify Game" },
  ]
  let option: { value: number; label: string }

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

    let claimResult = option.value == 1 ? await axios.post(`http://46.101.7.19:5001/api/v2/computeGame` , {gameId :gameID }) : undefined
    console.log(claimResult?.data)

    simulatedResult = claimResult != undefined ? `
      GM Tokens Won : ${claimResult?.data?.data?.GM} ,
      IMPRV Tokens Won : ${claimResult?.data?.data?.IMPRV} ,
      XP Tokens Won : ${claimResult?.data?.data?.XP} ,
      Win Tokens Won : ${claimResult?.data?.data?.WIN} ,
    ` : "Please select Verify Game"
  }

  const claimFlowReward = async () => {  

      let contractAddress = ContractsConfigs.liChess 
      let abi =[{"inputs":[{"internalType":"address","name":"interpreter_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_size","type":"uint256"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"InvalidCodeAtRange","type":"error"},{"inputs":[],"name":"WriteError","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"indexed":false,"internalType":"struct StateConfig","name":"config","type":"tuple"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"claimant_","type":"address"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"RewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"indexed":false,"internalType":"struct StateConfig","name":"config","type":"tuple"}],"name":"SaveInterpreterState","type":"event"},{"inputs":[{"components":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"experiencePoints","type":"uint256"},{"internalType":"bool","name":"isImproved","type":"bool"},{"internalType":"bool","name":"isBeatenGM","type":"bool"},{"internalType":"address","name":"flow_ENERGY","type":"address"},{"internalType":"uint256","name":"id_ENERGY","type":"uint256"},{"internalType":"address","name":"flow_WIN","type":"address"},{"internalType":"uint256","name":"id_WIN","type":"uint256"},{"internalType":"address","name":"flow_XP","type":"address"},{"internalType":"uint256","name":"id_XP","type":"uint256"},{"internalType":"address","name":"flow_GM","type":"address"},{"internalType":"uint256","name":"id_GM","type":"uint256"},{"internalType":"address","name":"flow_IMPROVE","type":"address"},{"internalType":"uint256","name":"id_IMPROVE","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"internalType":"struct GameData","name":"context_","type":"tuple"},{"internalType":"bytes","name":"data_","type":"bytes"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContext","type":"tuple[]"}],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"gamesClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"experiencePoints","type":"uint256"},{"internalType":"bool","name":"isImproved","type":"bool"},{"internalType":"bool","name":"isBeatenGM","type":"bool"},{"internalType":"address","name":"flow_ENERGY","type":"address"},{"internalType":"uint256","name":"id_ENERGY","type":"uint256"},{"internalType":"address","name":"flow_WIN","type":"address"},{"internalType":"uint256","name":"id_WIN","type":"uint256"},{"internalType":"address","name":"flow_XP","type":"address"},{"internalType":"uint256","name":"id_XP","type":"uint256"},{"internalType":"address","name":"flow_GM","type":"address"},{"internalType":"uint256","name":"id_GM","type":"uint256"},{"internalType":"address","name":"flow_IMPROVE","type":"address"},{"internalType":"uint256","name":"id_IMPROVE","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"internalType":"struct GameData","name":"context_","type":"tuple"}],"name":"generateStack","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"config_","type":"tuple"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"storageOpcodesRange","outputs":[{"components":[{"internalType":"uint256","name":"pointer","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"internalType":"struct StorageOpcodesRange","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"}]
      let lichessContract = new ethers.Contract(contractAddress ,abi ,$signer)  

      let gameData = await axios.post('http://46.101.7.19:5001/api/v2/processGame' , {gameId : gameID , winnerAddress : $signerAddress}) 
      
      console.log("gameID  :" , ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(gameID))).toString())

      const contextLiChess = {
        winner: $signerAddress, // winner 
        experiencePoints: 10,
        isImproved: true,
        isBeatenGM: true,
        flow_ENERGY: ContractsConfigs.flow_ENERGY,
        id_ENERGY: ContractsConfigs.flowStates_ENERGY.hex,
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
      
      let tx = await lichessContract.claimReward(contextLiChess, "0x00", [gameData.data.data]) 
      let res =await  tx.wait() 
      console.log(res)
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
    
  </div>

  <div class="w-1/3 gap-y-4 bottom-0 top-16 right-0 border-l border-gray-400 ">
    <StakeNBuy />
  </div> 

</div> 

