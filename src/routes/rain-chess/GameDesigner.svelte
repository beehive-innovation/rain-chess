<script lang="ts">
  import { signer, signerAddress } from "svelte-ethers-store";
  import Button from "$components/Button.svelte";
  import FormPanel from "$components/FormPanel.svelte";
  import Input from "$components/Input.svelte";
  import { validateFields } from "../../utils";
  import { addressValidate, required } from "../../validation";
  import ContractDeploy from "$components/ContractDeploy.svelte";
  // import HumanReadable from "$components/FriendlySource/HumanReadable.svelte";
  import {
    EmissionsERC20,
    type ERC20Config,
    type StateConfig,
    type EmissionsERC20DeployArgs,
    EmissionsERC20JSVM,
  } from "rain-sdk";
  import { parseEther } from "ethers/lib/utils";
    import Parser from "$components/parser/Parser.svelte";
    import OpDocs from "$components/parser/OpDocs.svelte";
    import { OpMeta } from "$components/parser/opmeta";
    import Label from "$routes/rain-chess/Label.svelte";
    import Info from "$routes/rain-chess/Info.svelte";
    import Section from "$routes/rain-chess/Section.svelte";
    import SectionHeading from "$routes/rain-chess/SectionHeading.svelte";
    import SectionBody from "$routes/rain-chess/SectionBody.svelte";
    import Item from "$routes/rain-chess/Item.svelte";
    import { writable, type Writable } from "svelte/store";
    import IconLibrary from "$components/IconLibrary.svelte";
    import OtherTokens from "$routes/rain-chess/OtherTokens.svelte";
    import { getContext } from "svelte";
    import { push } from "svelte-spa-router";
    import Select from "$components/Select.svelte";

  const { open } = getContext('simple-modal')

  let deployPromise;
  const Options = [
    { value: 0, label: "Create Chess Token" },
    { value: 1, label: "Create Energy Token" },
    { value: 2, label: "Create Game Credit Token" },
    { value: 3, label: "Create Reward Token" },
  ]
  let option: { value: number; label: string } = null

  let fields: any = {};

  let erc20name = "EmissionsTKN";
  let erc20symbol = "eTKN";
  let initSupply = 0
  let ownerAddress = "0xf6CF014a3e92f214a3332F0d379aD32bf0Fae929"

  let parserVmStateConfig: Writable<StateConfig> = writable(null)
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

  const deployEmissions = async (fieldValues) => {
    const vmStateConfig = $parserVmStateConfig;

    let erc20Config: ERC20Config;
    erc20Config = {
      name: fieldValues.erc20name,
      symbol: fieldValues.erc20symbol,
      distributor: fieldValues.ownerAddress,
      initialSupply: parseEther(fieldValues.initSupply.toString()),
    };

    let emissionsDeployArg: EmissionsERC20DeployArgs;
    emissionsDeployArg = {
      allowDelegatedClaims: false,
      erc20Config,
      vmStateConfig,
    };

    newEmissionsERC20 = await EmissionsERC20.deploy(
      $signer,
      emissionsDeployArg
    );

    return newEmissionsERC20;
  };

  const handleClick = async () => {
    const { validationResult, fieldValues } = await validateFields(fields);
    if (!validationResult) return;

    open(ContractDeploy, { deployPromise:deployEmissions(fieldValues), type: "Toy Token", contractKey: "emissionsERC20", confirmedCallback })
    // deployPromise = deployEmissions(fieldValues);
  };

  const confirmedCallback = (contractAddress: string) => {
    console.log('in callback', contractAddress)
    push(`/token/${contractAddress}`)
  }
</script>

<div class="flex gap-x-3 relative">

  <div class="flex w-2/3 flex-col gap-y-6 p-8">

    <span class="text-3xl font-semibold">liChess Game Designer</span>

    <div class="mb-2 flex flex-col w-full">
      <Info>Create a token and your friends and can come and mint it. You set the rules of who can mint and how much they can mint. Here are some games you might want to play:</Info>
      <div>example expressions...</div>
    </div>
    <Section>
      <SectionHeading>Contract</SectionHeading>
      <SectionBody>
        <Item>
          <Label>Name</Label>
          <Info>Emissions</Info>
        </Item>
        <Item>
          <Label>Source</Label>
          <Info>Rain</Info>
        </Item>
        <Item>
          <Label>Token</Label>
          <Info>ERC20</Info>
        </Item>
        <Item>
          <Label>Contract details</Label>
          <Info>Mint a new ERC20 which releases new supply whenever a valid claim is made. We script the claim step, and each wallet trying to claim needs to be meet the criteria to mint their ERC20s. In this way claiming criteria can implicitly set a total supply cap, wallet supply cap and more. Can be used for game credits, project tokens, rewards.</Info>
        </Item>
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Expressions (1)</SectionHeading>
      <SectionBody>
        <span class="text-xl font-semibold">Claimable amount expression</span>
          <div class="max-w-prose">This expression will be evaluated every time the claim function is called to determine how much of this ERC20 the wallet can mint (if anything).</div>
          
          <div class="flex flex-row gap-x-2 items-center  bg-violet-200 rounded-lg self-start p-3 max-w-prose">
            <IconLibrary width={30} icon="tip" />
            <div class="max-w-prose">Remember - this is totally unique to your copy of Toy Token and gets evaluated as part of the claim function.</div>
          </div>
          
          <div class="grid grid-cols-7 gap-4 items-stretch">
            <div class="col-span-4 flex flex-col gap-y-4 break-words">
              <Parser vmStateConfig={parserVmStateConfig} />
            </div>
            <div class="col-span-3">
              <div class="bg-amber-200 rounded-lg p-4 h-full">

                <div class="font-mono text-black text-sm">
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
      </SectionBody>
    </Section>

    <Section>
      <SectionHeading>Configuration (4)</SectionHeading>
      <SectionBody>
        <Select
              items={Options}
              bind:value={option}
              on:change={() => {
                  document.getElementById("express").style.display = "grid";
                  // else document.getElementById("express").style.display = "none";
              }}
            >
              <span slot="label"> Select The Option: </span>
            </Select>
        <div id="express" style="display: none;" class="grid grid-cols-2 gap-4">
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
        </div>
      </SectionBody>
    </Section>

    <div class="self-start flex flex-row items-center gap-x-2">
      <Button shrink disabled={!$signer} on:click={handleClick}>Deploy EmissionsERC20</Button>
      {#if !$signer}
      <span class="text-gray-600">Connect your wallet to deploy</span>
      {/if}
    </div>
  </div>

  <div class="w-1/3 gap-y-4 fixed bottom-0 top-16 right-0 border-l border-gray-400 grid grid-rows-2">
    <OpDocs {OpMeta} />
    <OtherTokens />
  </div>

</div>
