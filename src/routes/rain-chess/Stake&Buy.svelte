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
  import { formatUnits, getContractAddress } from 'ethers/lib/utils';
    import IconLibrary from '$components/IconLibrary.svelte';

  let fields: any = {};
  let contractFetched

  let chessTKNClaimBal, chessTKNDecimals, chessTKNSymbol, chesssContract, chessTKNName; 
  let energyTKNClaimBal , energyTKNDecimals, energyTKNSymbol, energyContract, energyTKNName;  
  let GMTKNClaimBal , GMTKNDecimals, GMTKNSymbol, GMContract, GMTKNName;  
  let ImproveClaimBal , ImproveDecimals, ImproveSymbol, ImproveContract, ImproveName;  
  let XPClaimBal , XPDecimals, XPSymbol, XPContract, XPName;  



  const getChessContract = async () =>{
    contractFetched = true

    chesssContract  = ethers.utils.isAddress(EmissionContracts.contractAddress || "") ? new EmissionsERC20(EmissionContracts.contractAddress, $signer): null;
    chessTKNName = await chesssContract.name()
    chessTKNClaimBal = await chesssContract.balanceOf($signerAddress)
    chessTKNSymbol = await chesssContract.symbol()
    chessTKNDecimals = await chesssContract.decimals() 
    
    contractFetched = false
  }
  const getEnergyContract = async () =>{
    contractFetched = true
    
    energyContract = ethers.utils.isAddress(EmissionContracts.energyContractAddress || "") ? new EmissionsERC20(EmissionContracts.energyContractAddress, $signer): null;
    energyTKNClaimBal =  await energyContract.balanceOf($signerAddress)
    energyTKNName = await energyContract.name()
    energyTKNSymbol = await energyContract.symbol()
    energyTKNDecimals = await energyContract.decimals() 
    
    contractFetched = false 
  }
  const getGMContract = async () =>{
    contractFetched = true

    GMContract = ethers.utils.isAddress(EmissionContracts.GMContract || "") ? new EmissionsERC20(EmissionContracts.GMContract, $signer): null;
    GMTKNClaimBal =  await GMContract.balanceOf($signerAddress)
    GMTKNName = await GMContract.name()
    GMTKNSymbol = await GMContract.symbol()
    GMTKNDecimals = await GMContract.decimals()
    
    contractFetched = false
  }
  const getImproveContract = async () =>{
    contractFetched = true

    ImproveContract = ethers.utils.isAddress(EmissionContracts.ImproveContract || "") ? new EmissionsERC20(EmissionContracts.ImproveContract, $signer): null;
    ImproveClaimBal =  await ImproveContract.balanceOf($signerAddress)
    ImproveName = await ImproveContract.name()
    ImproveSymbol = await ImproveContract.symbol()
    ImproveDecimals = await ImproveContract.decimals()

    contractFetched = false
  }
  const getXPContract = async () =>{
    contractFetched = true
    
    XPContract = ethers.utils.isAddress(EmissionContracts.XPContract || "") ? new EmissionsERC20(EmissionContracts.XPContract, $signer): null;
    XPClaimBal =  await XPContract.balanceOf($signerAddress)
    XPName = await XPContract.name()
    XPSymbol = await XPContract.symbol()
    XPDecimals = await XPContract.decimals()
    
    contractFetched = false
  }

  $: if($signerAddress && EmissionContracts) {
      getChessContract()
      getEnergyContract()
      getGMContract()
      getImproveContract()
      getXPContract()
    }

    // const getContracts = () =>{
      

    //   contractFetched = true
    // }

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
    <Section> 
      <SectionHeading>
        <div class="mb-2 flex flex-row w-full space-y-4"> 
          <div class="col-span-1 grid justify-center gap-y-4 pr-2">
            <img src="/assets/winToken.png" width='30' height='30' alt='twitter' class='me-4' />
          </div>  
          Win Token Details 
        </div>
      </SectionHeading> 
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
                <!--  -->
                <span
                class:animate-spin={contractFetched}
                class="flex flex-col justify-center"
                on:click={getChessContract}><IconLibrary icon="reload" /></span
              >
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section>
    <Section>
      <SectionHeading>
        <div class="mb-2 flex flex-row w-full space-y-4"> 
        <div class="col-span-1 grid justify-center gap-y-4 pr-2">
          <img src="/assets/EnergyToken.png" width='30' height='30' alt='twitter' class='me-4' />
        </div>  
        Energy Token Details
        </div>
      </SectionHeading>
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
              <span
              class:animate-spin={contractFetched}
                class="flex flex-col justify-center"
                on:click={getEnergyContract}><IconLibrary icon="reload" /></span
              >
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section> 
    <Section>
      <SectionHeading>
        <div class="mb-2 flex flex-row w-full space-y-4"> 
          <div class="col-span-1 grid justify-center gap-y-4 pr-2">
            <img src="/assets/GMToken.png" width='30' height='30' alt='twitter' class='me-4' />
          </div>  
          GM Token Details
        </div>
        </SectionHeading>
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
              <span
              class:animate-spin={contractFetched}
                class="flex flex-col justify-center"
                on:click={getGMContract}><IconLibrary icon="reload" /></span
              >
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section>

    <Section> 
      <SectionHeading>
        <div class="mb-2 flex flex-row w-full space-y-4"> 
          <div class="col-span-1 grid justify-center gap-y-4 pr-2">
            <img src="/assets/improveToken.png" width='30' height='30' alt='twitter' class='me-4' />
          </div>  
          Improve Token Details
        </div>
        </SectionHeading> 
      {#if $signerAddress}
        <SectionBody>
          <Item>
            <Label>Contract Name & Address :</Label>
            <Info>
              {#if ImproveName && ImproveContract}
                {ImproveName} ({ImproveContract?.address})
              {/if}
            </Info>
          </Item>
          <Item>
            <Label>Claimable Balance :</Label>
            <Info>
              {#if ImproveClaimBal && ImproveDecimals && ImproveSymbol}
                
              {formatUnits(ImproveClaimBal, ImproveDecimals)}
              {ImproveSymbol}
              <span
              class:animate-spin={contractFetched}
                class="flex flex-col justify-center"
                on:click={getImproveContract}><IconLibrary icon="reload" /></span
              >
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section>

    <Section> 
      <SectionHeading>
        <div class="mb-2 flex flex-row w-full space-y-4"> 
          <div class="col-span-1 grid justify-center gap-y-4 pr-2">
            <img src="/assets/XPToken.png" width='30' height='30' alt='twitter' class='me-4' />
          </div>  
          XP Token Details
        </div>
        </SectionHeading> 
      {#if $signerAddress}
        <SectionBody>
          <Item>
            <Label>Contract Name & Address :</Label>
            <Info>
              {#if XPName && XPContract}
                {XPName} ({XPContract?.address})
              {/if}
            </Info>
          </Item>
          <Item>
            <Label>Claimable Balance :</Label>
            <Info>
              {#if XPClaimBal && XPDecimals && XPSymbol}
                
              {formatUnits(XPClaimBal, XPDecimals)}
              {XPSymbol}
              <span
              class:animate-spin={contractFetched}
                class="flex flex-col justify-center"
                on:click={getXPContract}><IconLibrary icon="reload" /></span
              >
              {/if}
              <!-- {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Chess TKN -->
            </Info>
          </Item>
        </SectionBody>
      {:else}
        <span class="p-4">Please Connect your wallet</span>
      {/if}
    </Section>
</div>
</div>