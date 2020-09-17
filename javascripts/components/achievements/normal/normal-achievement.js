"use strict";

Vue.component("normal-achievement", {
  props: {
    achievement: Object
  },
  data() {
    return {
      isUnlocked: false,
      isMouseOver: false,
      mouseOverInterval: 0,
      isCancer: false,
      row: 0,
      showUnlockState: false
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    styleObject() {
      return {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--locked": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--waiting": !this.isUnlocked && PlayerProgress.realityUnlocked() && this.row <= 13,
        "o-achievement--blink": this.id === 78 && !this.isUnlocked,
        "o-achievement--normal": !this.isCancer,
        "o-achievement--cancer": this.isCancer
      };
    },
    indicator() {
      const achievement = this.achievement;
      if (achievement.isUnlocked) return "<i class='fas fa-check'></i>";
      if (PlayerProgress.realityUnlocked() && achievement.row <= 13) return "<i class='far fa-clock'></i>";
      return "<i class='fas fa-times'></i>";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--locked": !this.isUnlocked && (!PlayerProgress.realityUnlocked() || this.row > 13),
        "o-achievement__indicator--waiting": !this.isUnlocked && PlayerProgress.realityUnlocked() && this.row <= 13,
      };
    },
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.isCancer = Theme.current().name === "S4" || player.secretUnlocks.cancerAchievements;
      this.row = this.achievement.row;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 500);
    },
    getTooltip() {
      return this.achievement.config.tooltip;
    }
  },
  template:
    `<div
      :class="classObject"
      :style="styleObject"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <hint-text type="achievements" class="l-hint-text--achievement">{{id}}</hint-text>
      <div class="o-achievement__tooltip">
        <div class="o-achievement__tooltip__name">{{ this.achievement.config.name }} ({{ id }})</div>
        <div class="o-achievement__tooltip__description">{{ this.achievement.config.description }}</div>
        <div v-if="this.achievement.config.reward" class="o-achievement__tooltip__reward">
          Reward: {{ this.achievement.config.reward }}
        </div>
      </div>
      <div v-if="showUnlockState" :class="indicatorClassObject" v-html="indicator"></div>
     </div>`
});
