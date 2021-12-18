import "./black-hole-unlock-button.js";
import "./black-hole-upgrade-row.js";
import "./black-hole-state-row.js";
import { BlackHoleAnimation } from "./black-hole-animation.js";
import SliderComponent from "@/components/SliderComponent";

Vue.component("black-hole-tab", {
  components: {
    SliderComponent
  },
  data() {
    return {
      isUnlocked: false,
      isPaused: false,
      isEnslaved: false,
      isNegativeBHUnlocked: false,
      pauseMode: 0,
      negativeSlider: 0,
      negativeBHDivisor: 1,
      maxNegativeBlackHole: 300,
      detailedBH2: "",
      storedFraction: 0,
      isPermanent: false,
      hasBH2: false,
      blackHoleUptime: [],
    };
  },
  mounted() {
    this.startAnimation();
  },
  destroyed() {
    if (this.animation) this.animation.unmount();
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
        max: 990,
        interval: 1,
        show: true,
        width: "60rem",
        tooltip: false
      };
    },
    pauseModeString() {
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          return "Do not pause";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          return this.hasBH2 ? "Before BH1" : "Before activation";
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          return "Before BH2";
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
    },
  },
  methods: {
    update() {
      this.isUnlocked = BlackHoles.areUnlocked;
      this.isPaused = BlackHoles.arePaused;
      this.isEnslaved = Enslaved.isRunning;
      this.isPermanent = BlackHoles.arePermanent;
      this.isNegativeBHUnlocked = V.isFlipped && this.isPermanent;
      this.pauseMode = player.blackHoleAutoPauseMode;
      this.negativeSlider = -Math.log10(player.blackHoleNegative);
      this.negativeBHDivisor = Math.pow(10, this.negativeSlider);
      this.canAdjustStoredTime = Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME);
      this.storedFraction = 1000 * player.celestials.enslaved.storedFraction;
      this.hasBH2 = BlackHole(2).isUnlocked;
      this.blackHoleUptime = [BlackHole(1).duration / BlackHole(1).cycleLength,
        BlackHole(2).duration / BlackHole(2).cycleLength];
      this.detailedBH2 = this.bh2Status();
    },
    bh2Status() {
      const bh1Remaining = BlackHole(1).timeWithPreviousActiveToNextStateChange;
      const bh2Remaining = BlackHole(2).timeWithPreviousActiveToNextStateChange;

      // Both BH active
      if (BlackHole(1).isActive && BlackHole(2).isActive) {
        const bh2Duration = Math.min(bh1Remaining, bh2Remaining);
        return `Black Hole 2 is active for the next ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}!`;
      }

      // BH1 active, BH2 will trigger before BH1 runs out
      if (BlackHole(1).isActive && (bh2Remaining < bh1Remaining)) {
        const bh2Duration = Math.min(bh1Remaining - bh2Remaining, BlackHole(2).duration);
        return `Black Hole 2 will activate before Black Hole 1 deactivates,
          for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}`;
      }

      // BH2 won't start yet next cycle
      if (BlackHole(1).isActive || (bh2Remaining > BlackHole(1).duration)) {
        const cycleCount = BlackHole(1).isActive
          ? Math.floor((bh2Remaining - bh1Remaining) / BlackHole(1).duration) + 1
          : Math.floor(bh2Remaining / BlackHole(1).duration);
        return `Black Hole 2 will activate after ${quantifyInt("more active cycle", cycleCount)} of Black Hole 1.`;
      }

      // BH1 inactive, BH2 ready to go when BH1 activates
      if (BlackHole(2).isCharged) {
        const bh2Duration = Math.min(BlackHole(1).duration, bh2Remaining);
        return `Black Hole 2 will activate with Black Hole 1,
          for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
      }

      // BH1 inactive, BH2 starts at some point after BH1 activates
      const bh2Duration = Math.min(BlackHole(1).duration - bh2Remaining, BlackHole(2).duration);
      return `Black Hole 2 will activate ${TimeSpan.fromSeconds(bh2Remaining).toStringShort()} after
        Black Hole 1, for ${TimeSpan.fromSeconds(bh2Duration).toStringShort()}.`;
    },
    togglePause() {
      BlackHoles.togglePause();
      if (BlackHoles.arePaused) {
        player.celestials.enslaved.isAutoReleasing = false;
      }
      this.update();
    },
    changePauseMode() {
      let steps;
      switch (this.pauseMode) {
        case BLACK_HOLE_PAUSE_MODE.NO_PAUSE:
          // Note: We don't need to check for permanent BH2 because the button disappears at that point
          steps = BlackHole(1).isPermanent ? 2 : 1;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH1:
          steps = this.hasBH2 ? 1 : 2;
          break;
        case BLACK_HOLE_PAUSE_MODE.PAUSE_BEFORE_BH2:
          steps = 1;
          break;
        default:
          throw new Error("Unrecognized BH offline pausing mode");
      }
      player.blackHoleAutoPauseMode = (this.pauseMode + steps) % Object.values(BLACK_HOLE_PAUSE_MODE).length;
    },
    adjustSliderNegative(value) {
      this.negativeSlider = value;
      player.blackHoleNegative = Math.pow(10, -this.negativeSlider);
      player.requirementChecks.reality.slowestBH = Math.max(
        player.requirementChecks.reality.slowestBH,
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
    gridStyle() {
      return this.isPermanent ? "l-black-hole-upgrade-permanent" : "l-black-hole-upgrade-grid";
    },
  },
  template: `
    <div class="l-black-hole-tab">
      <div v-if="isEnslaved">
        The physics of this Reality do not allow the existence of Black Holes.
      </div>
      <div v-else-if="!isUnlocked" style="display: flex; flex-direction: column; align-items: center;">
        <black-hole-unlock-button @blackholeunlock="startAnimation" />
        The Black Hole makes the entire game run significantly faster for a short period of time.
        <br>
        Starts at {{ formatX(180) }} faster for {{ formatInt(10) }} seconds, once per hour.
        <br>
        <br>
        Unlocking the Black Hole also gives {{ formatInt(10) }} Automator Points.
      </div>
      <template v-else>
        <div class="c-subtab-option-container">
          <button
            class="o-primary-btn o-primary-btn--subtab-option"
            @click="togglePause"
          >
            {{ isPaused ? "Resume" : "Pause" }} Black Hole
          </button>
          <button
            class="o-primary-btn o-primary-btn--subtab-option"
            style="width: 25rem;"
            @click="changePauseMode"
            v-if="!isPermanent"
          >
            Auto-pause: {{ pauseModeString }}
          </button>
        </div>
        <canvas class="c-black-hole-canvas" ref="canvas" width="400" height="400" />
        <div class="l-black-hole-upgrade-grid">
          <black-hole-state-row
            v-for="(blackHole, i) in blackHoles"
            :key="'state' + i"
            :blackHole="blackHole"
          />
          <span v-if="hasBH2 && !isPermanent">
            <b>{{ detailedBH2 }}</b>
            <br>
            The timer for Black Hole 2 only advances while Black Hole 1 is active.
            <br>
            Upgrades affect the internal timer; the header shows real time until next activation.
          </span>
          <br>
          <div v-if="!isPermanent">
            Black holes become permanently active when they are active for more than {{ formatPercents(0.9999, 2) }}
            of the time.
            <br>
            Active time percent: {{ formatPercents(blackHoleUptime[0], 3) }}
            <span v-if="hasBH2">and {{ formatPercents(blackHoleUptime[1], 3) }}</span>
          </div>
          <div v-if="canAdjustStoredTime" class="l-enslaved-shop-container">
            Black Hole charging rate: {{ storedTimeRate }}
            <SliderComponent
              v-bind="sliderPropsStoring"
              :value="storedFraction"
              @input="adjustSliderStoring($event)"
            />
          </div>
          <div v-if="isNegativeBHUnlocked" class="l-enslaved-shop-container">
            Inverted Black Hole divides game speed by {{ format(negativeBHDivisor, 2, 2) }}.
            This requires both Black Holes to be permanent and only works when paused.
            <SliderComponent
              v-bind="sliderPropsNegative"
              :value="negativeSlider"
              @input="adjustSliderNegative($event)"
            />
          </div>
        </div>
        <div :class="gridStyle()">
          <black-hole-upgrade-row
            v-for="(blackHole, i) in blackHoles"
            :key="'upgrades' + i"
            :blackHole="blackHole"
          />
        </div>
      </template>
    </div>`
});
