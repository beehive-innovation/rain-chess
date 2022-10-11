<script lang="ts">
	import { signerAddress, provider } from 'svelte-ethers-store'
  import { Formatter } from 'rain-sdk';
    import { onMount } from 'svelte';
    import { ethers } from 'ethers';
    import Item from './Item.svelte';
    import Label from './Label.svelte';
    import Info from './Info.svelte';
    import SectionBody from './SectionBody.svelte';
    import Section from './Section.svelte';
    import SectionHeading from './SectionHeading.svelte';

  let walletBalance = "";
  onMount(async ()=>{
    if($signerAddress) {
      ethers
    }
  })

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
                {walletBalance}
              </Info>
            </Item>
          </SectionBody>
          {:else}
          <span class="p-4">Please Connect your wallet</span>
        {/if}
      </Section>
</div>
</div>