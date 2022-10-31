<script lang="ts">
    import Tab from "$components/tabs/Tab.svelte";
    import TabList from "$components/tabs/TabList.svelte";
    import TabPanel from "$components/tabs/TabPanel.svelte";
    import Tabs from "$components/tabs/Tabs.svelte";
    import LiChessPlayer from "$routes/rain-chess/LiChessPlayer.svelte";
    import GameDesigner from "./GameDesigner.svelte";
    import Intro from "./Intro.svelte";

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
            <Intro />
        </TabPanel>
        <TabPanel>
            <LiChessPlayer />
        </TabPanel>
        <TabPanel>
            Rewards
        </TabPanel>
        <TabPanel>
            <GameDesigner />
        </TabPanel>
    </Tabs>
</div> 