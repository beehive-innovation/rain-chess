<script>
  import { Steps } from "svelte-steps";
  let steps = [
    { text: "[1 XP]" },
    { text: "[2 XP]" },
    { text: "[3 XP]" },
    { text: "[4 XP]" },
    { text: "[5 XP]" },
  ];

  export let message = "Default message";
</script>

<Steps {steps} size="2rem" line="2rem" />

<style>
  h2 {
    font-size: 2rem;
    text-align: center;
  }
</style>
