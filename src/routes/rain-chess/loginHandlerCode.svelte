<!-- <script lang="ts">
    import { signer, signerAddress } from "svelte-ethers-store";
    import Button from "$components/Button.svelte";
    import Input from "$components/Input.svelte";
    import { validateFields } from "../../utils";
    import { addressValidate, required } from "../../validation";
    import Parser from "$components/parser/Parser.svelte";
    import Label from "$routes/rain-chess/Label.svelte";
    import Info from "$routes/rain-chess/Info.svelte";
    import Section from "$routes/rain-chess/Section.svelte";
    import SectionHeading from "$routes/rain-chess/SectionHeading.svelte";
    import SectionBody from "$routes/rain-chess/SectionBody.svelte";
    import Item from "$routes/rain-chess/Item.svelte";
    import { writable, type Writable } from "svelte/store";
    import IconLibrary from "$components/IconLibrary.svelte";
    import StakeNBuy from "$routes/rain-chess/Stake&Buy.svelte";
    import { getContext } from "svelte";
    import { push } from "svelte-spa-router";
    import Select from "$components/Select.svelte";
    import {EmissionsERC20} from "rain-sdk" 
    import { ethers } from 'ethers';  
    import axios from 'axios'
    import { location, querystring } from 'svelte-spa-router'
    import { EmissionContracts } from "$src/constants";
  
    import  { Auth } from "$src/test";

  
    const loginWithLichess = async () => { 
  
        let auth = new Auth()  
        let data = await auth.login()   
        console.log("data", data);
        
  };
  console.log("data", params);
  
  
  </script>
  
  <div>
    <button on:click={loginWithLichess}>Login With LiChess </button>
    <div>
      current page location:   {$location}
     </div>
     <div>current page query:   {$querystring}</div>
     <div>current page param:   {params}</div>
  </div>
  
   -->