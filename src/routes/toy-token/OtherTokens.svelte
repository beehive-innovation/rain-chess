<script lang="ts">
	import { signerAddress, signer, provider } from 'svelte-ethers-store'
  import { EmissionsERC20, Formatter } from 'rain-sdk';
    import { onMount } from 'svelte';
    import { ethers } from 'ethers';
    import Item from './Item.svelte';
    import Label from './Label.svelte';
    import Info from './Info.svelte';
    import SectionBody from './SectionBody.svelte';
    import Section from './Section.svelte';
    import SectionHeading from './SectionHeading.svelte';
    import { EmissionConractDetails } from '$src/constants';
    import { getContractAddress } from 'ethers/lib/utils';

  let walletBalance, decimals;
  const getContract = async () =>{
    let emissionsContract = ethers.utils.isAddress(EmissionConractDetails.contractAddress || "") ? new EmissionsERC20(EmissionConractDetails.contractAddress, $signer): null;
    walletBalance =  await emissionsContract.balanceOf($signerAddress)
    decimals = await emissionsContract.decimals()
  }

  $: if($signerAddress && EmissionConractDetails.contractAddress) {
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
                {walletBalance && decimals ? ethers.utils.formatUnits(walletBalance, decimals) : ""} Energy TKN
              </Info>
            </Item>
          </SectionBody>
        {:else}
          <span class="p-4">Please Connect your wallet</span>
        {/if}
    </Section>
</div>
</div>