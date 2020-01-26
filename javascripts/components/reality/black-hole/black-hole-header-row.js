"use strict";

Vue.component("black-hole-header-row", {
  props: {
    blackHole: Object
  },
  data() {
    return {
      isUnlocked: false,
      state: "",
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
      this.state = blackHole.displayState;
    }
  },
  template: `
    <span v-if="isUnlocked">
     🌀{{ id }}:{{ state }}
    </span>
  `
});