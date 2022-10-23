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

  // $: if(urlParams.has('code')) { 
  //   const data =async () => {
  //     console.log("init called ") 
  //    await $auth.init() 
  //    console.log($auth.me,"hii") 
  //    if($auth.me && $signer){

  //      let verifyContract = new Verify('0xb8c01dee6a0f920d51ea137d4908f65b13c41bc1' , $signer)  
       
  //      let encoder = new TextEncoder()
  
  //       let verifySubmit = await verifyContract.approve([{
  //         account : $signerAddress , data : str2ab($auth.me.id)
  //       }])  
  //     console.log(verifySubmit)
  //    }  

  //   } 

    
  //   data()
    

   

  // } 

  


  let fields: any = {};

  let tweetURL = "";
  let tknUnits, gameId = ""
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

  const handleOptionSubmit = async () => { 
    console.log("In handle Submit : " , tweetURL) 
    if(option.value != 2) document.getElementById("express").style.display = "grid";
    else document.getElementById("express").style.display = "none";  

    let claimResult = await axios.post(`http://localhost:5000/api/v2/computeWin` , {gameId :tweetURL })  
    console.log(claimResult.data)

    simulatedResult = `
      GM Tokens Won : ${claimResult.data.data.GM} ,
      IMPRV Tokens Won : ${claimResult.data.data.IMPRV} ,
      XP Tokens Won : ${claimResult.data.data.XP} ,

    `

  }




    const claimFlowReward = async () => {  

      let contractAddress = ContractsConfigs.liChess 
      let abi = [{"inputs":[{"internalType":"address","name":"interpreter_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_size","type":"uint256"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"InvalidCodeAtRange","type":"error"},{"inputs":[],"name":"WriteError","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"indexed":false,"internalType":"struct StateConfig","name":"config","type":"tuple"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"claimant_","type":"address"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"RewardClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"indexed":false,"internalType":"struct StateConfig","name":"config","type":"tuple"}],"name":"SaveInterpreterState","type":"event"},{"inputs":[{"components":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"experiencePoints","type":"uint256"},{"internalType":"bool","name":"isImproved","type":"bool"},{"internalType":"bool","name":"isBeatenGM","type":"bool"},{"internalType":"address","name":"flow_ENERGY","type":"address"},{"internalType":"uint256","name":"id_ENERGY","type":"uint256"},{"internalType":"address","name":"flow_WIN","type":"address"},{"internalType":"uint256","name":"id_WIN","type":"uint256"},{"internalType":"address","name":"flow_XP","type":"address"},{"internalType":"uint256","name":"id_XP","type":"uint256"},{"internalType":"address","name":"flow_GM","type":"address"},{"internalType":"uint256","name":"id_GM","type":"uint256"},{"internalType":"address","name":"flow_IMPROVE","type":"address"},{"internalType":"uint256","name":"id_IMPROVE","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"internalType":"struct GameData","name":"context_","type":"tuple"},{"internalType":"bytes","name":"data_","type":"bytes"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"uint256[]","name":"context","type":"uint256[]"}],"internalType":"struct SignedContext[]","name":"signedContext","type":"tuple[]"}],"name":"claimReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"gamesClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"winner","type":"address"},{"internalType":"uint256","name":"experiencePoints","type":"uint256"},{"internalType":"bool","name":"isImproved","type":"bool"},{"internalType":"bool","name":"isBeatenGM","type":"bool"},{"internalType":"address","name":"flow_ENERGY","type":"address"},{"internalType":"uint256","name":"id_ENERGY","type":"uint256"},{"internalType":"address","name":"flow_WIN","type":"address"},{"internalType":"uint256","name":"id_WIN","type":"uint256"},{"internalType":"address","name":"flow_XP","type":"address"},{"internalType":"uint256","name":"id_XP","type":"uint256"},{"internalType":"address","name":"flow_GM","type":"address"},{"internalType":"uint256","name":"id_GM","type":"uint256"},{"internalType":"address","name":"flow_IMPROVE","type":"address"},{"internalType":"uint256","name":"id_IMPROVE","type":"uint256"},{"internalType":"uint256","name":"gameId","type":"uint256"}],"internalType":"struct GameData","name":"context_","type":"tuple"}],"name":"generateStack","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"bytes[]","name":"sources","type":"bytes[]"},{"internalType":"uint256[]","name":"constants","type":"uint256[]"}],"internalType":"struct StateConfig","name":"config_","type":"tuple"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"storageOpcodesRange","outputs":[{"components":[{"internalType":"uint256","name":"pointer","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"internalType":"struct StorageOpcodesRange","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"}]
      let lichessContract = new ethers.Contract(contractAddress ,abi ,$signer)  

      let gameData = await axios.post('http://localhost:5000/api/v2/processGame' , {gameId : tweetURL , winnerAddress : $signerAddress}) 
      
      // // const isBeatenGrandMaster = gameData.data.data[0];
      // // const isImproved = gameData.data.data[1];
      // // const xpAmount = gameData.data.data[2]; // to be computed  

      // const isBeatenGrandMaster = ;
      // const isImproved = 1;
      // const xpAmount = '100000000000000000000';  // to be computed 

                      
      // const context = [$signerAddress , isBeatenGrandMaster, isImproved, xpAmount] 
      // const messageHash = ethers.utils.solidityKeccak256(['uint256[]'], [context]); 

      // const signedContext = {
      //   signer: $signerAddress, // bot adddress  
      //   signature: $signer.signMessage(ethers.utils.arrayify(messageHash)),
      //   context: context
      // } 

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
            gameId: 12781331
        };  

        

        let tx = await lichessContract.claimReward(contextLiChess, "0x00", [gameData.data.data]) 
        let res =await  tx.wait() 
        console.log(res)


    }
 
  

    const handleSubmit = async () =>{   
      
        console.log("tweetURL : " , tweetURL )    
      
          let  gameIdNumber = ethers.BigNumber.from(ethers.utils.hexlify(ethers.utils.toUtf8Bytes('XpWCxa7e')))

            // sample computed data from backend
            let gameData = {  
              gameId : gameIdNumber , 
              isbeatenGM : false , // winner 
              winnersAddress : '0xD09c80BD55FcA5a3B2407106b65f6ab82E871F21' , 
              XPPoints : 10 , 
              beatenBetterPlayer : true
            }   

            let abiCoder = new ethers.utils.AbiCoder()  
            let encodedData = abiCoder.encode(["uint256" , "bool", "string" , "uint256" , "bool" ], [6372689420023314277 , false, "0xD09c80BD55FcA5a3B2407106b65f6ab82E871F21" , 10 , true  ]) 

            console.log("encodedData : " , encodedData )   


            
            // sign data from a specific key , will come from backend 
            let privateKey = `5a293aa138d35e4627b0f723693fffe4b4e75f34d536146967d387d334335a89`   

            const provider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com')
            let wallet = new ethers.Wallet('5a293aa138d35e4627b0f723693fffe4b4e75f34d536146967d387d334335a89', provider)   
            
            
            
            
            let sig = await wallet.signMessage(encodedData) 
            console.log(sig) 







      

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
    deployPromise = claimFlowReward();
  }; 

 
// console.log("data", params);


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
              <img src="/assets/twitter.png" width='32' height='32' alt='twitter' class='me-4' />
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
                  Copy-paste the game URL to claim tokens. 
                </p>
            </div>  
          </div>
        </div>
        <span class="text-xl font-semibold">Claimable amount expression</span>
          <div class="max-w-prose">Enter the GameId and check claimable</div>
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

   <!--  <Section>
      <SectionHeading>Claim</SectionHeading>
      <SectionBody>
        <span class="text-xl font-semibold">Claimable amount</span>
          <div class="max-w-prose">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
          <Input
              type="text"
             
              placeholder="Enter game id : XpWCxa7e"
              bind:this={fields.gameId}
              bind:value={gameId}
              validator={required}
            >
              <span slot="label">Name</span>
            </Input>
        <div class="self-start flex flex-row items-center gap-x-2 py-4"> 
          <Button shrink disabled={!$signer || !deployPromise} on:click={handleClaim}> Claim Reward</Button>
        {#if !$signer}
        <span class="text-gray-600">Connect your wallet to deploy</span>
        {/if}
      </div>
      </SectionBody>  

      
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
-->
    
  </div>

  <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400 ">
    <StakeNBuy />
  </div> 

</div> 

