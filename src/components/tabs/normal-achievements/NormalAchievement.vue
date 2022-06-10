<script>
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";

export default {
  name: "NormalAchievement",
  components: {
    EffectDisplay,
    HintText
  },
  props: {
    achievement: {
      type: Object,
      required: true
    },
    isObscured: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isDisabled: false,
      isUnlocked: false,
      isMouseOver: false,
      isCancer: false,
      showUnlockState: false,
      realityUnlocked: false,
      textTimer: 0,
      garbledText: "",
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    displayId() {
      return this.config.displayId ?? this.id;
    },
    config() {
      return this.achievement.config;
    },
    styleObject() {
      return {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--disabled": this.isDisabled,
        "o-achievement--locked": !this.isUnlocked && !this.isDisabled,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--waiting": !this.isUnlocked && this.isPreRealityAchievement && !this.isDisabled,
        "o-achievement--blink": !this.isUnlocked && this.id === 78 && !this.isDisabled,
        "o-achievement--normal": !this.isCancer,
        "o-achievement--cancer": this.isCancer,
        "c-blurred": this.isObscured,
      };
    },
    indicatorIconClass() {
      if (this.isUnlocked) return "fas fa-check";
      if (this.isPreRealityAchievement && !this.isDisabled) return "far fa-clock";
      return "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--disabled": this.isDisabled,
        "o-achievement__indicator--locked": !this.isUnlocked && !this.isPreRealityAchievement && !this.isDisabled,
        "o-achievement__indicator--waiting": !this.isUnlocked && this.isPreRealityAchievement && !this.isDisabled,
      };
    },
    isPreRealityAchievement() {
      return this.realityUnlocked && this.achievement.row <= 13;
    }
  },
  beforeDestroy() {
    clearTimeout(this.mouseOverInterval);
  },
  methods: {
    update() {
      this.isDisabled = Pelle.disabledAchievements.includes(this.id) && Pelle.isDoomed;
      this.isUnlocked = this.achievement.isUnlocked && !this.isDisabled;
      this.isCancer = Theme.current().name === "S4" || player.secretUnlocks.cancerAchievements;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
      this.realityUnlocked = PlayerProgress.realityUnlocked();
      if (this.isObscured) {
        this.textTimer++;
        this.garbledText = "";
        // JS doesn't let you directly seed the built-in RNG, so we write something that *looks* like randomness
        const state = this.displayId + 35 * Math.floor(this.textTimer / 30);
        for (let l = 0; l < 45; l++) {
          // 32 to 126 is the range of all printable non-space ASCII characters
          this.garbledText += String.fromCharCode(Math.floor(32 + ((state + l * l) % 95)));
          if (l % 10 === 0) this.garbledText += "\n";
        }
      }
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 300);
    },
  }
};
</script>

<template>
  <div
    :class="classObject"
    :style="styleObject"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <HintText
      type="achievements"
      class="l-hint-text--achievement"
    >
      {{ displayId }}
    </HintText>
    <div class="o-achievement__tooltip">
      <template v-if="isMouseOver">
        <div v-if="isObscured">
          {{ garbledText }}
        </div>
        <div v-else>
          <div class="o-achievement__tooltip__name">
            {{ config.name }} ({{ displayId }})
          </div>
          <div class="o-achievement__tooltip__description">
            {{ config.description }}
          </div>
          <div
            v-if="config.reward"
            class="o-achievement__tooltip__reward"
          >
            <span :class="{ 'o-pelle-disabled': isDisabled }">
              Reward: {{ config.reward }}
              <EffectDisplay
                v-if="config.formatEffect"
                br
                :config="config"
              />
            </span>
          </div>
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

<style scoped>
.c-blurred {
  filter: blur(0.35rem);
  z-index: 1;
}
</style>
