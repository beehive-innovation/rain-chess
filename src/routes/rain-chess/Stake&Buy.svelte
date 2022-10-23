<script lang="ts">
	import { signerAddress, signer } from 'svelte-ethers-store'
  import { EmissionsERC20 } from 'rain-sdk';
  import { required } from "../../validation";
    import { ethers } from 'ethers';
    import Item from './Item.svelte';
    import Label from './Label.svelte';
    import Info from './Info.svelte';
    import SectionBody from './SectionBody.svelte';
    import Section from './Section.svelte';
    import SectionHeading from './SectionHeading.svelte';
    import { EmissionContracts } from '$src/constants';
    import Select from '$components/Select.svelte';
    import Input from '$components/Input.svelte';
    import Button from '$components/Button.svelte';
    import { formatUnits } from 'ethers/lib/utils';

    let fields: any = {};
    let tknUnits

  let chessTKNClaimBal, chessTKNDecimals, chessTKNSymbol, chesssContract, chessTKNName; 
  let energyTKNClaimBal , energyTKNDecimals, energyTKNSymbol, energyContract, energyTKNName;  
  let GMTKNClaimBal , GMTKNDecimals, GMTKNSymbol, GMContract, GMTKNName;  



  const getContract = async () =>{
    chesssContract  = ethers.utils.isAddress(EmissionContracts.contractAddress || "") ? new EmissionsERC20(EmissionContracts.contractAddress, $signer): null;
    console.log("chesssContract", chesssContract);
    chessTKNName = await chesssContract.name()
    chessTKNClaimBal = await chesssContract.balanceOf($signerAddress)
    chessTKNSymbol = await chesssContract.symbol()
    chessTKNDecimals = await chesssContract.decimals() 

    energyContract = ethers.utils.isAddress(EmissionContracts.energyContractAddress || "") ? new EmissionsERC20(EmissionContracts.energyContractAddress, $signer): null;
    energyTKNClaimBal =  await energyContract.balanceOf($signerAddress)
    energyTKNName = await energyContract.name()
    energyTKNSymbol = await energyContract.symbol()
    energyTKNDecimals = await energyContract.decimals()  

    GMContract = ethers.utils.isAddress(EmissionContracts.GMContract || "") ? new EmissionsERC20(EmissionContracts.GMContract, $signer): null;
    GMTKNClaimBal =  await GMContract.balanceOf($signerAddress)
    GMTKNName = await energyContract.name()
    GMTKNSymbol = await energyContract.symbol()
    GMTKNDecimals = await energyContract.decimals()
  }

  $: if($signerAddress && EmissionContracts) {
      getContract()
    }

  const tknOptions = [
    {value: 2, label: "Select Token Type"},
    { value: 0, label: "Buy Enery TKN" },
    { value: 1, label: "Stake Chess TKN" },
  ]
  let tknOption: { value: number; label: string }

  const handleEnergy = async () => {  
    let emissionsContract = new EmissionsERC20(EmissionContracts.energyContractAddress, $signer)   

     let tx = await emissionsContract.claim( $signerAddress ,ethers.constants.AddressZero , {
         gasPrice : ethers.utils.parseUnits('350', 'gwei'),
         gasLimit :  '200000'
     })  

     let reuslt = await tx.wait()
     console.log(reuslt )  

  }


</script>

<div class="w-full h-full">
  <div class="flex flex-col gap-y-6 p-2 overflow-scroll h-full">
    <!-- <div class="border-t border-gray-400 h-full">
      <div class="border-b border-gray-400 p-2 w-full font-semibold">Other liChess Expressions</div>
      <div class="flex flex-col p-2 overflow-scroll h-full"> -->
    <Section> 
      
      
      <SectionHeading>Chess Token Details</SectionHeading> 
      
      {#if $signerAddress}
        <SectionBody>
          <Item>
            <Label>Contract Name & Address :</Label>
            <Info>
              {#if chessTKNName && chesssContract}
                {chessTKNName} ({chesssContract?.address})
              {/if}
            </Info>
          </Item>
          <Item>
            <Label>Claimable Balance :</Label>
            <Info>
              {#if chessTKNClaimBal && chessTKNDecimals && chessTKNSymbol}
                
              {formatUnits(chessTKNClaimBal, chessTKNDecimals)}
              {chessTKNSymbol}
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
          <!-- <Item>
            <Button
              small ={true}
              shrink
              >Claim
             
            </Button>
          </Item> -->
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section>
    <Section>
      <SectionHeading>Energy Token Details</SectionHeading>
      {#if $signerAddress}
        <SectionBody>
          <Item>
            <Label>Contract Name & Address :</Label>
            <Info>
              {#if energyTKNName && energyContract}
                {energyTKNName} ({energyContract?.address})
              {/if}
            </Info>
          </Item>
          <Item>
            <Label>Claimable Balance :</Label>
            <Info>
              {#if energyTKNDecimals && energyTKNClaimBal && energyTKNSymbol}
                
              {formatUnits(energyTKNClaimBal, energyTKNDecimals)}
              {energyTKNSymbol}
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
          <!-- <Item>
            <Button
              small ={true}
              shrink
              >Claim
              
            </Button>
          </Item> -->
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section> 
    <Section>
      <SectionHeading>GM Token Details</SectionHeading>
      {#if $signerAddress}
        <SectionBody>
          <Item>
            <Label>Contract Name & Address :</Label>
            <Info>
              {#if GMTKNName && GMContract}
                {GMTKNName} ({GMContract?.address})
              {/if}
            </Info>
          </Item>
          <Item>
            <Label> Balance :</Label>
            <Info>
              {#if GMTKNDecimals && GMTKNClaimBal && GMTKNSymbol}
                
              {formatUnits(GMTKNClaimBal, GMTKNDecimals)}
              {GMTKNSymbol}
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
          <!-- <Item>
            <Button
              small ={true}
              shrink
              >Claim
             
            </Button>
          </Item> -->
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section>
    <Section>
      <SectionHeading>Buy Tokens (2)</SectionHeading>
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
          <div class="grid grid-cols-1 gap-4 pb-4">
            <Item>
              <Label>You can {tknOption?.value == 0 ? "Buy token" : "Stake Token"} : </Label>
              <Info>{tknOption?.value == 0 ? "10 ETKN/0.01 Matic" : "10 ETKN/0.01 Chess TKN"}</Info>
            </Item>
          </div>
          <div class="grid grid-cols-1 gap-4">
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
    <Section>
      <SectionHeading>Stake Tokens (2)</SectionHeading>
      <SectionBody>
        <!-- <Select
              items={tknOptions}
              bind:value={tknOption}
              on:change={() => {
                   if(tknOption.value != 2) document.getElementById("exp").style.display = "grid";
                  else document.getElementById("exp").style.display = "none";
              }}
            >
              <span slot="label"> Select The Option: </span>
        </Select> -->
        <div>
          <div class="grid grid-cols-1 gap-4 pb-4">
            <span>Number of ches tkn staked</span>
            <!-- <Item>
              <Label>You can {tknOption?.value == 0 ? "Buy token" : "Stake Token"} : </Label>
              <Info>{tknOption?.value == 0 ? "10 ETKN/0.01 Matic" : "10 ETKN/0.01 Chess TKN"}</Info>
            </Item> -->
          </div>
          <div class="grid grid-cols-1 gap-4">
            <Input
              type="text"
              placeholder="number of tokens to stake"
              bind:this={fields.units}
              bind:value={tknUnits}
              validator={required}
            >
              <span slot="label">Number of tokens want to stake </span>
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
  
      <!-- <Section>
      <SectionHeading>Chess Token Details</SectionHeading>
      {#if $signerAddress}
        <SectionBody>
          <Item>
            <Label>Wallet Address :</Label>
            <Info>
              {$signerAddress}
            </Info>
          </Item>
          <Item>
            <Label>Wallet Balance :</Label>
            <Info>
              {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN
            </Info>
          </Item>
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
  </Section>
    <Section>
        <SectionHeading>Enery Token Details</SectionHeading>
        {#if $signerAddress}
          <SectionBody>
            <Item>
              <Label>Wallet Address :</Label>
              <Info>
                {$signerAddress}
              </Info>
            </Item>
            <Item>
              <Label>Wallet Balance :</Label>
              <Info>
                {energyBalance && energyContractDecimals ? ethers.utils.formatUnits(energyBalance, energyContractDecimals) : ""} Energy TKN
              </Info>
            </Item>
          </SectionBody>
        {:else}
          <span class="p-4">Please Connect your wallet</span>
        {/if}
    </Section> -->
</div>
</div>