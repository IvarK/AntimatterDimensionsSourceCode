<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import BlackHoleStatusText from "@/components/BlackHoleStatusText";

export default {
  name: "BlackHoleHeaderRow",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
    BlackHoleStatusText
  },
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
  computed: {
    blackHoles: () => BlackHoles.list,
    id() {
      return this.blackHole.id;
    },
  },
  watch: {
    isAutoReleasing(newValue) {
      player.celestials.enslaved.isAutoReleasing = newValue;
    }
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
  }
};
</script>

<template>
  <span v-if="hasBlackHoles">
    <PrimaryButton
      class="o-primary-btn--buy-max"
      onclick="BlackHoles.togglePause()"
    >
      {{ pauseText }}
    </PrimaryButton>
    <span v-if="canCharge">
      <PrimaryButton
        class="o-primary-btn--buy-max"
        onclick="Enslaved.toggleStoreBlackHole()"
      >
        <span v-if="isCharging">
          Stop Charging
        </span>
        <span v-else>
          Charge
        </span>
      </PrimaryButton>
    </span>
    <span v-if="displaySingle">
      🌀:<span v-html="singleState" />
    </span>
    <span v-else>
      <BlackHoleStatusText
        v-for="(blackHole, i) in blackHoles"
        :key="'state' + i"
        :black-hole="blackHole"
      />
    </span>
    <span v-if="canCharge">
      <PrimaryButton
        class="o-enslaved-release-header-button"
        onclick="Enslaved.useStoredTime(false)"
      >
        Discharge: {{ timeDisplayShort(storedTime) }}
      </PrimaryButton>
    </span>
    <span v-if="canAutoRelease">
      <PrimaryToggleButton
        v-model="isAutoReleasing"
        class="o-primary-btn--buy-max"
        label="Pulse:"
      />
    </span>
  </span>
</template>

<style scoped>

</style>
