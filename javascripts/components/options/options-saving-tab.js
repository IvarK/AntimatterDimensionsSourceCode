"use strict";
// Saving subtab
Vue.component("options-saving-tab", {
    components: {
      "options-button-saving-tab": {
        template:
          `<primary-button
            class="o-primary-btn--option l-options-grid__button"
            @click="emitClick"
          ><slot /></primary-button>`
      },
      "autosave-interval-slider": {
        props: {
          value: {
            type: Number,
            default: 30
          },
        },
        template: 
        `
        <div class="o-primary-btn o-primary-btn--option o-primary-btn--autosave-slider l-options-grid__button">
        <b>Autosave interval: {{ value }}s</b>
        <input
        :value="value"
        class="o-primary-btn--autosave-slider"
        type="range"
        min="10"
        max="60"
        @input="emitInput(parseInt($event.target.value))"
        />
        </div>
        `
      }
    },
    data() {
      return {
        cloud: false,
        autosaveInterval: 10,
      };
    },
    watch: {
      cloud(newValue) {
        player.options.cloud = newValue;
      },
      autosaveInterval(newValue) {
        player.options.autosaveInterval = 1000 * newValue;
      }
    },
    methods: {
      update() {
        const options = player.options;
        this.cloud = options.cloud;
        this.autosaveInterval = options.autosaveInterval / 1000;
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
    <options-button-saving-tab
      class="o-primary-btn--option_font-x-large"
      @click="hardReset"
    >RESET THE GAME</options-button-saving-tab>
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
    <autosave-interval-slider
      v-model="autosaveInterval"
      oninput="GameOptions.refreshAutosaveInterval()"
    />
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
  }
);