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
  data() {
    return {
      strikeReward: ""
    };
  },
  methods: {
    update() {
      this.strikeReward = this.strike.reward();
    }
  }
};
</script>

<template>
  <div class="c-pelle-strike-container">
    <ExpandingControlBox container-class="c-pelle-strike">
      <template #header>
        <div class="c-pelle-strike-header">
          ▼ {{ strike.requirement }} ▼
        </div>
      </template>
      <template #dropdown>
        <div class="c-pelle-strike-dropdown">
          <span>Penalty: {{ strike.penalty }}</span>
          <br>
          <span>Reward: {{ strikeReward }}</span>
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
  width: 28rem;
  height: 5rem;
  z-index: 3;
  padding: 0.5rem 0.5rem 2rem;
}

.c-pelle-strike-header {
  padding: 0.7rem;
  cursor: pointer;
}

.c-pelle-strike-dropdown {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1.05rem;
  padding: 0.7rem;
}
</style>
