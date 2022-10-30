<script lang="ts">
    import Tab from "$components/tabs/Tab.svelte";
    import TabList from "$components/tabs/TabList.svelte";
    import TabPanel from "$components/tabs/TabPanel.svelte";
    import Tabs from "$components/tabs/Tabs.svelte";
    import LiChessPlayer from "$routes/rain-chess/liChessPlayer.svelte";


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
            <div class="flex flex-col gap-y-4">
                Rain + LiChess : 

                Play on LiChess and  collect rewards, game tokens,badges , nfts and much more ! 
                Buy energy and mint assets based on your play. Trade your assets with other players,make your collection and win !  
                ----------------------------------------------------------------------------------------------------------------------
            </div>  
         
            <div class="flex flex-col gap-y-4">
              
                how it works . 
    
                Wether you are a seasoned Gm or a humble noob, we have got you covered. Theres something for everybody. 
                
                Get Started : 
                -> GO to players , Login with  Lichess Account and connect your wallet.
                -> Click on the verify button and sign the message.Your wallet will now be mapped with lichess account, use it to claim rewards. 
                -> Participate in games , tournaments on LiChess, submit gameId and claim rewards 
                -> Buy energy and mint assets based on your play ,trade your assets with other players,make your collection and win.  
                ----------------------------------------------------------------------------------------------------------------------

            </div>  
            <div class="flex flex-col gap-y-4">
              
                What is Rain ? 
                Rain Protocol enables you to build web3 economies at scale. Weather it be integrating web3 into an 
                exsisting ecosystem or building a new one, rain empowers communities and developers to build launchpads, 
                games, game studios, DAOs or virtual artists, sell land or bootstrap a creative project; either out of 
                the box or configurable by you, pre-audited, permissionless and available on any EVM compatible chain .
                Rain is web3 lego. Snap pieces together, build something, then snap new pieces together tomorrow and do something new  
                ----------------------------------------------------------------------------------------------------------------------

    
            </div>  
     
            
        </TabPanel>
        <TabPanel>
            <LiChessPlayer />
        </TabPanel>
    </Tabs>
</div> 