"use strict";

Vue.component("ra-upgrade-icon", {
  props: {
    unlock: Object,
  },
  data() {
    return {
      isUnlocked: false,
      level: 0,
      icon: "",
      description: "",
    };
  },
  computed: {
    update() {
      this.isUnlocked = Ra.has(this.unlock);
      this.level = this.unlock.level;
      this.icon = this.unlock.displayIcon;
      this.description = `Level ${this.level}: ${this.unlock.reward}`;
    },
    classObject() {
      return {
        "c-ra-upgrade-icon": true,
        "c-ra-upgrade-icon--inactive": !this.isUnlocked,
      };
    }
  },
  template: `
    <div
      v-html="icon"
      :ach-tooltip="description"
      :class="classObject">
    </div>
  `
});
