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
  }
};
</script>

<template>
  <div class="c-pelle-strike-container">
    <ExpandingControlBox container-class="c-pelle-strike">
      <template #header>
        <div class="c-pelle-strike-text-padding c-pelle-strike-requirement-header">
          ▼ {{ strike.requirement }} ▼
        </div>
      </template>
      <template #dropdown>
        <div class="c-pelle-strike-text-padding c-pelle-strike-description">
          Penalty: {{ strike.penalty }}
          <br><br>
          Reward: {{ strike.reward }}
          <br>
        </div>
      </template>
    </ExpandingControlBox>
  </div>
</template>

<style>
.c-pelle-strike {
  min-height: 3.8rem;
  z-index: 3;
  font-size: 1.3rem;
  font-weight: bold;
  color: black;
  background: var(--color-pelle--base);
  border: var(--var-border-width, 0.2rem) solid black;
  border-radius: var(--var-border-radius, 0.5rem);
}

.c-pelle-strike-container {
  width: 26rem;
  height: 5rem;
  z-index: 3;
  padding: 0.5rem 0.5rem 2rem;
}

.c-pelle-strike-description {
  font-size: 1.1rem;
}

.c-pelle-strike-text-padding {
  padding: 0.7rem;
}

.c-pelle-strike-requirement-header {
  cursor: pointer;
}
</style>
