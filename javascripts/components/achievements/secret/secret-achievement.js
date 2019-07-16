"use strict";

Vue.component("secret-achievement", {
  props: {
    row: Number,
    column: Number
  },
  data() {
    return {
      isUnlocked: false,
    };
  },
  computed: {
    achId() {
      return this.row * 10 + this.column;
    },
    achievement() {
      return SecretAchievement(this.achId);
    },
    styleObject() {
      if (this.isUnlocked) {
        return { "background-position": `-${(this.column - 1) * 104}px -${3120 + (this.row - 1) * 104}px` };
      }
      return {};
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--hidden": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--secret": true
      };
    },
    tooltip() {
      const config = this.achievement.config;
      return this.isUnlocked ? config.tooltip : config.name;
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.updateState();
  },
  methods: {
    updateState() {
      this.isUnlocked = this.achievement.isUnlocked;
    },
    onClick() {
      if (this.achId === 11 && !this.isUnlocked) {
        SecretAchievement(11).unlock();
      }
    }
  },
  template:
    `<div
      :class="classObject"
      :style="styleObject"
      :ach-tooltip="tooltip"
      @click="onClick">
      <br>
     </div>`
});
