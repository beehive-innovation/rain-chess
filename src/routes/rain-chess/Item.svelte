<script lang="ts">
    export let width:string = ""
    export let gap:string = "gap-y-1"
</script>
<div class={`${width} ${gap} flex flex-col `}><slot/></div>