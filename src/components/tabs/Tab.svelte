<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);
</script>

<a
  class="cursor-pointer border-b border-gray-200 pb-2 text-base text-gray-500 w-15 px-6"
  class:selected={$selectedTab === tab}
  on:click={() => selectTab(tab)}
>
  <slot />
</a>
<!-- <div class="w-5 border-b border-gray-200" /> -->

<style>
  .selected {
    @apply border-b border-gray-600 text-gray-800 font-medium;
  }
</style>
