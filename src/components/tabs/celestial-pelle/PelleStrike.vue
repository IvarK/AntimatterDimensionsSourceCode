<script>
import PelleRift from "./PelleRift.vue";

export default {
  name: "PelleStrike",
  components: {
    PelleRift
  },
  props: {
    strike: {
      type: Object,
      required: true
    },
    compact: Boolean
  },
};
</script>

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
    height: 18rem;
  }

  .c-pelle-strike--compact {
    overflow: hidden;
    height: 6rem;
  }
</style>
