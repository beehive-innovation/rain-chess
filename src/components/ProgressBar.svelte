<script>
  export let progress = 0;
  export let total = 0;
  export let color = "green";
  export let height = 4;
  export let steps = [];

  let raiseOverMin = 0, level;

  $: overMax = progress > total;
  $: progressMin = total ? (progress / total) * 100 : 0;
  $: if (overMax) {
    raiseOverMin = total ? (total / progress) * 100 : 0;
  }
  // $: overTotal = progress > total ? 100 : progressMin
  $: threshold = (total / steps.length)
  $: if(threshold){
    for(let i =1; i< steps.length + 1; i++)
      level = (threshold * i) <= progressMin ? i : 1
  }
  let barHeight = "";

  $: if (height == 4) {
    barHeight = "h-5";
  } else if (height == 5) {
    barHeight = "h-5";
  }
</script>

<div class="relative w-full overflow-y-hidden">
  <div class="flex justify-between py-4">
    <span>Level {level}</span>
    <span>{overMax ? 100 : progressMin} %</span>
  </div>
  <div class="w-full {barHeight} flex overflow-hidden relative rounded-full bg-gray-300">
      {#each steps as item, i}
      <div class="h-full w-full justify-end flex items-center">
        <div class="flex text-black font-xl z-10 fixed rounded-full h-7 w-7 bg-white justify-center items-center">{i +1}</div>
      </div>
      {/each}
      <div class="h-full {color} absolute"  style="width:{progressMin}%" />
    </div>
    <div class="w-full mt-3 flex overflow-hidden relative">
    {#each steps as item}
      <div class="h-full w-full justify-end flex text-right items-center">
        <span class="w-12">{item}</span>
      </div>
    {/each}
  </div>
  {#if overMax}
    <div
      class="absolute scale-y-110 border-l border-gray-500"
      style="top:-5px; bottom:-5px; left:{raiseOverMin}%"
    />
  {/if}
</div>

<style>
  .green {
    @apply bg-green-500;
  }

  .blue {
    @apply bg-blue-500;
  }
</style>
