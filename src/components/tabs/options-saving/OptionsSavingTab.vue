<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import OpenModalShortcutsButton from "@/components/OpenModalShortcutsButton";
import OptionsButton from "@/components/OptionsButton";
import AutosaveIntervalSlider from "./AutosaveIntervalSlider";

export default {
  name: "OptionsSavingTab",
  components: {
    PrimaryToggleButton,
    OpenModalShortcutsButton,
    OptionsButton,
    AutosaveIntervalSlider
  },
  data() {
    return {
      cloudEnabled: false,
      showTimeSinceSave: false,
      loggedIn: false,
      userName: ""
    };
  },
  watch: {
    cloudEnabled(newValue) {
      player.options.cloudEnabled = newValue;
    },
    showTimeSinceSave(newValue) {
      player.options.showTimeSinceSave = newValue;
    }
  },
  methods: {
    update() {
      const options = player.options;
      this.cloudEnabled = options.cloudEnabled;
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
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.export()"
        >
          Export save
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.import.show()"
        >
          Import save
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.hardReset.show()"
        >
          RESET THE GAME
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          onclick="GameStorage.save(false, true)"
        >
          Save game
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          onclick="Modal.loadGame.show()"
        >
          Choose save
        </OptionsButton>
        <AutosaveIntervalSlider />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton onclick="GameStorage.exportAsFile()">
          Export save as file
        </OptionsButton>
        <OptionsButton class="c-file-import-button">
          <input
            class="c-file-import"
            type="file"
            accept=".txt"
            @change="importAsFile"
          >
          <label for="file">Import save from file</label>
        </OptionsButton>
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
      <div
        v-if="loggedIn"
        class="l-options-grid__row"
      >
        <OptionsButton
          onclick="GameOptions.cloudSave()"
        >
          Cloud save
        </OptionsButton>
        <OptionsButton
          onclick="GameOptions.cloudLoad()"
        >
          Cloud load
        </OptionsButton>
        <PrimaryToggleButton
          v-model="cloudEnabled"
          class="o-primary-btn--option l-options-grid__button"
          label="Automatic cloud saving/loading:"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          v-if="loggedIn"
          onclick="GameOptions.logout()"
        >
          Disconnect Google Account and disable Cloud Saving
        </OptionsButton>
        <OptionsButton
          v-else
          v-tooltip="'This will connect your Google Account to your Antimatter Dimensions savefiles'"
          onclick="GameOptions.login()"
        >
          Login with Google to enable Cloud Saving
        </OptionsButton>
      </div>
    </div>
  </div>
</template>
