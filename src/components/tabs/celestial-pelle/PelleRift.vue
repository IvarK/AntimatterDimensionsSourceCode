<script>
import PelleRiftBar from "./PelleRiftBar.vue";

export default {
  name: "PelleRift",
  components: {
    PelleRiftBar
  },
  props: {
    rift: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isActive: false,
      isMaxed: false,
      totalFill: new Decimal(),
      resource: new Decimal(),
      hasEffectiveFill: false,
      effects: []
    };
  },
  methods: {
    update() {
      const rift = this.rift;
      this.effects = this.rift.effects;
      this.isActive = rift.isActive;
      this.isMaxed = rift.isMaxed || Pelle.hasGalaxyGenerator;
      this.setValue("totalFill", rift.totalFill);
      this.setValue("resource", rift.fillCurrency.value);
      this.hasEffectiveFill = rift.key === "pestilence" && PelleRifts.chaos.milestones[0].canBeApplied;
    },
    // One rift has a number and the others are all Decimals; this reduces boilerplate for setting multiple values
    setValue(key, value) {
      if (typeof value === "number") this[key] = value;
      else this[key].copyFrom(value);
    },
    hasMilestone(idx) {
      return this.rift.milestones[idx].canBeApplied;
    },
    // One-off formatting function; needs to format large Decimals and a small number assumed to be a percentage
    formatRift(value) {
      return typeof value === "number" ? formatPercents(value, 3) : format(value, 2);
    }
  },
};
</script>

<template>
  <div class="c-pelle-rift">
    <h2>{{ rift.name }}</h2>
    <PelleRiftBar :rift="rift" />
    <div class="o-pelle-rift-milestone-container">
      <div
        v-for="(milestone, idx) in rift.milestones"
        :key="'milestone-' + idx"
        :ach-tooltip="milestone.description"
        class="o-pelle-rift-milestone"
        :class="{ 'o-pelle-rift-milestone--unlocked': hasMilestone(idx) }"
      >
        {{ formatPercents(milestone.requirement) }}
      </div>
    </div>
    <div class="c-pelle-rift-effect-container">
      <div
        v-for="(effect, idx) in effects"
        :key="'effect-' + idx"
        class="highlight"
      >
        {{ effect }}
      </div>
    </div>
    <div
      v-if="!isMaxed"
      class="c-pelle-rift-status"
    >
      <button
        class="o-pelle-rift-toggle"
        :class="{ 'o-pelle-rift-toggle--active': isActive }"
        @click="rift.toggle()"
      >
        {{ isActive ? "Filling" : "Idle" }}
      </button>
      Drains {{ rift.drainResource }} to fill.
      <br>
      Current Amount: {{ formatRift(resource) }}
      <br>
      Total Filled: {{ formatRift(rift.totalFill) }}
    </div>
  </div>
</template>

<style scoped>
.c-pelle-rift {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.o-pelle-rift-toggle {
  padding: 0.5rem;
  background: black;
  border: 1px solid var(--color-pelle-secondary);
  font-family: Typewriter;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  width: 8rem;
  margin-bottom: 1rem;
}

.c-pelle-rift-effect-container {
  height: 6rem;
}

.c-pelle-rift-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  width: 25rem;
}

.o-pelle-rift-toggle:hover {
  box-shadow: 1px 1px 3px var(--color-pelle-secondary);
  transition-duration: 0.12s;
}

.o-pelle-rift-toggle--active {
  background: var(--color-pelle-secondary);
  color: black;
}

.o-pelle-rift-milestone-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 70%;
}

.o-pelle-rift-milestone {
  background: black;
  padding: 1rem;
  width: 5rem;
  margin-bottom: 1rem;
  color: white;
  border: 1px solid var(--color-pelle-secondary);
  border-radius: 5px;
}

.o-pelle-rift-milestone--unlocked {
  background: var(--color-pelle-secondary);
  color: black;
}

h2,
.highlight {
  color: var(--color-pelle--base);
  font-weight: bold;
  padding: 0.2rem;
  text-shadow: 1px 1px 5px black;
}

[ach-tooltip]:before {
  width: 14rem;
  border: 0.1rem solid var(--color-pelle-secondary);
  background-color: hsl(0, 0%, 5%);
  z-index: 4;
}

[ach-tooltip]:after {
  border-top: 0.5rem solid var(--color-pelle-secondary);
}
</style>
