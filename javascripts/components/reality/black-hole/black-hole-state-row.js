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
      nextChange: "",
      state: "",
    };
  },
  computed: {
    description() {
      return this.blackHole.description(true);
    },
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
      this.nextChange = TimeSpan.fromSeconds(blackHole.timeToNextStateChange).toStringShort();
      this.state = blackHole.displayState;
    }
  },
  template: `
    <h3 v-if="isUnlocked">
      {{ description }}
      <template v-if="isPermanent">
        is active permanently.
      </template>
      <template v-else-if="isActive">
        is active for the next {{ nextChange }}.
      </template>
      <template v-else>
        will activate in {{ nextChange }}.
      </template>
    </h3>
  `
});