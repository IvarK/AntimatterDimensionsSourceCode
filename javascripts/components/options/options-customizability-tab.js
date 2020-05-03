"use strict";
// Customizability subtab
Vue.component("options-customizability-tab", {
    components: {
      "options-button-customizability-tab": {
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
        hotkeys: false,
        offlineTicks: 0
      };
    },
    watch: {
      retryChallenge(newValue) {
        player.options.retryChallenge = newValue;
      },
      hotkeys(newValue) {
        player.options.hotkeys = newValue;
      },
      offlineTicks(newValue) {
        player.options.offlineTicks = parseInt(newValue, 10);
      }
    },
    methods: {
      update() {
        const options = player.options;
        this.retryChallenge = options.retryChallenge;
        this.hotkeys = options.hotkeys;
        this.offlineTicks = options.offlineTicks;
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
    <options-button-customizability-tab
      class="o-primary-btn--option_font-large"
      onclick="Modal.animationOptions.show();"
    >Animations</options-button-customizability-tab>
    <div class="o-primary-btn o-primary-btn--option o-primary-btn--update-rate l-options-grid__button"> 
    <b>Offline ticks: {{ offlineTicks }}</b>
    <input
      v-model="offlineTicks"
      class="o-primary-btn--update-rate__slider"
      type="range"
      min="100"
      step="100"
      max="10000"
    />
</div>
    </div>
  <div class="l-options-grid__row">
    <options-button-customizability-tab
      class="o-primary-btn--option_font-large"
      onclick="Modal.confirmationOptions.show()"
    >Confirmations</options-button-customizability-tab>
    <primary-button-on-off-custom
      v-model="hotkeys"
      class="o-primary-btn--option l-options-grid__button"
      on="Disable hotkeys"
      off="Enable hotkeys"
    /> 
    <options-button-customizability-tab
      class="o-primary-btn--option_font-large"
      onclick="Modal.infoDisplayOptions.show()"
    >Info Displays</options-button-customizability-tab>
    </div>
    <div class="l-options-grid__row">
    <options-button-customizability-tab
    style="visibility:hidden"
    ></options-button-customizability-tab>
  <options-button-customizability-tab
    class="o-primary-btn--option_font-large"
    onclick="Modal.miscellaneousOptions.show()"
  >Miscellaneous</options-button-customizability-tab>
    </div>
  </div>
  <p onclick="Modal.shortcuts.show()" class="c-options-tab__shortcuts-link">
    Press <kbd>?</kbd> to open shortcut list.
  </p>
    </div>
    </div>
    `
  }
);