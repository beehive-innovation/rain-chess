<script lang="ts">
    import IconLibrary from "$components/IconLibrary.svelte";
    import Info from "./Info.svelte";
    import Section from "./Section.svelte";
    import SectionBody from "./SectionBody.svelte";
</script>

<div class="pt-8 h-full">
    <div class="w-2/3">
        <span class="text-3xl font-semibold p-4">Rain + LiChess</span>
        <SectionBody>
            <div class="flex flex-row gap-x-2 items-center  bg-violet-200 rounded-lg self-start p-3 max-w-prose">
                <IconLibrary width={30} icon="tip" />
                <div class="max-w-prose">Play on LiChess and collect rewards, game tokens, badges, nfts and much more!</div>
              </div>
            <!-- <span class="text-gray-800 max-w-prose text-lg italic">Play on LiChess and collect rewards, game tokens, badges, nfts and much more!</span> -->
            <span class="text-gray-800 max-w-prose text-lg italic">Buy energy and mint assets based on your play. Trade your assets with other players, make your collection and win!</span>
        </SectionBody>
    </div>
    <div class="pt-6 w-2/3">
        <span class="text-3xl font-semibold p-4">How it works?</span>            
        <SectionBody>
            <span class="text-gray-800 max-w-prose text-lg italic">Wether you are a seasoned GM or a humble noob, we have got you covered. There something for everybody. </span>
                
                <span class="text-gray-500 text-lg font-medium"> Get Started : </span>
                <Section>
                    <dl class="p-4 space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
                        <div class="relative">
                            <dt>
                            <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-gray-500 text-white">
                                <!-- Heroicon name: outline/lock-closed -->
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p class="ml-16 text-base font-medium leading-6 "><span class="pr-2 text-gray-500 border-r-2">Step 1</span><span class="ml-2 text-grey-800">Login</span></p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">Go to sign & claim, Login with Lichess Account and connect your wallet.</dd>
                        </div>

                        <div class="relative">
                            <dt>
                            <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-gray-500 text-white">
                                <!-- Heroicon name: outline/badge-check -->
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <p class="ml-16 text-base font-medium leading-6 "><span class="pr-2 text-gray-500 border-r-2">Step 2</span><span class="ml-2 text-grey-800">Verify Account</span></p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">Click on the verify button and sign the message. Your wallet will now be mapped with lichess account, use it to claim rewards.</dd>
                        </div>

                        <div class="relative">
                            <dt>
                            <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-gray-500 text-white">
                                <!-- Heroicon name: outline/gift -->
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <p class="ml-16 text-base font-medium leading-6 "><span class="pr-2 text-gray-500 border-r-2">Step 3</span><span class="ml-2 text-grey-800">Participate & Claim Rewards</span></p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">Participate in games, tournaments on LiChess, submit gameId and claim rewards.</dd>
                        </div>

                        <div class="relative">
                            <dt>
                            <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-gray-500 text-white">
                                <!-- Heroicon name: outline/dollar -->
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p class="ml-16 text-base font-medium leading-6 "><span class="pr-2 text-gray-500 border-r-2">Step 4</span><span class="ml-2 text-grey-800">Buy & Mint</span></p>
                            </dt>
                            <dd class="mt-2 ml-16 text-base text-gray-500">Buy energy and mint assets based on your play, trade your assets with other players, make your collection and win.</dd>
                        </div>
                    </dl>
                </Section>
                <div class="flex flex-row gap-x-2 items-center  bg-violet-200 rounded-lg self-start p-3 max-w-prose">
                    <IconLibrary width={30} icon="tip" />
                    <div class="max-w-prose">If you lose a game, you can only claim <span class="font-bold">Experience(XP) Token</span>!</div>
                  </div>
        </SectionBody>
    </div>
    <div class="pt-6 w-2/3">
        <span class="text-3xl font-semibold p-4">What is Rain ?</span>
        <SectionBody>
            <Info>
                Rain Protocol enables you to build web3 economies at scale. Weather it be integrating web3 into an 
                exsisting ecosystem or building a new one, rain empowers communities and developers to build launchpads, 
                games, game studios, DAOs or virtual artists, sell land or bootstrap a creative project; either out of 
                the box or configurable by you, pre-audited, permissionless and available on any EVM compatible chain .
                Rain is web3 lego. Snap pieces together, build something, then snap new pieces together tomorrow and do something new.  
            </Info>
        </SectionBody>
    </div>  
</div>