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
      const rewardText = typeof this.unlock.reward === "function"
        ? this.unlock.reward()
        : this.unlock.reward;
      this.description = `Level ${this.level}: ${rewardText}`;
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
