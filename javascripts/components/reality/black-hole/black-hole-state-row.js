"use strict";

Vue.component("black-hole-state-row", {
  props: {
    blackHole: Object
  },
  data() {
    return {
      isUnlocked: false,
      isPermanent: false,
      isActive: false,
      isCharged: false,
      statePercent: 0,
      nextChange: 0,
    };
  },
  computed: {
    id() {
      return this.blackHole.id;
    }
  },
  methods: {
    update() {
      const { blackHole } = this;
      this.isUnlocked = blackHole.isUnlocked;
      if (!this.isUnlocked) return;
      this.isPermanent = blackHole.isPermanent;
      this.isActive = blackHole.isActive;
      this.isCharged = blackHole.isCharged;
      this.statePercent = blackHole.stateProgress;
      this.nextChange = blackHole.timeToNextStateChange;
    }
  },
  template: `
    <h3 v-if="isUnlocked">
      Black hole {{ id }}
      <template v-if="!isPermanent && isCharged">
        (☀{{ format(100 * statePercent, 1, 1) }}%)
      </template>
      <template v-else-if="!isPermanent && !isCharged">
        (⇑{{ format(100 * statePercent, 1, 1) }}%)
      </template>
      <template v-if="isPermanent">
        is active permanently.
      </template>
      <template v-else-if="isActive">
        is active for {{ nextChange.toFixed(1) }} more seconds.
      </template>
      <template v-else>
        will activate in {{ nextChange.toFixed(1) }} seconds.
      </template>
    </h3>
  `
});