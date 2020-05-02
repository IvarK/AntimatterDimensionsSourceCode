"use strict";
// saving subtab
Vue.component("options-saving-tab", {
    components: {
        "options-button-saving-tab": {
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
        template: `
        <div class="l-options-tab">
        <div class="l-options-grid">
        <div class="l-options-grid__row">
        <options-button-saving-tab
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.export()"
        >Export save</options-button-saving-tab>
        <options-button-saving-tab
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.import.show()"
        >Import save</options-button-saving-tab>
        </div>
        <div class="l-options-grid__row">
        <options-button-saving-tab
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.save(false, true)"
        >Save game</options-button-saving-tab>
        <options-button-saving-tab
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.loadGame.show()"
        >Choose save</options-button-saving-tab>
        </div>
        <div class="l-options-grid__row">
        <options-button-saving-tab
          class="o-primary-btn--option_font-x-large"
          @click="hardReset"
        >RESET THE GAME</options-button-saving-tab>
        </div>
        <div class="l-options-grid__row">
        <options-button-saving-tab
          onclick="GameOptions.cloudSave()"
        >Cloud save</options-button-saving-tab>
        <options-button-saving-tab
          onclick="GameOptions.cloudLoad()"
        >Cloud load</options-button-saving-tab>
        <primary-button-on-off
          class="o-primary-btn--option l-options-grid__button"
          v-model="cloud"
          text="Automatic cloud saving/loading:"
        />
        </div>
        </div>
        <p onclick="Modal.shortcuts.show()" class="c-options-tab__shortcuts-link">
        Press <kbd>?</kbd> to open shortcut list.
      </p>
        </div>
        `
    },
) 