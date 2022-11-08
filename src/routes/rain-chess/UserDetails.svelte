<script lang="ts">
    import Item from "./Item.svelte";
    import Section from "./Section.svelte";
    import SectionBody from "./SectionBody.svelte";
    import SectionHeading from "./SectionHeading.svelte";
    import Label from "$routes/rain-chess/Label.svelte";
    import Info from "$routes/rain-chess/Info.svelte";
    import { signer, signerAddress } from "svelte-ethers-store";
    import axios from 'axios'
    import { ethers } from "ethers";
    import ContractsConfigs from "../../../mumbai.json"
    import Button from "$components/Button.svelte";
    import {onMount } from 'svelte'
    import IconLibrary from "$components/IconLibrary.svelte";

    let accDetails, winNFTCtrct, gmNFTCtrct, expNFTCtrct, imprNFTCtrct
    let winBalance, gmBalance, expBalance, imprBalance
    let winMetaData, gmMetaData, expMetaData, imprMetaData, getNFTContext 

    onMount(() => {
        let tokenData = JSON.parse(localStorage.getItem('oauth2authcodepkce-state')) 
        
        getAccountData(tokenData)        
    });

    $: if($signer){
        let tokenData = JSON.parse(localStorage.getItem('oauth2authcodepkce-state'))
        getAccountData(tokenData)

    }
    const getAccountData = async (tokenData) =>{
        winNFTCtrct = new ethers.Contract(ContractsConfigs.winTokenNFT, ContractsConfigs.NFTABI, $signer);
        gmNFTCtrct = new ethers.Contract(ContractsConfigs.gmTokenNFT, ContractsConfigs.NFTABI, $signer);
        expNFTCtrct = new ethers.Contract(ContractsConfigs.expTokenNFT, ContractsConfigs.NFTABI, $signer);
        imprNFTCtrct = new ethers.Contract(ContractsConfigs.impTokenNFT, ContractsConfigs.NFTABI, $signer);
        
        let data = await axios.get('https://lichess.org/api/account',{
            headers: { 
                'Authorization': `Bearer ${tokenData?.accessToken?.value}`
            }
        })

        let context = await axios.post('https://gildlab-ipfs.in.ngrok.io/lichess/api/v2/getNftContext',{lichessToken : tokenData?.accessToken?.value })
        getNFTContext = context.data.data
        accDetails = data.data
        getNFT(getNFTContext)
        
    }

    const getNFT =async (nftContext) => {
            winBalance = await winNFTCtrct.balanceOf($signerAddress)
            gmBalance = await gmNFTCtrct.balanceOf($signerAddress)
            expBalance = await expNFTCtrct.balanceOf($signerAddress)
            imprBalance = await imprNFTCtrct.balanceOf($signerAddress)
            console.log("gmBalance", gmBalance);
            
            if(parseInt(winBalance?.toString()) > 0){  
                console.log("hello win");
                 
                let tokenURI = await winNFTCtrct.tokenURI(nftContext.username) 
                winMetaData = await axios.get(tokenURI) 
            }
            if(parseInt(gmBalance?.toString()) > 0){   
                console.log("hello gm");
                let tokenURI = await gmNFTCtrct.tokenURI(nftContext.username) 
                gmMetaData = await axios.get(tokenURI) 
            }
            if(parseInt(expBalance?.toString()) > 0){   
                console.log("hello exp");
                let tokenURI = await expNFTCtrct.tokenURI(nftContext.username) 
                expMetaData = await axios.get(tokenURI) 
            }
            if(parseInt(imprBalance?.toString()) > 0){  
                console.log("hello impr"); 
                let tokenURI = await imprNFTCtrct.tokenURI(nftContext.username) 
                imprMetaData = await axios.get(tokenURI) 
            }
    }

    const mintNFT = async (badge) => {        
        if(badge == 'win'){
            let tx = await winNFTCtrct.flow(ContractsConfigs.winTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }else if(badge == 'gm'){
            let tx = await gmNFTCtrct.flow(ContractsConfigs.gmTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }else if(badge == 'xp'){
            let tx = await expNFTCtrct.flow(ContractsConfigs.expTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }else if(badge == 'improve'){
            let tx = await imprNFTCtrct.flow(ContractsConfigs.impTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }
        getNFT(getNFTContext)
    } 


</script>

{#if $signer}
    <Section>
        <SectionHeading>User Details</SectionHeading>
        <div class="p-3 pl-5">
        {#if !accDetails?.profile}
            Username : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>{accDetails ? accDetails?.username : "John Doe"}</a></span>
        {:else}
            Name : <span class="uppercase font-semibold"><a target='_blank' class="text-blue-400 underline" href={accDetails?.url}>{`${accDetails ? (accDetails?.profile?.firstName + " " + accDetails?.profile?.lastName) : "John Doe"}`}</a></span>
        {/if}
        </div>
        <SectionBody>
            <div class="flex flex-row">
                <div class="w-full">
                    <Item gap="gap-y-4">
                        <span class="text-lg text-gray-500 font-medium">Games Details: </span>
                        <div class="grid grid-cols-3 gap-x-4 gap-y-8 py-4">
                            <div class="flex items-center gap-x-4">
                                <img src="/assets/allGame.png" style="width:48px; height:48px" alt='all' class='me-4' />
                                <div class="flex flex-col">
                                <div class="text-base font-medium">Total Games</div>
                                <div class="text-2xl">{`${accDetails ? accDetails?.count.all : 0}`}</div>
                                </div>
                            </div>
                        
                            <div class="flex items-center gap-x-4">
                                <img src="/assets/win.png" style="width:48px; height:48px" alt='all' class='me-4' />
                                <div class="flex flex-col">
                                <div class="text-base font-medium">Win Games</div>
                                <div class="text-2xl">{`${accDetails ? accDetails?.count.win : 0}`}</div>
                                </div>
                            </div>
                        
                            <div class="flex items-center gap-x-4">
                                <img src="/assets/drawn.png" style="width:48px; height:48px" alt='all' class='me-4' />
                                <div class="flex flex-col">
                                <div class="text-base font-medium">Draw Games</div>
                                <div class="text-2xl">{`${accDetails ? accDetails?.count.draw : 0}`}</div>
                                </div>
                            </div>
                    
                            <div class="flex items-center gap-x-4">
                                <img src="/assets/loss.png" style="width:48px; height:48px" alt='all' class='me-4' />
                                <div class="flex flex-col">
                                <div class="text-base font-medium">Loss Games</div>
                                <div class="text-2xl">{`${accDetails ? accDetails?.count.loss : 0}`}</div>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-x-4">
                                <img src="/assets/playing.png" style="width:48px; height:48px" alt='all' class='me-4' />
                                <div class="flex flex-col">
                                <div class="text-base font-medium">Playing Games</div>
                                <div class="text-2xl">{`${accDetails ? accDetails?.count.playing : 0}`}</div>
                                </div>
                            </div>
                        </div>
                    </Item>
                </div>
            </div>

        </SectionBody>
    </Section>
    <Section>
        <SectionHeading>
            <div class="mb-2 flex flex-row w-full space-y-4"> 
                <div class="col-span-1 grid justify-center gap-y-4 pr-2">
                  <img src="/assets/badge.png" style="width:35px; height:35px" alt='energyToken' class='me-4' />
                </div>  
                NFT BADGES 
            </div>
            </SectionHeading>
        <SectionBody>
            <div class="flex flex-row gap-x-2 items-center  bg-violet-200 rounded-lg self-start p-3 max-w-prose ml-4">
                <IconLibrary width={30} icon="tip" />
                <div class="max-w-prose">Mint Badges, if you have <span class="font-bold">GM, WIN, XP and IMPROVE</span> token balance !</div>
            </div>
            <div class="grid grid-cols-4 gap-x-4 gap-y-4 px-4">
            <Section>
                <SectionBody>
                    {#if parseInt(winBalance?.toString()) == 0}
                        <img src="/assets/question-mark.png" width='90' height='90' alt='all' class='flex self-center' />
                        <Button small on:click={() =>{() =>{mintNFT("win")}}}> Mint Win Badge </Button>
                    {:else}
                        {#if winMetaData}
                            <img src={winMetaData?.data?.animation_url} width='144' height='144' alt='all' class='flex self-center bg-black' />
                        {/if}
                    {/if}
                </SectionBody>
            </Section>
            <Section>
                <SectionBody>
                    {#if parseInt(gmBalance?.toString()) == 0}
                        <img src="/assets/question-mark.png" width='90' height='90' alt='all' class='flex self-center' />
                        <Button small on:click={() =>{() =>{mintNFT("gm")}}}> Mint GM Badge </Button>
                    {:else}
                        {#if gmMetaData}
                            <img src={gmMetaData?.data?.animation_url} width='108' height='108' alt='all' class='flex self-center bg-black' />
                        {/if}
                    {/if}
                </SectionBody>
            </Section>
            <Section>
                <SectionBody>
                    {#if parseInt(expBalance?.toString()) == 0}
                        <img src="/assets/question-mark.png" width='90' height='90' alt='all' class='flex self-center' />
                        <Button small on:click={() =>{() =>{mintNFT("xp")}}}> Mint XP Badge </Button>    
                    {:else}
                        {#if expMetaData}
                            <img src={expMetaData?.data?.animation_url} width='108' height='108' alt='all' class='flex self-center bg-black' />
                        {/if}
                    {/if}
                </SectionBody>
            </Section>
            <Section>
                <SectionBody>
                    {#if parseInt(imprBalance?.toString()) == 0}
                        <img src="/assets/question-mark.png" width='90' height='90' alt='all' class='flex self-center' />
                        <Button small on:click={() =>{() =>{mintNFT("improve")}}}> Mint IMPV Badge </Button>
                    {:else}
                        {#if imprMetaData}
                            <img src={imprMetaData?.data?.animation_url} width='108' height='108' alt='all' class='flex self-center bg-black' />
                        {/if}
                    {/if}
                </SectionBody>
            </Section>
        </div>
        </SectionBody>
    </Section>
{/if}