<script lang="ts" type="module">
  import Header from "./layout/Header.svelte";
  import Router from "svelte-spa-router";
  import Modal from "svelte-simple-modal";
  import { signer } from "svelte-ethers-store";

  import liChessPlayer from "$routes/rain-chess/liChessPlayer.svelte";
  import GameDesigner from "$routes/rain-chess/GameDesigner.svelte";
  import LoginHandler from "$routes/rain-chess/loginHandler.svelte";
    import LiChessLogin from "$routes/rain-chess/liChessLogin.svelte";
  // import LoginHandlerCode from "$routes/rain-chess/loginHandlerCode.svelte";

  $: oAuth = localStorage.getItem('oauth2authcodepkce-state')

  
  let routes = {};

  routes = {
    // Using named parameters, with last being optional
    "/" : LiChessLogin,
    "/player" : liChessPlayer,
    // "/": LoginHandler,
    "/designer": GameDesigner, 


    // Catch-all
    // This is optional, but if present it must be the last
    // '*': NotFound,
  };
  
</script>
  
<Modal
  unstyled={true}
  closeButton={false}
  classWindow="relative max-w-full max-h-full my-2 mx-auto text-white rounded-xl shadow-md bg-gray-800"
  classBg="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center bg-gray-900 bg-opacity-75 z-50 backdrop-blur"
  classWindowWrap="relative m-2 max-h-full flex flex-col"
  classContent="p-6"
>
  <Header />

  <main class="relative flex">
    <div class="w-full">
      <Router {routes} />
      {#if oAuth && $signer}
        <Router {routes} />
      {:else if !$signer && oAuth}
        Connect your wallet to get started.
      {/if}
    </div>
  </main>
</Modal>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
