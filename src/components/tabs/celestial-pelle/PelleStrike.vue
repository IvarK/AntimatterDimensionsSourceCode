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
    <ExpandingControlBox
      :label="strike.requirement"
      container-class="c-pelle-strike"
    >
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
  background: var(--color-pelle--base);
  color: black;
  font-size: 1.3rem;
  border: 0.2rem solid black;
  border-radius: 0.5rem;
  font-weight: bold;
  min-height: 3.8rem;
  z-index: 3;
}

.s-base--metro .c-pelle-strike {
  border-radius: 0;
}

.c-pelle-strike-container {
  padding: 0.5rem 0.5rem 2rem;
  height: 5rem;
  z-index: 3;
  width: 26rem;
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
