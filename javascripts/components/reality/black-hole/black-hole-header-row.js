Vue.component("black-hole-status-text", {
  props: {
    blackHole: Object
  },
  data() {
    return {
      isUnlocked: false,
      state: "",
    };
  },
  computed: {
    id() {
      return this.blackHole.id;
    }
  },
  methods: {
    update() {
      const { blackHole } = this;
      this.isUnlocked = blackHole.isUnlocked;
      this.state = blackHole.displayState;
    }
  },
  template: `
    <span v-if="isUnlocked">
     🌀{{ id }}:<span v-html="state"></span>
    </span>`
});

Vue.component("black-hole-header-row", {
  data() {
    return {
      hasBlackHoles: false,
      displaySingle: false,
      singleState: "",
      pauseText: "",
      canCharge: false,
      isCharging: false,
      storedTime: 0,
      canAutoRelease: false,
      isAutoReleasing: false,
    };
  },
  watch: {
    isAutoReleasing(newValue) {
      player.celestials.enslaved.isAutoReleasing = newValue;
    }
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    id() {
      return this.blackHole.id;
    },
  },
  methods: {
    update() {
      this.hasBlackHoles = BlackHoles.areUnlocked;
      this.displaySingle = BlackHoles.arePermanent;
      if (this.displaySingle) this.singleState = BlackHole(1).displayState;
      this.pauseText = this.pauseButtonText();
      this.canCharge = Enslaved.isUnlocked;
      this.isCharging = Enslaved.isStoringGameTime;
      this.storedTime = player.celestials.enslaved.stored;
      this.canAutoRelease = Ra.has(RA_UNLOCKS.ADJUSTABLE_STORED_TIME);
      this.isAutoReleasing = player.celestials.enslaved.isAutoReleasing;
    },
    pauseButtonText() {
      if (BlackHoles.arePaused && player.blackHoleNegative < 1) return "Uninvert BH";
      if (BlackHoles.arePaused) return "Unpause BH";
      const accel = BlackHoles.unpauseAccelerationFactor;
      if (accel !== 1) return `${formatPercents(accel, 1)} speed`;
      if (player.blackHoleNegative < 1) return "Invert BH";
      return "Pause BH";
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms);
    },
    toggleAutoRelease() {
      player.celestials.enslaved.isAutoReleasing = !player.celestials.enslaved.isAutoReleasing;
    },
  },
  template: `
    <span v-if="hasBlackHoles">
      <primary-button
        class="o-primary-btn--buy-max"
        onclick="BlackHoles.togglePause()"
      >
        {{ pauseText }}
      </primary-button>
      <span v-if="canCharge">
        <primary-button
          class="o-primary-btn--buy-max"
          onclick="Enslaved.toggleStoreBlackHole()"
        >
          <span v-if="isCharging">
            Stop Charging
          </span>
          <span v-else>
            Charge
          </span>
        </primary-button>
      </span>
      <span v-if="displaySingle">
        🌀:<span v-html="singleState"></span>
      </span>
      <span v-else>
        <black-hole-status-text
          v-for="(blackHole, i) in blackHoles"
          :key="'state' + i"
          :blackHole="blackHole"
        />
      </span>
      <span v-if="canCharge">
        <primary-button
          class="o-enslaved-release-header-button"
          onclick="Enslaved.useStoredTime(false)"
        >
          Discharge: {{ timeDisplayShort(storedTime) }}
        </primary-button>
      </span>
      <span v-if="canAutoRelease">
        <primary-button-on-off
          v-model="isAutoReleasing"
          class="o-primary-btn--buy-max"
          text="Pulse:"
        />
      </span>
    </span>`
});
