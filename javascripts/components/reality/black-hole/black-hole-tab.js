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
      maxNegativeBlackHole: 300,
      detailedBH2: "",
      storedFraction: 0,
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    sliderPropsNegative() {
      return {
        min: 0,
        max: this.maxNegativeBlackHole,
        interval: 1,
        show: true,
        width: "60rem",
        tooltip: false
      };
    },
    storedTimeRate() {
      return formatPercents(this.storedFraction / 1000, 1);
    },
    sliderPropsStoring() {
      return {
        min: 0,
        max: 1000,
        interval: 1,
        show: true,
        width: "60rem",
        tooltip: false
      };
    },
  },
  mounted() {
    this.startAnimation();
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
      this.canAdjustStoredTime = Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME);
      this.storedFraction = 1000 * player.celestials.enslaved.storedFraction;

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
    adjustSliderNegative(value) {
      this.negativeSlider = value;
      player.blackHoleNegative = Math.pow(10, -this.negativeSlider);
      player.minNegativeBlackHoleThisReality = Math.max(
        player.minNegativeBlackHoleThisReality,
        player.blackHoleNegative
      );
    },
    startAnimation() {
      setTimeout(() => {
        if (this.$refs.canvas) {
          this.animation = new BlackHoleAnimation(this.$refs.canvas.getContext("2d"));
        }
      }, 1);
    },
    adjustSliderStoring(value) {
      this.storedFraction = value;
      player.celestials.enslaved.storedFraction = value / 1000;
    },
  },
  template: `
    <div class="l-black-hole-tab">
      <div v-if="isEnslaved">
        The physics of this Reality do not permit singularities.
      </div>
      <div v-else-if="!isUnlocked" style="display: flex; flex-direction: column; align-items: center;">
        <black-hole-unlock-button @blackholeunlock="startAnimation"/>
        The Black Hole makes the entire game run significantly faster for a short period of time.
        <br>
        Starts at {{ formatX(180) }} faster for {{ formatInt(10) }} seconds, once per hour.
      </div>
      <template v-else>
        <div class="c-subtab-option-container">
          <button
            class="o-primary-btn o-primary-btn--subtab-option"
            @click="togglePause"
          >
            {{ isPaused ? "Resume" : "Pause" }} Black Hole
          </button>
        </div>
        <canvas class="c-black-hole-canvas" ref="canvas" width="400" height="400" />
        <div class="l-black-hole-upgrade-grid">
          <black-hole-state-row
            v-for="(blackHole, i) in blackHoles"
            :key="'state' + i"
            :blackHole="blackHole"
          />
          {{ detailedBH2 }}
          <div v-if="canAdjustStoredTime" class="l-enslaved-shop-container">
            Black Hole charging rate: {{ storedTimeRate }}
            <ad-slider-component
                v-bind="sliderPropsStoring"
                :value="storedFraction"
                @input="adjustSliderStoring($event)"
              />
          </div>
          <div v-if="isNegativeBHUnlocked" class="l-enslaved-shop-container">
            Inverted Black Hole divides game speed by {{ format(negativeBHDivisor, 2, 2) }}.
            This requires both Black Holes to be permanent and only works when paused.
            <ad-slider-component
                v-bind="sliderPropsNegative"
                :value="negativeSlider"
                @input="adjustSliderNegative($event)"
              />
          </div>
          <black-hole-upgrade-row
            v-for="(blackHole, i) in blackHoles"
            :key="'upgrades' + i"
            :blackHole="blackHole"
          />
        </div>
      </template>
    </div>
  `
});