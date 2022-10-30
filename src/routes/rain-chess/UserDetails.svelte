<script lang="ts">
    import Item from "./Item.svelte";
    import Section from "./Section.svelte";
    import SectionBody from "./SectionBody.svelte";
    import SectionHeading from "./SectionHeading.svelte";
    import Label from "$routes/rain-chess/Label.svelte";
    import Info from "$routes/rain-chess/Info.svelte";
    import { signer, signerAddress } from "svelte-ethers-store";
    import axios from 'axios'

    let accDetails

    $: if($signer){
        const getAccountData = async () =>{

            let tokenData = JSON.parse(localStorage.getItem('oauth2authcodepkce-state')) 

            let data = await axios.get('https://lichess.org/api/account',{
            headers: { 
                'Authorization': `Bearer ${tokenData?.accessToken?.value}`
            }
            })
            console.log("data", data);

            accDetails = data.data
        }
        getAccountData()
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
            <div class="w-1/2">
        <Item gap="gap-y-4">
            <Label>Games Details: </Label>
            <Info>
            <span class="flex gap-x-4 ">
                <img src="/assets/allGame.png" width='30' height='30' alt='all' class='me-4' /> Total games : {`${accDetails ? accDetails?.count.all : 0}`}
            </span>
            </Info>
            <Info>
            <span class="flex gap-x-4 ">
                <img src="/assets/win.png" width='30' height='30' alt='all' class='me-4' /> Win games : {`${accDetails ? accDetails?.count.win : 0}`}
            </span>
            </Info>
            <Info>
            <span class="flex gap-x-4 ">
                <img src="/assets/drawn.png" width='30' height='30' alt='all' class='me-4' /> Draw games : {`${accDetails ? accDetails?.count.draw : 0}`}
            </span>
            </Info>
            <Info>
            <span class="flex gap-x-4 ">
                <img src="/assets/loss.png" width='30' height='30' alt='all' class='me-4' /> Loss games : {`${accDetails ? accDetails?.count.loss : 0}`}
            </span>
            </Info>
            <Info>
            <span class="flex gap-x-4 ">
                <img src="/assets/playing.png" width='30' height='30' alt='all' class='me-4' /> Playing games : {`${accDetails ? accDetails?.count.playing : 0}`}
            </span>
            </Info>
        </Item>
        </div>
        <div class="w-1/2">
        <Item>
            <Label>NFTs : </Label>
            <div class="flex py-4">
            <div class="flex w-1/2 gap-x-4">
                <img src="/assets/bullet.png" width='35' height='35' alt='all' class='me-4' />
                <div class="flex flex-col">
                <div>BULLET</div>
                <div>{`${accDetails ? accDetails?.perfs?.bullet?.games : 0} games`}</div>
                </div>
            </div>

            <div class="flex w-1/2 gap-x-4">
                <img src="/assets/blitz.png" width='40' height='26' alt='all' class='me-4' />
                <div class="flex flex-col">
                <div>BLITZ</div>
                <div>{`${accDetails ? accDetails?.perfs?.blitz?.games : 0} games`}</div>
                </div>
            </div>
            </div>

            <div class="flex py-4">
            <div class="flex w-1/2 gap-x-4">
                <img src="/assets/rapid.png" width='35' height='35' alt='all' class='me-4' />
                <div class="flex flex-col">
                <div>RAPID</div>
                <div>{`${accDetails ? accDetails?.perfs?.rapid?.games : 0} games`}</div>
                </div>
            </div>

            <div class="flex w-1/2 gap-x-4">
                <img src="/assets/classical.png" width='35' height='35' alt='all' class='me-4' />
                <div class="flex flex-col">
                <div>CLASSICAL</div>
                <div>{`${accDetails ? accDetails?.perfs?.classical?.games : 0} games`}</div>
                </div>
            </div>
            </div>
        </Item>
        </div>
        </div>
        </SectionBody>
    </Section>
{/if}