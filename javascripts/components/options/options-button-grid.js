"use strict";

Vue.component("options-button-grid", {
  components: {
    "options-button": {
      template:
        `<primary-button
          class="o-primary-btn--option l-options-grid__button"
          @click="emitClick"
        ><slot /></primary-button>`
    },
    "update-rate-slider": {
      props: {
        value: {
          type: Number,
          default: 50
        },
      },
      template:
        `<div class="o-primary-btn o-primary-btn--option o-primary-btn--update-rate l-options-grid__button"> 
          <b>Update rate: {{ value }} ms</b>
          <input
            :value="value"
            class="o-primary-btn--update-rate__slider"
            type="range"
            min="33"
            max="200"
            @input="emitInput(parseInt($event.target.value))"
          />
         </div>`
    }
  },
  data() {
    return {
      theme: "",
      notation: "",
      retryChallenge: false,
      cloud: false,
      hotkeys: false,
      commas: false,
      updateRate: 0,
      offlineTicks: 0
    };
  },
  watch: {
    retryChallenge(newValue) {
      player.options.retryChallenge = newValue;
    },
    cloud(newValue) {
      player.options.cloud = newValue;
    },
    hotkeys(newValue) {
      player.options.hotkeys = newValue;
    },
    commas(newValue) {
      player.options.commas = newValue;
      ADNotations.Settings.exponentCommas.show = newValue;
    },
    updateRate(newValue) {
      player.options.updateRate = newValue;
    },
    offlineTicks(newValue) {
      player.options.offlineTicks = parseInt(newValue, 10);
    }
  },
  computed: {
    themeLabel() {
      return `Theme: ${Themes.find(this.theme).displayName()} ▼`;
    },
    notationLabel() {
      return `Notation: ${this.notation} ▼`;
    },
    UILabel() {
      return `UI: ${this.$viewModel.newUI ? "New" : "Old"}`;
    }
  },
  methods: {
    update() {
      const options = player.options;
      this.theme = options.theme;
      this.notation = options.notation;
      this.retryChallenge = options.retryChallenge;
      this.cloud = options.cloud;
      this.hotkeys = options.hotkeys;
      this.commas = options.commas;
      this.updateRate = options.updateRate;
      this.offlineTicks = options.offlineTicks;
    },
    hardReset() {
      if (confirm("Do you really want to erase all your progress?")) {
        GameStorage.hardReset();
      }
    }
  }, // the following is for options subtab "user interface."
  template: `
  <div class="l-options-grid">
      <div class="l-options-grid__row">
        <options-button
          class="o-primary-btn--option_font-large"
          onclick="GameOptions.toggleUI()"
        >{{ UILabel }}</options-button>
        <update-rate-slider
          v-model="updateRate"
          oninput="GameOptions.refreshUpdateRate()"
        />
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="o-primary-btn--option_font-large"
          onclick="Modal.infoDisplayOptions.show()"
        >Info Displays</options-button>
        <options-button
          class="o-primary-btn--option_font-large"
          onclick="Modal.miscellaneousOptions.show()"
        >Miscellaneous</options-button>
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
    </div>`
});
