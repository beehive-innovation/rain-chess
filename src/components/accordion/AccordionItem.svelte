<script>
    
    import { getContext } from 'svelte';

    import IconLibrary from '$components/IconLibrary.svelte';

    import { slide } from "svelte/transition";
    
    export let id;

    export let title;
    
    // export let subTitle = "";

    let isHovered = false;

    let isFocused = false;

    const active = getContext("context");

    $: isCurrentActive = $active === id;

    const onClickHandler = () => {

        if (isCurrentActive) {
            
            $active = null;
        } 
        else {
            
            $active = id;
        }
    }
</script>


<div class="flex flex-col items-stretch border border-gray-400 rounded-lg">
    <button 
    on:click={onClickHandler}
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
    on:focus={() => isFocused = true}
    on:blur={() => isFocused = false}
    class="flex text-left w-full focus:outline-none items-center p-2 pl-4">
        <div class="w-full">
            <div class="font-semibold text-lgmb-1 transition text-gray-700"
                class:text-zinc-800={isHovered || isFocused}
            >
                <span class="inline-block border-transparent transition"
                    class:border-opacity-50={isFocused}
                    class:border-blue-300={isFocused}
                >
                    {title}  
                </span>    
            </div>
        </div>

        <div class="w-8 transform transition text-gray-300"
            class:rotate-180={isCurrentActive}
            class:text-zinc-800={isHovered || isFocused}
        >
            <IconLibrary width={30} icon="down-arrow" />
        </div>
    </button>
    {#if isCurrentActive}
        <div class="mx-4 mb-4 border"
        transition:slide>
            <slot/>
        </div>
    {/if}
</div>