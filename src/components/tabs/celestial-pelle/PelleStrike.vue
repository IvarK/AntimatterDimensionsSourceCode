<template>
  <div class="c-pelle-strike">
    {{ strike.requirement }}<br><br>
    Penalty: {{ strike.penalty }}<br><br>
    Reward: {{ strike.reward }}
  </div>
</template>

<script>
export default {
  props: {
    strike: Object
  }
};
</script>

<style>
  .c-pelle-strike {
    background: crimson;
    color: black;
    padding: 2rem;
    font-size: 1.3rem;
    border: 2px solid black;
    border-radius: 0.5rem;
    font-weight: bold;
    width: 25rem;
  }
</style>