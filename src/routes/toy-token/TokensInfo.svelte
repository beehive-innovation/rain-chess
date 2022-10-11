<script lang="ts">
	import { signerAddress, signer } from 'svelte-ethers-store'
  import { EmissionsERC20 } from 'rain-sdk';
    import { ethers } from 'ethers';
    import Item from './Item.svelte';
    import Label from './Label.svelte';
    import Info from './Info.svelte';
    import SectionBody from './SectionBody.svelte';
    import Section from './Section.svelte';
    import SectionHeading from './SectionHeading.svelte';
    import { EmissionContracts } from '$src/constants';

  let walletBalance, decimals; 
  let energyBalance , energyContractDecimals
  const getContract = async () =>{
    let emissionsContract = ethers.utils.isAddress(EmissionContracts.contractAddress || "") ? new EmissionsERC20(EmissionContracts.contractAddress, $signer): null;
    walletBalance =  await emissionsContract.balanceOf($signerAddress)
    decimals = await emissionsContract.decimals() 

    let energyContract = ethers.utils.isAddress(EmissionContracts.energyContractAddress || "") ? new EmissionsERC20(EmissionContracts.energyContractAddress, $signer): null;
    energyBalance =  await energyContract.balanceOf($signerAddress)
    energyContractDecimals = await energyContract.decimals()
  }

  $: if($signerAddress && EmissionContracts) {
      getContract()
    }
</script>

<div class="w-full">
  <div class="flex flex-col gap-y-6 p-2">
      <Section>
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
    </Section>
</div>
</div>