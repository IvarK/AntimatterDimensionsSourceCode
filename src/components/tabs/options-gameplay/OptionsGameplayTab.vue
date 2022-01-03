<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import OpenModalShortcutsButton from "@/components/OpenModalShortcutsButton";
import OptionsButton from "@/components/OptionsButton";

export default {
  name: "OptionsGameplayTab",
  components: {
    PrimaryToggleButton,
    OpenModalShortcutsButton,
    OptionsButton
  },
  data() {
    return {
      retryChallenge: false,
      offlineProgress: false,
      hotkeys: false,
      offlineSlider: 0,
      offlineTicks: 0,
      automaticTabSwitching: false,
      infinityUnlocked: false,
      automatorUnlocked: false,
      automatorLogSize: 0,
    };
  },
  watch: {
    retryChallenge(newValue) {
      player.options.retryChallenge = newValue;
    },
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
    },
    hotkeys(newValue) {
      player.options.hotkeys = newValue;
    },
    offlineSlider(newValue) {
      player.options.offlineTicks = this.parseOfflineSlider(newValue);
    },
    automaticTabSwitching(newValue) {
      player.options.automaticTabSwitching = newValue;
    },
    automatorLogSize(newValue) {
      player.options.automatorEvents.maxEntries = parseInt(newValue, 10);
    },
  },
  // This puts the slider in the right spot on initialization
  created() {
    const ticks = player.options.offlineTicks;
    const exponent = Math.floor(Math.log10(ticks));
    const mantissa = (ticks / Math.pow(10, exponent)) - 1;
    this.offlineSlider = 9 * exponent + mantissa;
  },
  methods: {
    update() {
      const options = player.options;
      this.retryChallenge = options.retryChallenge;
      this.offlineProgress = options.offlineProgress;
      this.hotkeys = options.hotkeys;
      this.offlineTicks = player.options.offlineTicks;
      this.automaticTabSwitching = options.automaticTabSwitching;
      this.infinityUnlocked = PlayerProgress.current.isInfinityUnlocked;
      this.automatorUnlocked = Player.automatorUnlocked;
      this.automatorLogSize = options.automatorEvents.maxEntries;
    },
    // Given the endpoints of 22-54, this produces 500, 600, ... , 900, 1000, 2000, ... , 1e6 ticks
    // It's essentially 10^(x/10) but with the mantissa spaced linearly instead of logarithmically
    parseOfflineSlider(str) {
      const value = parseInt(str, 10);
      return (1 + value % 9) * Math.pow(10, Math.floor(value / 9));
    }
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <PrimaryToggleButton
          v-model="retryChallenge"
          class="o-primary-btn--option l-options-grid__button"
          label="Automatically retry challenges:"
        />
        <PrimaryToggleButton
          v-model="offlineProgress"
          class="o-primary-btn--option l-options-grid__button"
          label="Offline progress:"
        />
        <PrimaryToggleButton
          v-model="hotkeys"
          class="o-primary-btn--option l-options-grid__button"
          label="Hotkeys:"
          on="Enabled"
          off="Disabled"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option"
          onclick="Modal.confirmationOptions.show()"
        >
          Open Confirmation Options
        </OptionsButton>
        <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
          <b>Offline ticks: {{ formatInt(offlineTicks) }}</b>
          <input
            v-model="offlineSlider"
            class="o-primary-btn--slider__slider"
            type="range"
            min="22"
            step="1"
            max="54"
          >
        </div>
        <PrimaryToggleButton
          v-model="automaticTabSwitching"
          class="o-primary-btn--option l-options-grid__button"
          style="font-size: 12px;"
          label="Switch tabs on some events (e.g. entering challenges):"
        />
      </div>
      <div class="l-options-grid__row">
        <div
          v-if="automatorUnlocked"
          class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button"
        >
          <b>Automator Log Max: {{ formatInt(parseInt(automatorLogSize)) }}</b>
          <input
            v-model="automatorLogSize"
            class="o-primary-btn--slider__slider"
            type="range"
            min="50"
            step="50"
            max="500"
          >
        </div>
      </div>
      <OpenModalShortcutsButton />
    </div>
  </div>
</template>
