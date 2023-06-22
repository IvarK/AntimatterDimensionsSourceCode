<script>
import HintText from "@/components/HintText";

export default {
  name: "EternityChallengeBoxWrapper",
  components: {
    HintText
  },
  props: {
    name: {
      type: String,
      required: true
    },
    isUnlocked: {
      type: Boolean,
      required: true
    },
    isRunning: {
      type: Boolean,
      required: true
    },
    isCompleted: {
      type: Boolean,
      required: true
    },
    canBeUnlocked: {
      type: Boolean,
      required: true
    },
    completionCount: {
      type: Number,
      required: true
    },
    overrideLabel: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      challengeId: Number,
    };
  },
  computed: {
    buttonClassObject() {
      const challengeDone = this.isCompleted && !this.isUnlocked;
      const challengeRedo = this.isCompleted && this.isUnlocked && !this.isRunning;
      const challengeUnlock = this.isUnlocked || this.canBeUnlocked;
      const challengeLocked = !this.isCompleted && !this.isUnlocked && !this.isRunning && !this.canBeUnlocked;
      // ECs can be not unlocked and also not locked, because they're fully completed,
      // but in that case you can't enter them and so it's important to give them a property
      // that disables cursor on hover. The same thing happens if it is running.
      const challengeClickable = !this.isRunning && ((!this.isCompleted && this.canBeUnlocked) || this.isUnlocked);
      return {
        "o-challenge-btn": true,
        "o-challenge-btn--running": this.isRunning,
        "o-challenge-btn--completed": challengeDone,
        "o-challenge-btn--redo": challengeRedo,
        "o-challenge-btn--unlocked": !challengeDone && challengeUnlock,
        "o-challenge-btn--locked": challengeLocked,
        "o-challenge-btn--unenterable": !challengeClickable,
      };
    },
    // Width and height attributes are copied from o-challenge-btn
    completionOverlay() {
      return {
        position: "absolute",
        width: `${15 * Math.clampMax(this.completionCount / 5, 1)}rem`,
        height: "3rem",
        background: "var(--color-good)",
        opacity: this.completionCount >= 5 ? 0 : 0.3,
        "border-top-left-radius": "var(--var-border-radius, 1rem)",
        "border-bottom-left-radius": "var(--var-border-radius, 1rem)",
        "pointer-events": "none",
      };
    },
    buttonText() {
      if (this.overrideLabel.length) return this.overrideLabel;
      if (this.isRunning) return "Running";
      if (this.isCompleted) {
        if (this.isUnlocked) return "Redo";
        return "Completed";
      }
      if (this.isUnlocked) return "Start";
      if (this.canBeUnlocked) return "Unlock";
      return "Locked";
    }
  }
};
</script>

<template>
  <div class="c-challenge-box l-challenge-box c-challenge-box--eternity">
    <HintText
      type="challenges"
      class="l-hint-text--challenge"
    >
      {{ name }}
    </HintText>
    <slot name="top" />
    <div class="l-challenge-box__fill" />
    <div>
      <div :style="completionOverlay" />
      <button
        :class="buttonClassObject"
        @click="$emit('start')"
      >
        {{ buttonText }}
      </button>
    </div>
    <slot name="bottom" />
  </div>
</template>

<style scoped>

</style>
