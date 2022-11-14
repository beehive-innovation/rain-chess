<script lang="ts">
    import ProgressBar from "$components/ProgressBar.svelte";
    import { formatUnits } from "ethers/lib/utils";
    // import { tweened } from 'svelte/motion';
     import ProgressCircle from "$components/ProgressCircle.svelte"

  let value1 = 50;
  let value2 = 50;
  let value3 = 50;
  let value4 = 50;

  $: progressColor = value4 < 25 ? '#EF476F' : value4 > 75 ? '#06D6A0' : '#FFD166';
  $: progressFillColor = value4 < 25 ? '#F489A3' : value4 > 75 ? '#60E4C2' : '#FFE5AB';

    export let NFTToken, Steps = [], Progress

    $: if(NFTToken){
        let nftName = NFTToken.name == "GrandMaster Token" ? "GM" : 
            NFTToken.name == "Improvement Token" ? "IMPV" : 
            NFTToken.name == "Exp Token" ? "XP" : "WIN"
        // Steps.push("[" + nftName + "] Badge")
        NFTToken.thresholds.map((ele, index) =>{
            let string = "[" + nftName + "] Badge"
            Steps.push(string)
        })
        NFTToken.thresholds.length != 0 ? NFTToken.thresholds : []


        let length = NFTToken.thresholds?.length
        let inp = parseInt(formatUnits(NFTToken.erc20Token.balances[0]?.amount, NFTToken.erc20Token.decimals))
        let min = parseInt(formatUnits(NFTToken.thresholds[0], NFTToken.erc20Token.decimals))
        let max = parseInt(formatUnits(NFTToken.thresholds[length-1], NFTToken.erc20Token.decimals))

        
        let percentage = rangePercentage(2, min, max)
        Progress = percentage == 0 ? (100 / NFTToken.thresholds.length) : percentage
        console.log("progress", Progress);
    }
    // inp = 
    function rangePercentage (input, range_min, range_max, range_2ndMax){

        var percentage = ((input - range_min) * 100) / (range_max - range_min);

        if (percentage > 100) {

            if (typeof range_2ndMax !== 'undefined'){
                percentage = ((range_2ndMax - input) * 100) / (range_2ndMax - range_max);
                if (percentage < 0) {
                    percentage = 0;
                }
            } else {
                percentage = 100;
            }

        } else if (percentage < 0){
            percentage = 0;
        }

        return percentage;
    
    }
        
</script>
<div class="flex items-center w-46 h-46">
    <div class="sample-4c" style="--progress-color: {progressColor}; --progress-fill: {progressFillColor}">
        <ProgressCircle max="100" value={value4}>
          <span>{Math.floor(value4)}</span>
        </ProgressCircle>
      </div>
    <!-- </div> -->
</div>