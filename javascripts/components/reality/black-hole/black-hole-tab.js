"use strict";

Vue.component("black-hole-tab", {
  data() {
    return {
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      vIsFlipped: false,
      currentNegative: Math.log10(1 / player.blackHoleNegative),
      maxNegativeBlackHole: 300
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    sliderProps() {
      return {
        min: 0,
        max: this.maxNegativeBlackHole,
        interval: 1,
        show: true,
        width: "60rem",
        tooltip: false
      };
    },
    negativeBlackHoleLabel() {
      return `Negative black hole divides game speed by ${shorten(1 / this.currentNegative, 2, 2)}. ` +
        "This only works when black hole is paused.";
    }
  },
  mounted() {
    if (this.$refs.canvas) {
      this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
    }
  },
  destroyed() {
    if (this.animation) this.animation.unmount();
  },
  methods: {
    update() {
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
      this.isEnslaved = Enslaved.isRunning;
      this.vIsFlipped = V.isFlipped;
    },
    togglePause() {
      BlackHoles.togglePause();
      this.update();
    },
    adjustSlider(value) {
      this.currentNegative = value;
      player.blackHoleNegative = 1 / Math.pow(10, value);
      player.minNegativeBlackHoleThisReality = Math.max(
        player.minNegativeBlackHoleThisReality,
        player.blackHoleNegative
      );
    },
  },
  template: `
    <div class="l-black-hole-tab">
      <div v-if="isEnslaved">
        The physics of this reality do not permit singularities.
      </div>
      <black-hole-unlock-button v-else-if="!isUnlocked" />
      <template v-else>
        <canvas class="c-black-hole-canvas" ref="canvas" width="400" height="400" />
        <div class="l-black-hole-upgrade-grid">
          <black-hole-state-row
            v-for="(blackHole, i) in blackHoles"
            :key="'state' + i"
            :blackHole="blackHole"
          />
          <black-hole-upgrade-row
            v-for="(blackHole, i) in blackHoles"
            :key="'upgrades' + i"
            :blackHole="blackHole"
          />
          <button
            class="l-reality-upgrade-btn c-reality-upgrade-btn"
            @click="togglePause"
          >
            {{ isPaused ? "Resume" : "Pause" }}
          </button>
          <div v-if="vIsFlipped" class="l-enslaved-shop-container">
            {{ negativeBlackHoleLabel }}
            <ad-slider-component
                v-bind="sliderProps"
                :value="currentNegative"
                @input="adjustSlider($event)"
              />
          </div>
        </div>
      </template>
    </div>
  `
});