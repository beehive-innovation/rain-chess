<script lang="ts">
    import { signer, signerAddress } from "svelte-ethers-store";
    import { getContext } from "svelte";
    import { Verify } from "rain-sdk" 
    import {auth } from '$src/stores'
    import Button from "$components/Button.svelte";
    import { push, replace } from "svelte-spa-router";

    export let show = true;

    console.log("show", show);
    

  const urlParams = new URLSearchParams(window.location.search);      
  
  function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

  $: if(urlParams.has('code')) { 
    const data =async () => {
      console.log("init called ") 
     await $auth.init() 
     console.log($auth.me,"hii") 
     if($auth.me && $signer){

       let verifyContract = new Verify('0xb8c01dee6a0f920d51ea137d4908f65b13c41bc1' , $signer)  
       
       let encoder = new TextEncoder()
  
        let verifySubmit = await verifyContract.approve([{
          account : $signerAddress , data : str2ab($auth.me.id)
        }])  
      console.log(verifySubmit)
     }
     let test = window.location.href
     let splitTest = test.split('/')
     splitTest.map((url) =>{
        if(url.startsWith("?code")){
          window.history.pushState({}, null, '/');
        }
     })
     
     push('/player')

    } 
    data()
  } 

  const loginWithLichess = async () => { 

console.log("auth", $auth);

  let data = await $auth.login()   
  console.log("data", data);
  
};


</script>

<div class="flex justify-center gap-y-3">
  <div class="flex flex-col p-8">
        <div class={`py-4 ${show ? "flex" : "hidden"} `}>Please log in to continue.</div>
        <Button on:click={loginWithLichess}>Login With LiChess </Button>
      </div>
      
</div>