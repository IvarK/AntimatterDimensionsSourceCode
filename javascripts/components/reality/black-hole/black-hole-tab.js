"use strict";

Vue.component("black-hole-tab", {
  data() {
    return {
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      isNegativeBHUnlocked: false,
      negativeSlider: 0,
      negativeBHDivisor: 1,
      maxNegativeBlackHole: 250,
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
      this.isNegativeBHUnlocked = V.isFlipped && BlackHole(1).isPermanent && BlackHole(2).isPermanent;
      this.negativeSlider = -Math.log10(player.blackHoleNegative);
      this.negativeBHDivisor = Math.pow(10, this.negativeSlider);

      if (!BlackHole(2).isUnlocked || BlackHole(1).isActive) this.detailedBH2 = " ";
      else if (BlackHole(2).timeToNextStateChange > BlackHole(1).cycleLength) {
        const cycleCount = Math.floor(BlackHole(2).timeToNextStateChange / BlackHole(1).cycleLength);
        this.detailedBH2 = `Black Hole 2 will activate after ${formatInt(cycleCount)} more
          ${pluralize("cycle", cycleCount)} of Black Hole 1.`;
      } else if (BlackHole(2).isCharged) {
        this.detailedBH2 = `Black Hole 2 will activate with Black Hole 1, for ${TimeSpan.fromSeconds(
          Math.min(BlackHole(1).duration, BlackHole(2).duration - BlackHole(2).phase)).toStringShort()}.`;
      } else {
        const bh2Offset = BlackHole(2).timeToNextStateChange - BlackHole(1).timeToNextStateChange;
        const bh2Duration = Math.min(BlackHole(1).duration - bh2Offset, BlackHole(2).duration);
        this.detailedBH2 = `Black Hole 2 will activate ${TimeSpan.fromSeconds(bh2Offset).toStringShort()} after 
          Black Hole 1, for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
      }
    },
    togglePause() {
      BlackHoles.togglePause();
      if (BlackHoles.arePaused) {
        player.celestials.enslaved.isAutoReleasing = false;
      }
      this.update();
    },
    adjustSlider(value) {
      this.negativeSlider = value;
      player.blackHoleNegative = Math.pow(10, -this.negativeSlider);
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
      <div v-else-if="!isUnlocked">
        <black-hole-unlock-button/>
        The black hole makes the entire game run significantly faster for a short period of time.
        <br>
        Starts at {{ formatX(180) }} faster for {{ formatInt(10) }} seconds, once per hour.
      </div>
      <template v-else>
        <canvas class="c-black-hole-canvas" ref="canvas" width="400" height="400" />
        <div class="l-black-hole-upgrade-grid">
          <black-hole-state-row
            v-for="(blackHole, i) in blackHoles"
            :key="'state' + i"
            :blackHole="blackHole"
          />
          {{ detailedBH2 }}
          <div v-if="isNegativeBHUnlocked" class="l-enslaved-shop-container">
            Inverted black hole divides game speed by {{ format(negativeBHDivisor, 2, 2) }}.
            This requires both black holes to be permanent and only works when paused.
            <ad-slider-component
                v-bind="sliderProps"
                :value="negativeSlider"
                @input="adjustSlider($event)"
              />
          </div>
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
        </div>
      </template>
    </div>
  `
});