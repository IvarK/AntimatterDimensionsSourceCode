"use strict";

Vue.component("options-gameplay-tab", {
  components: {
    "options-button": {
      template:
        `<primary-button
          class="o-primary-btn--option l-options-grid__button"
          @click="emitClick"
        ><slot /></primary-button>`
    },
  },
  data() {
    return {
      retryChallenge: false,
      offlineProgress: false,
      hotkeys: false,
      offlineTicks: 0,
      automaticTabSwitching: false,
      infinityUnlocked: false,
      sacrificeUnlocked: false
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
    offlineTicks(newValue) {
      player.options.offlineTicks = parseInt(newValue, 10);
    },
    automaticTabSwitching(newValue) {
      player.options.automaticTabSwitching = newValue;
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.retryChallenge = options.retryChallenge;
      this.offlineProgress = options.offlineProgress;
      this.hotkeys = options.hotkeys;
      this.offlineTicks = options.offlineTicks;
      this.automaticTabSwitching = options.automaticTabSwitching;
      this.infinityUnlocked = PlayerProgress.current.isInfinityUnlocked;
      this.sacrificeUnlocked = Sacrifice.isVisible;
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
          <primary-button-on-off-custom
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
            <b>Offline ticks: {{ formatInt(parseInt(offlineTicks)) }}</b>
            <input
              v-model="offlineTicks"
              class="o-primary-btn--slider__slider"
              type="range"
              min="100"
              step="100"
              max="10000"
            />
          </div>
          <primary-button-on-off
            v-model="automaticTabSwitching"
            class="o-primary-btn--option l-options-grid__button"
            style="font-size: 12px;"
            text="Switch tabs on some events (e.g. entering challenges):"
          />
        </div>
        <open-modal-shortcuts />
      </div>
    </div>`
});
