import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import OpenModalShortcutsButton from "@/components/OpenModalShortcutsButton";

Vue.component("options-saving-tab", {
  components: {
    "options-button": {
      components: {
        PrimaryButton
      },
      template: `
        <PrimaryButton
          class="o-primary-btn--option l-options-grid__button"
          @click="emitClick"
        >
          <slot />
        </PrimaryButton>`
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
    },
    PrimaryToggleButton,
    OpenModalShortcutsButton
  },
  data() {
    return {
      cloudEnabled: false,
      autosaveInterval: 10,
      showTimeSinceSave: false,
      loggedIn: false,
      userName: ""
    };
  },
  watch: {
    cloudEnabled(newValue) {
      player.options.cloudEnabled = newValue;
    },
    autosaveInterval(newValue) {
      player.options.autosaveInterval = 1000 * newValue;
    },
    showTimeSinceSave(newValue) {
      player.options.showTimeSinceSave = newValue;
    }
  },
  methods: {
    update() {
      const options = player.options;
      this.cloudEnabled = options.cloudEnabled;
      this.autosaveInterval = options.autosaveInterval / 1000;
      this.showTimeSinceSave = options.showTimeSinceSave;
      this.loggedIn = Cloud.loggedIn;
      if (!this.loggedIn) return;
      this.userName = Cloud.user.displayName;
    },
    importAsFile(event) {
      const reader = new FileReader();
      reader.onload = function() {
        GameStorage.import(reader.result);
      };
      reader.readAsText(event.target.files[0]);
    }
  },
  template: `
    <div class="l-options-tab">
      <div class="l-options-grid">
        <div class="l-options-grid__row">
          <options-button
            class="o-primary-btn--option_font-x-large"
            onclick="GameStorage.export()"
          >
            Export save
          </options-button>
          <options-button
            class="o-primary-btn--option_font-x-large"
            onclick="Modal.import.show()"
          >
            Import save
          </options-button>
          <options-button
            class="o-primary-btn--option_font-x-large"
            onclick="Modal.hardReset.show()"
          >
            RESET THE GAME
          </options-button>
        </div>
        <div class="l-options-grid__row">
          <options-button
            class="o-primary-btn--option_font-x-large"
            onclick="GameStorage.save(false, true)"
          >
            Save game
          </options-button>
          <options-button
            class="o-primary-btn--option_font-x-large"
            onclick="Modal.loadGame.show()"
          >
            Choose save
          </options-button>
          <autosave-interval-slider
            v-model="autosaveInterval"
            oninput="GameOptions.refreshAutosaveInterval()"
          />
        </div>
        <div class="l-options-grid__row">
          <options-button onclick="GameStorage.exportAsFile()">
            Export save as file
          </options-button>
          <options-button class="c-file-import-button">
            <input class="c-file-import" type="file" accept=".txt" @change="importAsFile">
            <label for="file">Import save from file</label>
          </options-button>
          <PrimaryToggleButton
            v-model="showTimeSinceSave"
            class="o-primary-btn--option l-options-grid__button"
            label="Display time since save:"
          />
        </div>
        <OpenModalShortcutsButton />
      </div>
      <h2 class="c-cloud-options-header">
        <span v-if="loggedIn">Logged in as {{ userName }}</span>
        <span v-else>Not logged in</span>
      </h2>
      <div class="l-options-grid">
        <div class="l-options-grid__row" v-if="loggedIn">
          <options-button
            onclick="GameOptions.cloudSave()"
          >
            Cloud save
          </options-button>
          <options-button
            onclick="GameOptions.cloudLoad()"
          >
            Cloud load
          </options-button>
          <PrimaryToggleButton
            class="o-primary-btn--option l-options-grid__button"
            v-model="cloudEnabled"
            label="Automatic cloud saving/loading:"
          />
        </div>
        <div class="l-options-grid__row">
          <options-button onclick="GameOptions.logout()" v-if="loggedIn">
            Disconnect Google Account and disable Cloud Saving
          </options-button>
          <options-button onclick="GameOptions.login()"
            v-else
            v-tooltip="'This will connect your Google Account to your Antimatter Dimensions savefiles'"
          >
            Login with Google to enable Cloud Saving
          </options-button>
        </div>
      </div>
    </div>`
});
