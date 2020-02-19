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
      offlineProgress: false,
      updateRate: 0
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
    offlineProgress(newValue) {
      player.options.offlineProgress = newValue;
    },
    updateRate(newValue) {
      player.options.updateRate = newValue;
    },
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
      this.offlineProgress = options.offlineProgress;
      this.updateRate = options.updateRate;
    },
    hardReset() {
      if (confirm("Do you really want to erase all your progress?")) {
        GameStorage.hardReset();
      }
    }
  },
  template: `
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <expanding-control-box width-source="header" class="l-options-grid__button c-options-grid__notations">
          <div slot="header" class="o-primary-btn o-primary-btn--option l-options-grid__notations-header">
            {{themeLabel}}
          </div>
          <select-theme slot="dropdown" />
        </expanding-control-box>
        <expanding-control-box width-source="header" class="l-options-grid__button c-options-grid__notations">
          <div slot="header" class="o-primary-btn o-primary-btn--option l-options-grid__notations-header">
            {{notationLabel}}
          </div>
          <select-notation slot="dropdown" />
        </expanding-control-box>
        <options-button
          onclick="GameOptions.toggleNews()"
        >Hide/show the news</options-button>
      </div>
      <div class="l-options-grid__row">
        <primary-button-on-off
          v-model="retryChallenge"
          class="o-primary-btn--option l-options-grid__button"
          text="Automatically retry challenges:"
        />
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.export()"
        >Export</options-button>
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.import.show()"
        >Import</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="o-primary-btn--option_font-large"
          onclick="Modal.confirmationOptions.show()"
        >Confirmations</options-button>
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.save(manual = true)"
        >Save</options-button>
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.loadGame.show()"
        >Load</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          onclick="GameOptions.cloudSave()"
        >Cloud save</options-button>
        <options-button
          onclick="GameOptions.cloudLoad()"
        >Cloud load</options-button>
        <primary-button-on-off
          class="o-primary-btn--option l-options-grid__button"
          v-model="cloud"
          text="Automatic cloud saving/loading:"
        />
      </div>
      <div class="l-options-grid__row">
        <primary-button-on-off-custom
          v-model="hotkeys"
          class="o-primary-btn--option l-options-grid__button"
          on="Disable hotkeys"
          off="Enable hotkeys"
        />
        <options-button
          class="o-primary-btn--option_font-x-large"
          @click="hardReset"
        >RESET THE GAME</options-button>
        <primary-button-on-off-custom
          v-model="commas"
          class="o-primary-btn--option l-options-grid__button"
          on="Commas on exponents"
          off="Notation on exponents"
        />
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="o-primary-btn--option_font-large"
          onclick="GameOptions.toggleUI()"
        >{{ UILabel }}</options-button>
        <primary-button-on-off
          class="o-primary-btn--option l-options-grid__button"
          v-model="offlineProgress"
          text="Offline progress:"
        />
        <options-button
          class="o-primary-btn--option_font-large"
          onclick="Modal.animationOptions.show();"
        >Animations</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="o-primary-btn--option_font-large"
          onclick="Modal.infoDisplayOptions.show()"
        >Info Displays</options-button>
        <update-rate-slider
          v-model="updateRate"
          oninput="GameOptions.refreshUpdateRate()"
        />
        <options-button
           class="o-primary-btn--option l-options-grid__button--hidden"
         />
      </div>
    </div>`
});
