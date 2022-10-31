<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	export let isHeight = false 

	const panel = {};
	const { registerPanel, selectedPanel } = getContext(TABS);
	registerPanel(panel);
</script>

{#if $selectedPanel === panel}
	<div id={`${isHeight ? "getHeight" : ""}`} class="bg-white px-14">
		<slot></slot>
	</div>
{/if}

<style>
	#getHeight{
		height: 83vh;
	}
</style>