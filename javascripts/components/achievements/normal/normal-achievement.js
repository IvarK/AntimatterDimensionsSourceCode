import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";

Vue.component("normal-achievement", {
  components: {
    EffectDisplay,
    HintText
  },
  props: {
    /** @type AchievementState */
    achievement: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isUnlocked: false,
      isMouseOver: false,
      isCancer: false,
      showUnlockState: false,
      realityUnlocked: false
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
      return {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--locked": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--waiting": !this.isUnlocked && this.isPreRealityAchievement,
        "o-achievement--blink": !this.isUnlocked && this.id === 78,
        "o-achievement--normal": !this.isCancer,
        "o-achievement--cancer": this.isCancer
      };
    },
    indicatorIconClass() {
      if (this.isUnlocked) return "fas fa-check";
      if (this.isPreRealityAchievement) return "far fa-clock";
      return "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--locked": !this.isUnlocked && !this.isPreRealityAchievement,
        "o-achievement__indicator--waiting": !this.isUnlocked && this.isPreRealityAchievement,
      };
    },
    isPreRealityAchievement() {
      return this.realityUnlocked && this.achievement.row <= 13;
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.isCancer = Theme.current().name === "S4" || player.secretUnlocks.cancerAchievements;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
      this.realityUnlocked = PlayerProgress.realityUnlocked();
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 300);
    }
  },
  beforeDestroy() {
    clearTimeout(this.mouseOverInterval);
  },
  template: `
    <div
      :class="classObject"
      :style="styleObject"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <HintText type="achievements" class="l-hint-text--achievement">
        {{ id }}
      </HintText>
      <div class="o-achievement__tooltip">
        <template v-if="isMouseOver">
          <div class="o-achievement__tooltip__name">
            {{ config.name }} ({{ id }})
          </div>
          <div class="o-achievement__tooltip__description">
            {{ config.description }}
          </div>
          <div v-if="config.reward" class="o-achievement__tooltip__reward">
            Reward: {{ config.reward }}
            <EffectDisplay
              br
              v-if="config.formatEffect"
              :config="config"
            />
          </div>
        </template>
      </div>
      <div v-if="showUnlockState" :class="indicatorClassObject">
        <i :class="indicatorIconClass" />
      </div>
    </div>`
});
