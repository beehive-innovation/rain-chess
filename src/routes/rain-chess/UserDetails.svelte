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
    import IconLibrary from "$components/IconLibrary.svelte";
    import { queryStore } from "@urql/svelte";
    import { client } from "$src/stores";
    import progressBar from "./progressBar.svelte";
    import { getContext } from "svelte";
    import { Confetti } from "svelte-confetti"
    import ProgressCircle from "$components/ProgressCircle.svelte";
    import { formatUnits, parseUnits } from "ethers/lib/utils";
    const { open } = getContext("simple-modal");

    let value4 = 25;

    // $: progressFillColor = value4 < 25 ? '#F489A3' : value4 > 75 ? '#60E4C2' : '#FFE5AB';

    let accDetails, winNFTCtrct, gmNFTCtrct, expNFTCtrct, imprNFTCtrct
    let getNFTContext, progress, progressColor

    let accAddress

    $: queryData = queryStore({
    client: $client,
    query: `
        query ($accAddress: Bytes!) {
            erc721S(orderBy: name, orderDirection: asc) {
                name
                thresholds
                symbol
                totalSupply
                flowId
                id
                __typename
                nfts(where: {owner: $accAddress}) {
                    tokenURI
                    metaData {
                        animation_url
                        image
                    }
                    __typename
                }
                erc20Token {
                    id
                    decimals
                    balances(where: {account: $accAddress}) {
                        amount
                    }
                }
            }
        }`,
    variables: { accAddress },
    requestPolicy: "network-only"
  });

    $: if($signer){
        accAddress = $signerAddress?.toLowerCase();
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
        accDetails = data.data

        let context = await axios.post('https://gildlab-ipfs.in.ngrok.io/lichess/api/v2/getNftContext',{lichessToken : tokenData?.accessToken?.value })
        getNFTContext = context.data.data
        // getNFT(getNFTContext)
        
    }

    const mintNFT = async (badge) => { 
        console.log("badge", badge);
               
        if(badge == 'WinNFT'){
            let tx = await winNFTCtrct.flow(ContractsConfigs.winTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }else if(badge == 'GrandMasterNFT'){
            let tx = await gmNFTCtrct.flow(ContractsConfigs.gmTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }else if(badge == 'ExperienceNFT'){
            let tx = await expNFTCtrct.flow(ContractsConfigs.expTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }else if(badge == 'ImprovementNFT'){
            let tx = await imprNFTCtrct.flow(ContractsConfigs.impTokenNFTFlowId , getNFTContext.username, [getNFTContext.nftContext]) 
            let receipt = await tx.wait()
        }
        // getNFT(getNFTContext)   
    } 

    $: erc721s = !$queryData?.fetching && $queryData?.data?.erc721S
      ? $queryData?.data?.erc721S : undefined; 
 
    $: if(erc721s){
        const getNFTs = async () =>{
            console.log("erc721", erc721s);
            
            erc721s.map(async nftToken => {
                let thresholds = nftToken.thresholds
                let spanDist = 100 / thresholds.length
                let NFTBal = parseInt(formatUnits(nftToken.erc20Token.balances[0]?.amount, nftToken.erc20Token?.decimals).toString())
                let nftVal = nftToken.nfts[0].tokenURI?.split("/")?.pop()[0]
                console.log("abc", nftToken.erc20Token.balances[0]?.amount, nftToken.erc20Token?.decimals);
                
                console.log("thresholds : ", thresholds, "spanDist : ", spanDist, "NFTBal : ", NFTBal, "nftVal : ", nftVal);
                
                // for(let i = 1; i <= thresholds.length; i++){
                //     if(i == nftVal){
                //         console.log("hello",i == nftVal, i, nftVal );
                        
                //         progress = spanDist * i
                //     }else{
                //         let min = i, max = i + 1
                //         console.log("nftbal,min,max",NFTBal, min, max);
                        
                //         let percent = rangePercentage(NFTBal, min, max)
                //         console.log("percent", percent);
                        
                //     }
                // }
                let percent = rangePercentage(NFTBal, 0, formatUnits(thresholds[thresholds.length-1], nftToken.erc20Token?.decimals).toString())
                console.log("progress", percent, formatUnits(thresholds[thresholds.length-1], nftToken.erc20Token?.decimals).toString());
                nftToken.progress = (percent > 100) ? 100 : percent
                
                
            });
        }

        getNFTs()
    }
    function rangePercentage (input, range_min, range_max, range_2ndMax){

        var percentage = ((input - range_min) * 100) / (range_max - range_min);
        if (percentage > 100) {
            if (typeof range_2ndMax !== 'undefined'){
                percentage = ((range_2ndMax - input) * 100) / (range_2ndMax - range_max);
                if (percentage < 0) {
                    percentage = 0;
                }
            } else {
                percentage = 100;
            }
        } else if (percentage < 0){
            percentage = 0;
        }
        return percentage;
    }
    let confetti = false;
    const handleConfetti = async () => { 
        confetti = !confetti;
        console.log(confetti);
        
  }; 
</script>

{#if $signer}
    {#if $queryData.fetching}
    Loading...
    {:else if $queryData.error}
    <span class="text-red-400">Something went wrong, try refreshing the page.</span>
    {:else}
    <!-- <div> -->
    <!-- <Button shrink on:click={() =>{handleConfetti()}}> Toggle Confetti </Button> -->
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
        {#if erc721s}
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
                        {#each erc721s as NFTToken}
                        <!-- {console.log("nft",typeof formatUnits(NFTToken.erc20Token.balances[0].amount, NFTToken.erc20Token.decimals))} -->
                            <Section>
                                <SectionBody>
                                    {#if NFTToken.erc20Token}
                                        {#if NFTToken.erc20Token.balances?.length == 0 }
                                        <!-- {#if parseInt(formatUnits(NFTToken.erc20Token.balances[0]?.amount, NFTToken.erc20Token?.decimals)) == 0} -->
                                            <img src="/assets/question-mark.png" width='90' height='90' alt='all' class='flex self-center' />
                                            <Button small on:click={() =>{mintNFT(NFTToken.__typename)}}> 
                                                Mint {`${NFTToken.__typename == "ImprovementNFT" ? " IMPV " : 
                                                        NFTToken.__typename == "WinNFT" ? " WIN " :
                                                        NFTToken.__typename == "GrandMasterNFT" ? " GM " : " XP "}`} Badge 
                                            </Button>
                                        {:else}
                                            {#if NFTToken.nfts[0]?.metaData?.animation_url}
                                            <div class="sample">
                                                <div class="sample-4c" style="--progress-color: {NFTToken.progress < 25 ? '#EF476F' : NFTToken.progress > 75 ? '#06D6A0' : '#FFD166'}; --progress-fill: transparent">
                                                    <ProgressCircle max={100} value={NFTToken.progress}>
                                                    <!-- <span>{Math.floor(value4)}</span> -->
                                                    <img src={NFTToken.nfts[0].metaData.animation_url} width='123' height='123' alt='all' class='flex self-center bg-black rounded-full' />
                                                    </ProgressCircle>
                                                </div>
                                            </div>
                                            {/if}
                                        {/if}  
                                    {/if}
                                    </SectionBody>
                            </Section>
                        {/each}
                    </div>
                </SectionBody>
            </Section>
        {/if}
        <!-- {#if confetti}
            <div style="
                position: fixed;
                top: -50px;
                left: 0;
                height: 100vh;
                width: 100vw;
                display: flex;
                justify-content: center;
                overflow: hidden;
                pointer-events: none;"
            > -->
            <!-- <Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} infinite duration=5000 amount=200 fallDistance="100vh" /> -->
                <!-- <Confetti x={[-5, 5]} y={[0, 0.1]} delay={[0, 2000]} duration=2000 amount=5000 fallDistance="100vh" />
            </div>
        {/if}
    </div> -->
    {/if}
{/if}


<style>
    .sample{
        display: grid;
        grid-auto-rows: 144px;
        grid-gap: 2rem;
    }
    .sample-4c span {
        left: 50%;
        position: absolute;
        top: 50%;
        font-size: 2rem;
        transform: translate(-50%, -50%);
        --progress-trackcolor: transparent;
        --progress-width: 2px;
    }
</style>