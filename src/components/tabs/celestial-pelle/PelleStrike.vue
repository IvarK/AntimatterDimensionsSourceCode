<script>
import ExpandingControlBox from "@/components/ExpandingControlBox";

export default {
  name: "PelleStrike",
  components: {
    ExpandingControlBox
  },
  props: {
    strike: {
      type: Object,
      required: true
    },
  },
};
</script>

<template>
  <div class="c-pelle-strike-container">
    <ExpandingControlBox
      container-class="c-pelle-strike"
    >
      <div
        slot="header"
        class="c-pelle-strike-text-padding c-pelle-strike-requirement-header"
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
    height: 5rem;
    z-index: 3;
  }

  .c-pelle-strike-text-padding {
    padding: 0.7rem;
  }

  .c-pelle-strike-requirement-header {
    cursor: pointer;
  }
</style>
