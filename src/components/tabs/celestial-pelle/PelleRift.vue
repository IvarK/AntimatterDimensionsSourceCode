<script>
export default {
  name: "PelleRift",
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
      percentage: 0,
      totalFill: new Decimal(),
      resource: new Decimal(),
      hasEffectiveFill: false,
      selectedHoverMilestone: 0,
      // Converts 1 rem to number of px
      remToPx: parseInt(getComputedStyle(document.documentElement).fontSize),
      effects: []
    };
  },
  methods: {
    update() {
      const rift = this.rift;
      this.effects = this.rift.effects;
      this.isActive = rift.isActive;
      this.isMaxed = rift.isMaxed || Pelle.hasGalaxyGenerator;
      this.percentage = rift.percentage;
      this.setValue("totalFill", rift.totalFill);
      this.setValue("resource", rift.fillCurrency.value);
      this.hasEffectiveFill = rift.name === "Pestilence" && PelleRifts.chaos.hasMilestone(0);
    },
    // One rift has a number and the others are all Decimals; this reduces boilerplate for setting multiple values
    setValue(key, value) {
      if (typeof value === "number") this[key] = value;
      else this[key].copyFrom(value);
    },
    hasMilestone(idx) {
      return this.rift.hasMilestone(idx);
    },
    milestoneResourceText(rift, milestone) {
      return `${this.formatRift(rift.config.percentageToFill(milestone.requirement))} ${rift.drainResource}`;
    },
    // One-off formatting function; needs to format large Decimals and a small number assumed to be a percentage
    formatRift(value) {
      return typeof value === "number" ? formatPercents(value, 3) : format(value, 2);
    },
    barOverlay() {
      const overfill = this.percentage > 1;
      return {
        "o-pelle-rift-bar-permanent": !overfill && this.hasEffectiveFill,
        "o-pelle-rift-bar-overfilled": overfill,
      };
    },
    handleMilestoneRequirementTooltipDisplay(event) {
      const mouseX = event.clientX - this.$refs.pelleRiftBar.getBoundingClientRect().x;

      const milestonesCloseTo = this.rift.milestones.filter(m => {
        // Gets distance from the milestone bar in terms of rem
        // 19.6: the width of the bar is 20 rem, but adjusted to a border with 0.2rem on both sides
        let dist = Math.abs((m.requirement*19.6) - mouseX/this.remToPx);
        if (dist < 1) m.dist = dist;
        return dist < 1;
      }).map(m => {
        let dist = m.dist;
        delete m.dist;
        // Temporarily store the distance without recalculation to sort the list by distance
        // and get the closest item
        return {dist, m};
      });

      if (!milestonesCloseTo.length)
        return;
      this.selectedHoverMilestone = milestonesCloseTo.sort((a, b) => a.dist - b.dist)[0].m;
    }
  },
};
</script>

<template>
  <div class="c-pelle-rift">
    <h2>{{ rift.name }}</h2>
    <div class="c-pelle-rift-bar" ref="pelleRiftBar" @mousemove="handleMilestoneRequirementTooltipDisplay">
      <div class="o-pelle-rift-bar-percentage">
        {{ formatPercents(percentage, 3) }}
      </div>
      <div
        class="o-pelle-rift-bar-fill"
        :style="{
          width: `${Math.clampMax(percentage * 100, 100)}%`,
        }"
      />
      <div
        class="o-pelle-rift-bar-overlay"
      />
      <!-- Note: These are separate because permanent and animated fill both use the same positional attributes -->
      <div :class="barOverlay()" />
      <div
        v-if="isActive && !isMaxed"
        class="o-pelle-rift-bar-active-fill"
      />
      <div
        v-tooltip="milestoneResourceText(rift, selectedHoverMilestone)"
        class="o-pelle-rift-bar-milestone-hover-area"
        :style="{
          left: `calc(${selectedHoverMilestone.requirement * 100}% - 0.1rem)`
        }"
      >
      </div>
      <div
        v-for="(milestone, idx) in rift.milestones"
        :key="'milestone-line-' + idx" class="o-pelle-rift-bar-milestone-line"
        :class="{ 'o-pelle-rift-bar-milestone-line--unlocked': hasMilestone(idx) }"
        :style="{
          left: `calc(${milestone.requirement * 100}% - 0.2rem)`,
        }"
      />
    </div>
    <div class="o-pelle-rift-milestone-container">
      <div
        v-for="(milestone, idx) in rift.milestones"
        :key="'milestone-' + idx"
        v-tooltip="milestone.description()"
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

.c-pelle-rift-bar {
  height: 5rem;
  border: 0.2rem solid var(--color-pelle-secondary);
  width: 20rem;
  border-radius: 5px;
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1e1e1e;
}

.o-pelle-rift-bar-percentage {
  font-size: 1.5rem;
  color: white;
  text-shadow: 1px 1px 2px var(--color-pelle--base);
  z-index: 4;
}

.o-pelle-rift-bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  background: var(--color-pelle-secondary);
  z-index: 1;
}
.o-pelle-rift-bar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  box-shadow: inset 0 0 3px 1px #1e1e1e;
}

.o-pelle-rift-bar-permanent {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  filter: brightness(50%);
  background: var(--color-pelle-secondary);
  z-index: 0;
}

@keyframes sweep {
  0% { left: 0; width: 0; }
  10% { left: 0; width: 2rem; }
  90% { left: calc(100% - 2rem); width: 2rem;  }
  100% { left: 100%; width: 0; }
}

.o-pelle-rift-bar-active-fill {
  position: absolute;
  height: 100%;
  background: var(--color-pelle--base);
  z-index: 1;
  opacity: 0.3;
  animation: sweep infinite 2s linear;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0.7rem 1rem var(--color-pelle--base); }
  50% { box-shadow: 0 0 1.5rem 0 var(--color-pelle--base); }
  100% { box-shadow: 0 0 0.7rem 1rem var(--color-pelle--base); }
}

.o-pelle-rift-bar-overfilled {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--color-pelle--base);
  opacity: 0.3;
  animation: pulse infinite 1s linear;
}

.o-pelle-rift-bar-milestone-hover-area {
  position: absolute;
  width: 2rem;
  height: 100%;
  top: 0;
  transform: translateX(-50%);
  z-index: 5;
}

.o-pelle-rift-bar-milestone-line {
  position: absolute;
  width: 0.2rem;
  height: 100%;
  background: var(--color-pelle--base);
  z-index: 3;
  opacity: 0.5;
}
.o-pelle-rift-bar-milestone-line--unlocked {
  opacity: 1;
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
  text-shadow: 1px 1px 2px black;
  padding: 0.2rem;
}
</style>
