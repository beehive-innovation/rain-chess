import { createClient } from "@urql/svelte";
import { AddressBook } from "rain-sdk";
import { derived, writable } from "svelte/store";
import { networks } from "./constants"; 
import {Auth} from "$src/test"


export let auth = writable(new Auth())

export const selectedNetwork = writable(networks[1]);
export const client = derived(
  selectedNetwork,
  $selectedNetwork => createClient({
    // url: "https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-protocol-mumbai-v3"
    url: AddressBook.getSubgraphEndpoint(Number($selectedNetwork.config.chainId))
  })
)



