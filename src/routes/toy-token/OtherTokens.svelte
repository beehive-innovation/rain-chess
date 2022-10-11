<script lang="ts">
<<<<<<< HEAD
	import { signerAddress, provider } from 'svelte-ethers-store'
  import { Formatter } from 'rain-sdk';
=======
	import { signerAddress, signer, provider } from 'svelte-ethers-store'
  import { EmissionsERC20, Formatter } from 'rain-sdk';
>>>>>>> a632c8e (UI updation)
    import { onMount } from 'svelte';
    import { ethers } from 'ethers';
    import Item from './Item.svelte';
    import Label from './Label.svelte';
    import Info from './Info.svelte';
    import SectionBody from './SectionBody.svelte';
    import Section from './Section.svelte';
    import SectionHeading from './SectionHeading.svelte';
<<<<<<< HEAD

  let walletBalance = "";
  onMount(async ()=>{
    if($signerAddress) {
      ethers
    }
  })
=======
    import { VerifyConractDetails } from '$src/constants';
    import { getContractAddress } from 'ethers/lib/utils';

  let walletBalance;
  const getContract = async () =>{
    let emissionsContract = ethers.utils.isAddress(VerifyConractDetails.contractAddress || "") ? new EmissionsERC20(VerifyConractDetails.contractAddress, $signer): null;
    walletBalance =  await emissionsContract.balanceOf($signerAddress)
  }
>>>>>>> a632c8e (UI updation)

  $: if($signerAddress && VerifyConractDetails.contractAddress) {
      getContract()
    }
</script>

<div class="w-full">
  <div class="flex flex-col gap-y-6 p-2">
        <Section>
          <SectionHeading>Wallet Details</SectionHeading>
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
<<<<<<< HEAD
                {walletBalance}
=======
                {walletBalance?.toString()} Chess TKN
>>>>>>> a632c8e (UI updation)
              </Info>
            </Item>
          </SectionBody>
          {:else}
          <span class="p-4">Please Connect your wallet</span>
        {/if}
      </Section>
</div>
</div>