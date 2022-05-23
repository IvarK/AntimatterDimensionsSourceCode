<script>
import CustomizeableTooltip from "@/components/CustomizeableTooltip";

export default {
  name: "PelleRiftBar",
  components: {
    CustomizeableTooltip
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
      percentage: 0,
      reducedTo: 0,
      hasEffectiveFill: false,
      selectedHoverMilestone: this.rift.milestones[0],
      // Converts 1 rem to number of px
      remToPx: parseInt(getComputedStyle(document.documentElement).fontSize, 10),
      effects: [],
      isDark: false
    };
  },
  computed: {
    tooltipContentStyle() {
      const hasMilestone = this.hasMilestone(this.selectedHoverMilestone);
      const baseColor = this.isDark ? "#111111" : "var(--color-base)";
      return {
        width: "20rem",
        border: "0.1rem solid var(--color-pelle--base)",
        backgroundColor: hasMilestone ? "var(--color-pelle--base)" : baseColor,
        color: hasMilestone ? "black" : "var(--color-text)",
        fontSize: "1.1rem",
        fontWeight: "bold",
        zIndex: 4,
        boxShadow: hasMilestone ? " 0 0 0.1rem 0.1rem black" : ""
      };
    },
    tooltipArrowStyle() {
      return {
        borderTop: "0.55rem solid var(--color-pelle--base)"
      };
    }
  },
  created() {
    this.isDark = Themes.find(player.options.theme).isDark();
  },
  methods: {
    update() {
      const rift = this.rift;
      this.effects = rift.effects;
      this.isActive = rift.isActive;
      this.isMaxed = rift.isMaxed || Pelle.hasGalaxyGenerator;
      this.percentage = rift.percentage;
      this.reducedTo = rift.reducedTo;
      this.hasEffectiveFill = rift.config.key === "pestilence" && PelleRifts.chaos.milestones[0].canBeApplied;
    },
    hasMilestone(ms) {
      return ms.canBeApplied;
    },
    milestoneResourceText(rift, milestone) {
      return `${formatPercents(milestone.requirement)}
      (${this.formatRift(rift.config.percentageToFill(milestone.requirement))} ${rift.drainResource})`;
    },
    milestoneDescriptionText(milestone) {
      return milestone.description;
    },
    // One-off formatting function; needs to format large Decimals and a small number assumed to be a percentage
    formatRift(value) {
      return typeof value === "number" ? formatPercents(value, 3) : format(value, 2);
    },
    toggle() {
      if (!this.isMaxed) this.rift.toggle();
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
        // 31.6: the width of the bar is 32 rem, but adjusted to a border with 0.2rem on both sides
        const dist = Math.abs((m.requirement * 31.6) - mouseX / this.remToPx);
        if (dist < 1) m.dist = dist;
        return dist < 1;
      }).map(m => {
        const dist = m.dist;
        delete m.dist;
        // Temporarily store the distance without recalculation to sort the list by distance
        // and get the closest item
        return { dist, m };
      });

      if (milestonesCloseTo.length) {
        this.selectedHoverMilestone = milestonesCloseTo.sort((a, b) => a.dist - b.dist)[0].m;
      }
    }
  }
};
</script>

<template>
  <div
    ref="pelleRiftBar"
    class="c-pelle-rift-bar"
    :class="{
      'c-pelle-rift-bar-overfill-container': percentage > 1,
      'c-pelle-rift-bar--idle': !isActive && !isMaxed,
      'c-pelle-rift-bar--filling': isActive
    }"
    @mousemove="handleMilestoneRequirementTooltipDisplay"
    @click="toggle"
  >
    <div class="l-overflow-hidden">
      <!-- Note: These are separate because permanent and animated fill both use the same positional attributes -->
      <div :class="barOverlay()" />
      <div
        class="o-pelle-rift-bar-fill"
        :style="{
          width: `${Math.clampMax(percentage * 100, 100)}%`,
        }"
      />
      <div
        v-if="reducedTo < 1"
        class="o-pelle-rift-bar-reducedto"
        :style="{
          width: `${Math.clampMax(100 - reducedTo * 100, 100)}%`,
        }"
      />
      <!-- This bar overlay adds the shadow within the bar so the ugly edges don't show -->
      <div
        class="o-pelle-rift-bar-overlay"
      />
      <div
        v-if="isActive && !isMaxed"
        class="o-pelle-rift-bar-active-fill"
      />
      <div
        v-for="(milestone, idx) in rift.milestones"
        :key="'milestone-line-' + idx"
        class="o-pelle-rift-bar-milestone-line"
        :class="{
          'o-pelle-rift-bar-milestone-line--unlocked': hasMilestone(milestone),
          'o-pelle-rift-bar-milestone-line--disabled': reducedTo < milestone.requirement
        }"
        :style="{
          left: `calc(${milestone.requirement * 100}% - 0.25rem)`
        }"
      />
    </div>
    <div class="o-pelle-rift-bar-percentage">
      {{ formatPercents(percentage, 3) }}
      <span v-if="!isMaxed">({{ isActive ? "Filling" : "Idle" }})</span>
    </div>
    <CustomizeableTooltip
      class="o-pelle-rift-bar-milestone-hover-container"
      :tooltip-content-style="tooltipContentStyle"
      :tooltip-arrow-style="tooltipArrowStyle"
      :left="`calc(${selectedHoverMilestone.requirement * 100}% - 0.1rem)`"
      content-class="o-pelle-rift-bar-milestone-hover-area"
    >
      <template #tooltipContent>
        {{ milestoneResourceText(rift, selectedHoverMilestone) }}
        <br>
        <br>
        {{ milestoneDescriptionText(selectedHoverMilestone) }}
      </template>
    </CustomizeableTooltip>
  </div>
</template>

<style scoped>
@keyframes a-pelle-bar-overfill-pulse {
  /* #ed143d66 is the base pelle colour except transparent. */
  0% { box-shadow: 0 0 0.7rem 1rem rgba(237, 20, 61, 40%); }
  50% { box-shadow: 0 0 1.5rem 0 rgba(237, 20, 61, 40%); }
  100% { box-shadow: 0 0 0.7rem 1rem rgba(237, 20, 61, 40%); }
}

@keyframes a-pelle-bar-overfill-pulse-but-green {
  0% { box-shadow: 0 0 0.7rem 1rem rgba(124, 183, 39, 53.3%); }
  50% { box-shadow: 0 0 1.5rem 0 rgba(124, 183, 39, 53.3%); }
  100% { box-shadow: 0 0 0.7rem 1rem rgba(124, 183, 39, 53.3%); }
}

/* ACTIVE RIFT FILLING STYLES */
@keyframes a-pelle-bar-filling-sweep {
  0% {
    width: 0;
    left: 0;
  }

  10% {
    width: 2rem;
    left: 0;
  }

  90% {
    width: 2rem;
    left: calc(100% - 2rem);
  }

  100% {
    width: 0;
    left: 100%;
  }
}

@keyframes a-pelle-bar-unfinished-milestone-flash {
  0% { opacity: 1; }
  20% { opacity: 1; }
  50% { opacity: 0.3; }
  80% { opacity: 1; }
  100% { opacity: 1; }
}

/* CONTAINER STYLES */

.c-pelle-rift-bar {
  --color-bar-bg: #1e1e1e;
  display: flex;
  width: 32rem;
  height: 5rem;
  position: relative;
  justify-content: center;
  align-items: center;
  background: var(--color-bar-bg);
  border: var(--var-border-width, 0.2rem) solid var(--color-pelle--secondary);
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1rem;
}

.c-pelle-rift-bar--filling,
.c-pelle-rift-bar--idle {
  cursor: pointer;
  transition: box-shadow 0.5s;
}

.c-pelle-rift-bar--filling:hover,
.c-pelle-rift-bar--idle:hover {
  box-shadow: 0 0 2rem var(--color-pelle--secondary);
}

.l-overflow-hidden {
  overflow: hidden;
  width: 32rem;
  height: 5rem;
  position: absolute;
  top: -0.2rem;
  left: -0.2rem;
  z-index: 0;
  border: var(--var-border-width, 0.16rem) solid transparent;
  border-radius: var(--var-border-radius, 0.5rem);
}

.o-pelle-rift-bar-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 0;
  box-shadow: inset 0 0 0.3rem 0.1rem var(--color-bar-bg);
}

.c-pelle-rift-bar--filling .o-pelle-rift-bar-overlay {
  box-shadow: inset 0 0 0.3rem 0.1rem var(--color-pelle--secondary);
}

/* FILLING STYLES */
.o-pelle-rift-bar-fill {
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 0;
  opacity: 0.7;
  background: var(--color-pelle--secondary);
}

.o-pelle-rift-bar-reducedto {
  height: 100%;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: var(--color-pelle--base);
  filter: brightness(0.5);
}

/* SPECIAL BAR OVERLAY STYLES */
.o-pelle-rift-bar-permanent {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 0;
  background: var(--color-pelle--secondary);
  filter: brightness(50%);
}

.o-pelle-rift-bar-overfilled {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  opacity: 0.5;
  background: var(--color-pelle--base);
}

.c-pelle-rift-bar-overfill-container {
  animation: a-pelle-bar-overfill-pulse 1s infinite linear;
}

.t-s1 .c-pelle-rift-bar-overfill-container {
  animation: a-pelle-bar-overfill-pulse-but-green 1s infinite linear;
}

.o-pelle-rift-bar-active-fill {
  height: 100%;
  position: absolute;
  z-index: 1;
  opacity: 0.3;
  background: var(--color-pelle--base);
  animation: a-pelle-bar-filling-sweep infinite 2s linear;
}

/* PERCENTAGE STYLES */
.o-pelle-rift-bar-percentage {
  z-index: 2;
  font-size: 1.5rem;
  color: white;
  text-shadow: 0.1rem 0.1rem 0.2rem var(--color-pelle--base);

  /* This keeps the percentage from blocking the hover area */
  pointer-events: none;
}

.c-pelle-rift-bar--idle .l-overflow-hidden,
.c-pelle-rift-bar--idle .o-pelle-rift-bar-percentage {
  opacity: 0.6;
}

/* MILESTONE STYLES */
.o-pelle-rift-bar-milestone-hover-container {
  height: 100%;
}

.o-pelle-rift-bar-milestone-line {
  width: 0.25rem;
  height: 100%;
  position: absolute;
  z-index: 1;
  background: var(--color-pelle--base);
  animation: a-pelle-bar-unfinished-milestone-flash infinite 1s linear;
}

.o-pelle-rift-bar-milestone-line--unlocked {
  animation: none;
}

.o-pelle-rift-bar-milestone-line--disabled {
  filter: brightness(0.25);
  animation: none;
}
</style>

<style>
.o-pelle-rift-bar-milestone-hover-area {
  width: 2rem;
  height: 100%;
}
</style>
