"use strict";

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
        template: `<div class="l-options-grid">
        <div class="l-options-grid__row">
        <options-button-customizability-tab
          onclick="GameOptions.toggleNews()"
        >Hide/show the news</options-button-customizability-tab>
        <primary-button-on-off
          v-model="retryChallenge"
          class="o-primary-btn--option l-options-grid__button"
          text="Automatically retry challenges:"
        />
        <options-button-customizability-tab
          class="o-primary-btn--option_font-large"
          onclick="Modal.animationOptions.show();"
        >Animations</options-button-customizability-tab>
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
        <div class="l-options-grid-row">
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
      <options-button-customizability-tab
        class="o-primary-btn--option_font-large"
        onclick="Modal.miscellaneousOptions.show()"
      >Miscellaneous</options-button-customizability-tab>
        </div>
      </div>
        </div>`
    },
)