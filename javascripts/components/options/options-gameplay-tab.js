import PrimaryButton from "@/components/PrimaryButton";
import PrimaryButtonOnOffCustom from "@/components/PrimaryButtonOnOffCustom";

Vue.component("options-gameplay-tab", {
  components: {
    "options-button": {
      components: {
        PrimaryButton
      },
      template:
        `<PrimaryButton
          class="o-primary-btn--option l-options-grid__button"
          @click="emitClick"
        ><slot /></PrimaryButton>`
    },
    PrimaryButtonOnOffCustom
  },
  // This puts the slider in the right spot on initialization
  created() {
    const ticks = player.options.offlineTicks;
    const exponent = Math.floor(Math.log10(ticks));
    const mantissa = (ticks / Math.pow(10, exponent)) - 1;
    this.offlineSlider = 9 * exponent + mantissa;
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
      sacrificeUnlocked: false,
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
  methods: {
    update() {
      const options = player.options;
      this.retryChallenge = options.retryChallenge;
      this.offlineProgress = options.offlineProgress;
      this.hotkeys = options.hotkeys;
      this.offlineTicks = player.options.offlineTicks;
      this.automaticTabSwitching = options.automaticTabSwitching;
      this.infinityUnlocked = PlayerProgress.current.isInfinityUnlocked;
      this.sacrificeUnlocked = Sacrifice.isVisible;
      this.automatorUnlocked = Player.automatorUnlocked;
      this.automatorLogSize = options.automatorEvents.maxEntries;
    },
    // Given the endpoints of 22-54, this produces 500, 600, ... , 900, 1000, 2000, ... , 1e6 ticks
    // It's essentially 10^(x/10) but with the mantissa spaced linearly instead of logarithmically
    parseOfflineSlider(str) {
      const value = parseInt(str, 10);
      return (1 + value % 9) * Math.pow(10, Math.floor(value / 9));
    }
  },
  template: `
    <div class="l-options-tab">
      <div class="l-options-grid">
        <div class="l-options-grid__row">
          <primary-button-on-off
            v-model="retryChallenge"
            class="o-primary-btn--option l-options-grid__button"
            text="Automatically retry challenges:"
          />
          <primary-button-on-off
            v-model="offlineProgress"
            class="o-primary-btn--option l-options-grid__button"
            text="Offline progress:"
          />
          <PrimaryButtonOnOffCustom
            v-model="hotkeys"
            class="o-primary-btn--option l-options-grid__button"
            on="Hotkeys: Enabled"
            off="Hotkeys: Disabled"
          />
        </div>
        <div class="l-options-grid__row">
          <options-button
            v-if="sacrificeUnlocked"
            class="o-primary-btn--option"
            onclick="Modal.confirmationOptions.show()"
          >
            Open Confirmation Options
          </options-button>
          <options-button
            v-else
            class="o-primary-btn--options"
          >
            You do not have anything that requires confirmation
          </options-button>
          <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
            <b>Offline ticks: {{ formatInt(offlineTicks) }}</b>
            <input
              class="o-primary-btn--slider__slider"
              v-model="offlineSlider"
              type="range"
              min="22"
              step="1"
              max="54"
            />
          </div>
          <primary-button-on-off
            v-model="automaticTabSwitching"
            class="o-primary-btn--option l-options-grid__button"
            style="font-size: 12px;"
            text="Switch tabs on some events (e.g. entering challenges):"
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
            />
          </div>
        </div>
        <open-modal-shortcuts />
      </div>
    </div>`
});
