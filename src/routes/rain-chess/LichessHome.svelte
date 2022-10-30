<script lang="ts">
    import Tab from "$components/tabs/Tab.svelte";
    import TabList from "$components/tabs/TabList.svelte";
    import TabPanel from "$components/tabs/TabPanel.svelte";
    import Tabs from "$components/tabs/Tabs.svelte";
    import LiChessPlayer from "$routes/rain-chess/liChessPlayer.svelte";
    import Info from "./Info.svelte";
    import Label from "./Label.svelte";
    import Section from "./Section.svelte";
    import SectionBody from "./SectionBody.svelte";
    import SectionHeading from "./SectionHeading.svelte";


</script>

<div class="flex w-full flex-col gap-y-4">
    <Tabs>
        <div class="bg-gray-200 px-14 pt-8">
            <TabList>
                <Tab>Intro</Tab>
                <Tab>Sign & Claim</Tab>
                <Tab>Rewards</Tab>
                <Tab>Designer</Tab>
            </TabList>
        </div>
        <TabPanel>
            <div class="pt-8 h-full">
                <div class="w-2/3">
                    <span class="text-2xl font-semibold p-4">Rain + LiChess</span>
                    <SectionBody>
                        <Info>Play on LiChess and collect rewards, game tokens, badges, nfts and much more !</Info>
                        <Info>Buy energy and mint assets based on your play. Trade your assets with other players, make your collection and win !</Info>
                    </SectionBody>
                </div>
                <div class="pt-6 w-2/3">
                    <span class="text-2xl font-semibold p-4">How it works?</span>            
                    <SectionBody>
                            <Info> Wether you are a seasoned GM or a humble noob, we have got you covered. Theres something for everybody. </Info>
                            
                            <span class="text-gray-500 text-base font-medium"> Get Started : </span>
                            <ul>
                                <li><span class="font-semibold"> -></span> GO to sign & claim , Login with  Lichess Account and connect your wallet.</li>
                                <li><span class="font-semibold"> -></span> Click on the verify button and sign the message.Your wallet will now be mapped with lichess account, use it to claim rewards. </li>
                                <li><span class="font-semibold"> -></span> Participate in games , tournaments on LiChess, submit gameId and claim rewards </li>
                                <li><span class="font-semibold"> -></span> Buy energy and mint assets based on your play ,trade your assets with other players,make your collection and win.  </li>
                            </ul>
                    </SectionBody>
                </div>
                <div class="pt-6 w-2/3">
                    <span class="text-2xl font-semibold p-4">What is Rain ?</span>
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
        </TabPanel>
        <TabPanel>
            <LiChessPlayer />
        </TabPanel>
    </Tabs>
</div> 