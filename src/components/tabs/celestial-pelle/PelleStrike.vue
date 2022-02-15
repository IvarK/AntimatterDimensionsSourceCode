<script>
import PelleRift from "./PelleRift.vue";
import ExpandingControlBox from "@/components/ExpandingControlBox";

export default {
  name: "PelleStrike",
  components: {
    PelleRift,
    ExpandingControlBox
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
    <div class="c-pelle-strike-container">
      <ExpandingControlBox
        container-class="c-pelle-strike"
      >
        <div
          slot="header"
          class="c-pelle-strike-text-padding"
        >
          ▼ {{ strike.requirement }} ▼
        </div>
        <div
          slot="dropdown"
          class="c-pelle-strike-text-padding"
        >
          Penalty: {{ strike.penalty }}
          <br><br>
          Reward: {{ strike.reward }}
          <br>
        </div>
      </ExpandingControlBox>
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
    font-size: 1.3rem;
    border: 2px solid black;
    border-radius: 0.5rem;
    font-weight: bold;
    min-height: 3.8rem;
  }

  .c-pelle-strike-container {
    padding: 0.5rem 0.5rem 2rem;
  }

  .c-pelle-strike-text-padding {
    padding: 0.7rem;
  }
</style>
