"use strict";

Vue.component("secret-achievement", {
  props: {
    row: Number,
    column: Number
  },
  data() {
    return {
      isUnlocked: false,
      showUnlockState: false
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
        return { "background-position": `-${(this.column - 1) * 104}px -${(this.row - 1) * 104}px` };
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
  created() {
    this.on$(GAME_EVENT.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.updateState();
  },
  methods: {
    updateState() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
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
      @click="onClick">
      <hint-text type="achievements" class="l-hint-text--achievement">S{{row}}{{column}}</hint-text>
      <div class="o-achievement__tooltip">
        <div class="o-achievement__tooltip__name">{{ this.achievement.config.name }} ({{ achId }})</div>
        <div v-if="this.isUnlocked" class="o-achievement__tooltip__description">
          {{ this.achievement.config.description }}
        </div>
      </div>
      <div v-if="showUnlockState" :class="indicatorClassObject" v-html="indicator"></div>
     </div>`
});
