"use strict";

Vue.component("black-hole-tab", {
  data() {
    return {
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      vIsFlipped: false,
      currentNegative: Math.log10(1 / player.blackHoleNegative),
      maxNegativeBlackHole: 300,
      detailedBH2: "",
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
      return `Negative black hole divides game speed by ${format(1 / this.currentNegative, 2, 2)}. ` +
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

      if (!BlackHole(2).isUnlocked || BlackHole(1).isActive) this.detailedBH2 = " ";
      else if (BlackHole(2).timeToNextStateChange > BlackHole(1).cycleLength) {
        this.detailedBH2 = `Black hole 2 will activate after
          ${Math.floor(BlackHole(2).timeToNextStateChange / BlackHole(1).cycleLength)} more cycles of Black Hole 1.`;
      } else if (BlackHole(2).isCharged) {
        this.detailedBH2 = `Black hole 2 will activate with Black hole 1, for ${TimeSpan.fromSeconds(
          Math.min(BlackHole(1).duration, BlackHole(2).duration - BlackHole(2).phase)).toStringShort()}.`;
      } else {
        const bh2Offset = BlackHole(2).timeToNextStateChange - BlackHole(1).timeToNextStateChange;
        const bh2Duration = Math.min(BlackHole(1).duration - bh2Offset, BlackHole(2).duration);
        this.detailedBH2 = `Black hole 2 will activate ${TimeSpan.fromSeconds(bh2Offset).toStringShort()} after 
          Black hole 1, for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
      }
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
          />{{ detailedBH2 }}
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