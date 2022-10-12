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

    let fields: any = {};
    let tknUnits

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

<div class="w-full">
  <div class="flex flex-col gap-y-6 p-2">
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