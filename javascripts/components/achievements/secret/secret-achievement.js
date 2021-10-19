"use strict";

Vue.component("secret-achievement", {
  props: {
    achievement: Object
  },
  data() {
    return {
      isUnlocked: false,
      showUnlockState: false
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    config() {
      return this.achievement.config;
    },
    styleObject() {
      return this.isUnlocked ? {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      }
        : {};
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--hidden": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--secret": true
      };
    },
    indicator() {
      const achievement = this.achievement;
      if (achievement.isUnlocked) return "<i class='fas fa-check'></i>";
      return "<i class='fas fa-times'></i>";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--secret": !this.isUnlocked
      };
    },
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 500);
    },
    onClick() {
      if (this.id === 11 && !this.isUnlocked) {
        SecretAchievement(11).unlock();
      }
    }
  },
  template: `
    <div
      :class="classObject"
      :style="styleObject"
      @click="onClick"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <hint-text type="achievements" class="l-hint-text--achievement">
        S{{ id }}
      </hint-text>
      <div class="o-achievement__tooltip">
        <div class="o-achievement__tooltip__name">
          {{ config.name }} (S{{ id }})
        </div>
        <div v-if="isUnlocked" class="o-achievement__tooltip__description">
          {{ config.description }}
        </div>
      </div>
      <div v-if="showUnlockState" :class="indicatorClassObject" v-html="indicator"></div>
    </div>`
});
