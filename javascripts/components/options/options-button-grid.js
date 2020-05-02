"use strict";
// User interface subtab
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
  }, 
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
        <options-button
        class="o-primary-btn--option_font-large"
        onclick="Modal.animationOptions.show();"
      >Animations</options-button>
        </div>
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
        <primary-button-on-off-custom
        v-model="commas"
        class="o-primary-btn--option l-options-grid__button"
        on="Commas on exponents"
        off="Notation on exponents"
      />
        </div>
        <div class="l-options-grid__row"> 
        <options-button
        onclick="GameOptions.toggleNews()"
      >Hide/show the news</options-button>
    </div>
      </div>
      </div>
    </div>`
});
