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
      duration: 0,
      interval: 0,
      phase: 0
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
      this.duration = blackHole.duration;
      this.interval = blackHole.interval;
      this.phase = blackHole.phase;
    }
  },
  template: `
    <h3 v-if="isUnlocked">
      Black hole {{ id }}
      <template v-if="isPermanent">
        is active permanently.
      </template>
      <template v-else-if="isActive">
        is active for {{ (duration - phase).toFixed(1) }} more seconds.
      </template>
      <template v-else-if="isCharged">
        will activate with black hole {{ id - 1 }} (for {{ Math.max(0, duration - phase).toFixed(1) }} sec)
      </template>
      <template v-else>
        will activate in {{ (interval - phase).toFixed(1) }} seconds.
      </template>
    </h3>
  `
});