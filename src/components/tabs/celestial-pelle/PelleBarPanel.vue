<script>
import PelleRift from "./PelleRift";

export default {
  name: "PelleBarPanel",
  components: {
    PelleRift
  },
  data() {
    return {
      decayRate: 0,
      isCollapsed: false,
      strikes: []
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    }
  },
  methods: {
    update() {
      this.decayRate = Pelle.riftDrainPercent;
      this.isCollapsed = player.celestials.pelle.collapsed.rifts;
      this.strikes = PelleStrikes.all.filter(s => s.hasStrike);
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.rifts = !this.isCollapsed;
    },
    // The rift objects don't normally overlap except for the ExpandingControlBox elements; these expand downward
    // and would possibly render underneath rifts farther down the page. Assigning a z-index at this point in the
    // hierarchy enforces the correct stacking context structure to make sure that the ExpandingControlBox elements
    // render with proper layering
    styleObject(index) {
      return {
        "z-index": 6 - index,
      };
    },
  }
};
</script>

<template>
  <div class="l-pelle-panel-container">
    <div class="c-pelle-panel-title">
      <i
        :class="collapseIcon"
        class="c-collapse-icon-clickable"
        @click="toggleCollapse"
      />
      Pelle Strikes and Rifts
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      Rifts can be activated by clicking on their bars.
      <span v-if="strikes.length > 1">You cannot activate more than two Rifts at once.</span>
      <br v-else>
      When active, Rifts consume {{ formatPercents(decayRate) }} of another resource per second.
      <br>
      Rift effects apply even when not activated, and are based on the total amount drained.
      <div class="c-pelle-bar-container">
        <div
          v-for="(strike, index) in strikes"
          :key="index"
          class="c-pelle-single-bar"
          :style="styleObject(index)"
        >
          <PelleRift :strike="strike" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-collapse-icon-clickable {
  position: absolute;
  top: 50%;
  left: 1.5rem;
  width: 3rem;
  align-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}

.c-pelle-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.c-pelle-single-bar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
