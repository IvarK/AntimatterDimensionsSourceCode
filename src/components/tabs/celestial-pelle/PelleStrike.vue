<template>
  <div>
    <div
      class="c-pelle-strike"
      :class="{'c-pelle-strike--compact': compact }"
    >
      {{ strike.requirement }}<br><br>
      Penalty: {{ strike.penalty }}<br><br>
      Reward: {{ strike.reward }}
    </div>
    <PelleRift
      :rift="strike.rift"
      :compact="compact"
    />
  </div>
</template>

<script>
import PelleRift from "./PelleRift.vue";
export default {
  components: {
    PelleRift
  },
  props: {
    strike: Object,
    compact: Boolean
  },
};
</script>

<style>
  .c-pelle-strike {
    background: var(--color-pelle--base);
    color: black;
    padding: 2rem;
    font-size: 1.3rem;
    border: 2px solid black;
    border-radius: 0.5rem;
    font-weight: bold;
    width: 25rem;
    margin: 0 0.5rem;
    margin-bottom: 2rem;
  }

  .c-pelle-strike--compact {
    overflow: hidden;
    height: 6rem;
  }
</style>