<script>
import HintText from "@/components/HintText";

export default {
  name: "SecretAchievement",
  components: {
    HintText
  },
  props: {
    achievement: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isMouseOver: false,
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
      if (!this.isUnlocked) return undefined;
      return {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--hidden": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--secret": true
      };
    },
    indicatorIconClass() {
      return this.isUnlocked ? "fas fa-check" : "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--locked": !this.isUnlocked
      };
    },
  },
  beforeDestroy() {
    clearTimeout(this.mouseOverInterval);
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
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 300);
    },
    onClick() {
      if (this.id === 11) {
        SecretAchievement(11).unlock();
      }
    }
  }
};
</script>

<template>
  <div
    :class="classObject"
    :style="styleObject"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <HintText
      type="achievements"
      class="l-hint-text--achievement"
    >
      S{{ id }}
    </HintText>
    <div class="o-achievement__tooltip">
      <template v-if="isMouseOver">
        <div class="o-achievement__tooltip__name">
          {{ config.name }} (S{{ id }})
        </div>
        <div
          v-if="isUnlocked"
          class="o-achievement__tooltip__description"
        >
          {{ config.description }}
        </div>
      </template>
    </div>
    <div
      v-if="showUnlockState"
      :class="indicatorClassObject"
    >
      <i :class="indicatorIconClass" />
    </div>
  </div>
</template>
