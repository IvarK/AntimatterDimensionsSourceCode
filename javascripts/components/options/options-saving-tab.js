"use strict";

Vue.component("options-saving-tab", {
  components: {
    "options-button": {
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
      template: `
      <div class="o-primary-btn o-primary-btn--option o-primary-btn--slider l-options-grid__button">
        <b>Autosave interval: {{ formatInt(value) }}s</b>
        <input
        :value="value"
        class="o-primary-btn--slider__slider"
        type="range"
        min="10"
        max="60"
        @input="emitInput(parseInt($event.target.value))"
        />
      </div>`
    }
  },
  data() {
    return {
      cloudAvailable: false,
      cloudEnabled: false,
      autosaveInterval: 10
    };
  },
  watch: {
    cloudEnabled(newValue) {
      player.options.cloudEnabled = newValue;
    },
    autosaveInterval(newValue) {
      player.options.autosaveInterval = 1000 * newValue;
    }
  },
  methods: {
    update() {
      this.cloudAvailable = kong.enabled;
      const options = player.options;
      this.cloudEnabled = options.cloudEnabled;
      this.autosaveInterval = options.autosaveInterval / 1000;
    },
    hardReset() {
      if (confirm("Do you really want to erase all your progress?")) {
        GameStorage.hardReset();
      }
    },
    exportAsFile() {
      GameStorage.exportAsFile();
    },
    importAsFile(event) {
        const file = new Blob(event.target.result);
        const reader = new FileReader();
        const text = reader.readAsText(file);
        // This does absoultely nothing (outputs "undefined")
        console.log(text);
        GameStorage.import(text, true);
    }
  },
  template: `
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.export()"
        >Export save</options-button>
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.import.show()"
        >Import save</options-button>
        <options-button
          class="o-primary-btn--option_font-x-large"
          @click="hardReset"
        >RESET THE GAME</options-button>
      </div>
      <div class="l-options-grid__row">
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.save(false, true)"
        >Save game</options-button>
        <options-button
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.loadGame.show()"
        >Choose save</options-button>
        <autosave-interval-slider
          v-model="autosaveInterval"
          oninput="GameOptions.refreshAutosaveInterval()"
        />
      </div>
      <div class="l-options-grid__row" v-if="cloudAvailable">
        <options-button
          onclick="GameOptions.cloudSave()"
        >Cloud save</options-button>
        <options-button
          onclick="GameOptions.cloudLoad()"
        >Cloud load</options-button>
        <primary-button-on-off
          class="o-primary-btn--option l-options-grid__button"
          v-model="cloudEnabled"
          text="Automatic cloud saving/loading:"
        />
      </div>
      <div class="l-options-grid__row">
        <options-button
          @click="exportAsFile"
        >Export save as file</options-button>
        <options-button
          >Import save as file<input type="file" accept=".txt" @change="importAsFile"></options-button>
      </div>
      <p onclick="Modal.shortcuts.show()" class="c-options-tab__shortcuts-link">
        Press <kbd>?</kbd> to open shortcut list.
      </p>
    </div>
  </div>`
});
