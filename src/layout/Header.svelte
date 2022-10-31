<script>
  import WalletConnect from "../components/wallet-connect/WalletConnect.svelte";
  import LiChessLogin from "$routes/rain-chess/LiChessLogin.svelte";

  $: oAuth = localStorage.getItem('oauth2authcodepkce-state')

</script>

<div
  class="sticky top-0 z-40 flex h-16 w-full flex-row items-center justify-between border-b border-gray-700 bg-gray-900 px-5"
>
  <div class="flex flex-row gap-x-3">
    <img src="/assets/logo.svg" alt="Rain Logo" class="w-7" />
    <span class="text-xl font-light text-gray-50">Rain Protocol</span>
  </div>
  <div class="flex flex-row items-center gap-x-4">
    
      {#if oAuth}
        <WalletConnect />
      {:else}
        <LiChessLogin show={false} />
      {/if}

    <span>
      <a
        href="https://github.com/beehive-innovation/rain-toolkit-gui"
        target="_blank"
      >
        <img src="/assets/github.svg" alt="Rain Logo" class="w-7" /></a
      >
    </span>
  </div>
</div>
