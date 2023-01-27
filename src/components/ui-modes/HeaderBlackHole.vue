<script>
import HeaderBlackHoleStatusText from "./HeaderBlackHoleStatusText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "HeaderBlackHole",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
    HeaderBlackHoleStatusText
  },
  data() {
    return {
      canModifyBlackHoles: false,
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
    dischargeText() {
      return `Discharge: ${timeDisplayShort(this.storedTime)}`;
    },
    hasLongText() {
      return this.dischargeText.length > 15;
    },
  },
  watch: {
    isAutoReleasing(newValue) {
      player.celestials.enslaved.isAutoReleasing = newValue;
    }
  },
  methods: {
    update() {
      // Technically not entirely accurate (you can still invert within Laitela), but it's cleaner to just hide it all
      // because Laitela disables everything else and it technically still displays as pulsing even if it isn't
      this.canModifyBlackHoles = BlackHoles.areUnlocked && !Laitela.isRunning;
      this.displaySingle = BlackHoles.arePermanent;
      if (this.displaySingle) this.singleState = BlackHole(1).displayState;
      this.pauseText = this.pauseButtonText();
      this.canCharge = Enslaved.isUnlocked;
      this.isCharging = Enslaved.isStoringGameTime;
      this.storedTime = player.celestials.enslaved.stored;
      this.canAutoRelease = Ra.unlocks.autoPulseTime.canBeApplied;
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
    chargingClassObject() {
      return {
        "o-primary-btn--buy-max c-primary-btn--black-hole-header": true,
        "o-bh-charge-disabled": this.isAutoReleasing
      };
    }
  }
};
</script>

<template>
  <span
    v-if="canModifyBlackHoles"
    class="c-black-hole-header"
  >
    <PrimaryButton
      class="o-primary-btn--buy-max c-primary-btn--black-hole-header"
      onclick="BlackHoles.togglePause()"
    >
      {{ pauseText }}
    </PrimaryButton>
    <span v-if="canCharge">
      <PrimaryButton
        :class="chargingClassObject()"
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
    <span
      v-if="displaySingle"
      class="c-black-hole-status-text"
      v-html="'🌀:' + singleState"
    />
    <span v-else>
      <HeaderBlackHoleStatusText
        v-for="(blackHole, i) in blackHoles"
        :key="'state' + i"
        :black-hole="blackHole"
      />
    </span>
    <span v-if="canCharge">
      <PrimaryButton
        class="o-discharge-btn c-primary-btn--black-hole-header"
        :class="{ 'o-small-discharge-text': hasLongText }"
        onclick="Enslaved.useStoredTime(false)"
      >
        {{ dischargeText }}
      </PrimaryButton>
    </span>
    <span v-if="canAutoRelease">
      <PrimaryToggleButton
        v-model="isAutoReleasing"
        class="o-primary-btn--buy-max c-primary-btn--black-hole-header"
        label="Pulse:"
      />
    </span>
  </span>
</template>

<style scoped>
.c-black-hole-header {
  font-weight: bold;
  color: var(--color-text);
}

.c-primary-btn--black-hole-header {
  vertical-align: middle;
  margin: 0.2rem;
}

.c-black-hole-status-text {
  margin: 0 0.8rem;
}

.o-discharge-btn {
  width: 20rem;
  font-size: 1rem;
}

.o-small-discharge-text {
  font-size: 1rem;
  line-height: 1rem;
}

.o-bh-charge-disabled {
  background-color: var(--color-disabled);
  user-select: none;
  cursor: not-allowed;
}
</style>
