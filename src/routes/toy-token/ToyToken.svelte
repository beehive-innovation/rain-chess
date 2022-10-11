<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import { validateFields } from "../../utils";
  import { addressValidate, required } from "../../validation";
  import Parser from "$components/parser/Parser.svelte";
  import OpDocs from "$components/parser/OpDocs.svelte";
  import { OpMeta } from "$components/parser/opmeta";
  import Label from "$routes/toy-token/Label.svelte";
  import Info from "$routes/toy-token/Info.svelte";
  import Section from "$routes/toy-token/Section.svelte";
  import SectionHeading from "$routes/toy-token/SectionHeading.svelte";
  import SectionBody from "$routes/toy-token/SectionBody.svelte";
  import Item from "$routes/toy-token/Item.svelte";
  import { writable, type Writable } from "svelte/store";
  import IconLibrary from "$components/IconLibrary.svelte";
  import OtherTokens from "$routes/toy-token/OtherTokens.svelte";
  import { getContext } from "svelte";
  import { push } from "svelte-spa-router";
  import Select from "$components/Select.svelte";
  import { EmissionsERC20JSVM, type StateConfig } from "rain-sdk";

  const { open } = getContext('simple-modal')

  let fields: any = {};

  let tweetURL = "";
  let erc20symbol = "eTKN";
  let initSupply = 0
  let ownerAddress = "0xf6CF014a3e92f214a3332F0d379aD32bf0Fae929"

  let parserVmStateConfig: Writable<StateConfig> = writable(null)


  const Options = [
    {value: 2, label: "Select UserType"},
    { value: 0, label: "Register" },
    { value: 1, label: "Verify Game" },
  ]
  let option: { value: number; label: string }

  const tknOptions = [
    {value: 2, label: "Select Token Type"},
    { value: 0, label: "Buy Enery TKN" },
    { value: 1, label: "Stake Chess TKN" },
  ]
  let tknOption: { value: number; label: string }

  // let parserVmStateConfig: Writable<StateConfig> = writable(null)
  let newEmissionsERC20
  let simulatedResult

  $: if ($parserVmStateConfig && $signer) simulate()

  const simulate = async () => {
    simulatedResult = null
    if ($parserVmStateConfig?.sources[0].length) {
      const simulator = new EmissionsERC20JSVM($parserVmStateConfig, {signer: $signer})
      simulatedResult = await simulator.run({context: [$signerAddress]})
    }
  }

  const handleClick = () =>{
    console.log("demo");
    
  }

</script>

<div class="flex gap-x-3 relative">

  <div class="flex w-2/3 flex-col gap-y-6 p-8">

    <span class="text-3xl font-semibold">Rain Chess</span>

    <div class="mb-2 flex flex-col w-full">
      <Info>Create a token and your friends and can come and mint it. You set the rules of who can mint and how much they can mint. Here are some games you might want to play:</Info>
      <div>example expressions...</div>
    </div>
    <Section>
      <SectionHeading>Contract</SectionHeading>
      <SectionBody>
        <Item>
          <Label>Name</Label>
          <Info>Lorem Ipsum</Info>
        </Item>
        <Item>
          <Label>Source</Label>
          <Info>Lorem Ipsum</Info>
        </Item>
        <Item>
          <Label>Token</Label>
          <Info>Lorem Ipsum</Info>
        </Item>
        <Item>
          <Label>Contract details</Label>
          <Info>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Info>
        </Item>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Expressions (1)</SectionHeading>
      <SectionBody>
        <span class="text-xl font-semibold">Claimable amount expression</span>
          <div class="max-w-prose">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
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
              on:change={() => {
                  document.getElementById("express").style.display = "grid";
                  if(option.value == 1) document.getElementById("exp").style.display = "none";
              }}
            >
              <span slot="label"> Select The Option: </span>
            </Select>
          </div>

          
          <!-- <div class="flex flex-row gap-x-2 items-center  bg-violet-200 rounded-lg self-start p-3 max-w-prose">
            <IconLibrary width={30} icon="tip" />
            <div class="max-w-prose">Remember - this is totally unique to your copy of Toy Token and gets evaluated as part of the claim function.</div>
          </div> -->
          <div id="express" style="display: none;">
          <div class="grid grid-cols-7 gap-4 items-stretch" >
            <div class="col-span-4 flex flex-col gap-y-4">
              <Parser vmStateConfig={parserVmStateConfig} />
            </div>
            <div class="col-span-3">
              <div class="bg-amber-200 rounded-lg p-4 h-full">

                <div class="font-mono text-black text-sm" >
                  <span>Simulated output: </span>
                  <span>
                    {#if $signer}
                      {#if simulatedResult}
                        {simulatedResult?.toString()}
                      {:else}
                        Invalid expression
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
            <Button shrink disabled={!$signer} on:click={handleClick}>Deploy EmissionsERC20</Button>
            {#if !$signer}
            <span class="text-gray-600">Connect your wallet to deploy</span>
            {/if}
          </div>
        </div>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Configuration (4)</SectionHeading>
      <SectionBody>
        <Select
              items={tknOptions}
              bind:value={tknOption}
            >
              <!-- on:change={() => {
                  document.getElementById("express").style.display = "grid";
                  if(option.value == 1) document.getElementById("exp").style.display = "none";
              }} -->
              <span slot="label"> Select The Option: </span>
        </Select>
         <!--<div id="exp" style="" class="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Name"
            bind:this={fields.erc20name}
            bind:value={erc20name}
            validator={required}
          >
            <span slot="label">Name</span>
          </Input>
          <Input
            type="text"
            placeholder="Symbol"
            bind:this={fields.erc20symbol}
            bind:value={erc20symbol}
            validator={required}
          >
            <span slot="label">Symbol</span>
          </Input>
          <Input
            type="address"
            placeholder="Name"
            bind:this={fields.ownerAddress}
            bind:value={ownerAddress}
            validator={addressValidate}
          >
            <span slot="label">Address to immediately mint token for</span>
          </Input>
          <Input
            type="number"
            bind:this={fields.initSupply}
            bind:value={initSupply}
            validator={required}
          >
            <span slot="label">Amount of the token to immediately mint</span>
          </Input>
        </div> -->
      </SectionBody>
    </Section>

    <!-- <div class="self-start flex flex-row items-center gap-x-2">
      <Button shrink disabled={!$signer} on:click={handleClick}>Deploy EmissionsERC20</Button>
      {#if !$signer}
      <span class="text-gray-600">Connect your wallet to deploy</span>
      {/if}
    </div> -->
  </div>

  <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400 grid grid-rows-2">
    <OpDocs {OpMeta} />
    <OtherTokens />
  </div>

</div>
