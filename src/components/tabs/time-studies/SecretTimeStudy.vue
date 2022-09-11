<script>
export default {
  name: "SecretTimeStudy",
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isVisible: player.secretUnlocks.viewSecretTS,
      isEnslaved: false,
    };
  },
  computed: {
    enslavedTT: () => 100,
    description() {
      return this.isEnslaved
        ? "... you ... have great potential ..."
        : "Unlock a Secret Achievement";
    },
    hide() {
      return this.isEnslaved ? "" : "(Double click to hide)";
    },
    cost() {
      return this.isEnslaved ? -this.enslavedTT : 0;
    },
    styleObject() {
      return {
        top: `${this.setup.top}rem`,
        left: `${this.setup.left}rem`
      };
    },
    classObject() {
      return {
        "l-time-study": true,
        "o-time-study": true,
        "o-time-study--bought": true,
        "o-time-study-normal": true,
        "o-time-study-normal--bought": true,
        "o-time-study--secret": !this.isEnslaved && !this.isVisible,
        "o-time-study--secret-enslaved": this.isEnslaved && !this.isVisible,
        "o-time-study--secret-unlocked": this.isVisible,
        "o-time-study--secret-enslaved-unlocked": this.isEnslaved && this.isVisible,
      };
    }
  },
  methods: {
    update() {
      this.isVisible = player.secretUnlocks.viewSecretTS;
      this.isEnslaved = Enslaved.isRunning;
    },
    handleClick() {
      if (this.isEnslaved && !this.isVisible) {
        // If you're in Nameless and haven't gotten the secret study
        player.secretUnlocks.viewSecretTS = true;
        EnslavedProgress.secretStudy.giveProgress();
        Currency.timeTheorems.add(this.enslavedTT);
      } else if (!this.isEnslaved && this.isVisible) {
        // If you aren't in Nameless, double clicking will hide the study
        const clickTime = Date.now();
        if (clickTime - ui.lastClickTime < 750) {
          ui.lastClickTime = 0;
          player.secretUnlocks.viewSecretTS = false;
        } else {
          ui.lastClickTime = clickTime;
        }
      } else {
        // If you aren't in Nameless and it isn't visible, show it and give the achievement
        ui.lastClickTime = 0;
        if (!player.secretUnlocks.viewSecretTS) {
          player.secretUnlocks.viewSecretTS = true;
          this.$refs.study.addEventListener("transitionend", function achGiver(e) {
            SecretAchievement(21).unlock();
            e.target.removeEventListener(e.type, achGiver);
          });
        }
      }
    },
  }
};
</script>

<template>
  <button
    ref="study"
    :class="classObject"
    :style="styleObject"
    @click="handleClick"
  >
    <span>
      {{ description }}
      <br>
      {{ hide }}
      <br>
      <span v-if="cost !== 0">
        Cost: {{ format(cost) }} Time Theorems
      </span>
    </span>
  </button>
</template>

<style scoped>

</style>
