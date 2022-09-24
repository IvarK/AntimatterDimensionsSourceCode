<script>
import AutosaveIntervalSlider from "./AutosaveIntervalSlider";
import OpenModalHotkeysButton from "@/components/OpenModalHotkeysButton";
import OptionsButton from "@/components/OptionsButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SaveFileName from "./SaveFileName";

export default {
  name: "OptionsSavingTab",
  components: {
    AutosaveIntervalSlider,
    OpenModalHotkeysButton,
    OptionsButton,
    PrimaryToggleButton,
    SaveFileName
  },
  data() {
    return {
      cloudEnabled: false,
      showTimeSinceSave: false,
      loggedIn: false,
      userName: "",
      canSpeedrun: false,
      creditsClosed: false
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
      this.canSpeedrun = player.speedrun.isUnlocked;
      this.creditsClosed = GameEnd.creditsEverClosed;
      if (!this.loggedIn) return;
      this.userName = Cloud.user.displayName;
    },
    importAsFile(event) {
      // This happens if the file dialog is canceled instead of a file being selected
      if (event.target.files.length === 0) return;

      const reader = new FileReader();
      reader.onload = function() {
        const contents = reader.result;
        const toImport = GameSaveSerializer.deserialize(contents);
        const showWarning = (toImport?.IAP?.totalSTD ?? 0) < player.IAP.totalSTD;
        if (showWarning) {
          Modal.addImportConflict(toImport, GameStorage.saves[GameStorage.currentSlot]);
          Modal.importWarning.show({
            rawInput: contents,
            saveToImport: toImport,
            warningMessage: "The Imported Save has less STDs than your Current Save.",
          });
        } else {
          GameStorage.import(contents);
        }
      };
      reader.readAsText(event.target.files[0]);
    },
  }
};
</script>

<template>
  <div class="l-options-tab">
    <div class="l-options-grid">
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.export()"
        >
          Export save
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.import.show()"
        >
          Import save
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.hardReset.show()"
        >
          RESET THE GAME
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.save(false, true)"
        >
          Save game
        </OptionsButton>
        <OptionsButton
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.loadGame.show()"
        >
          Choose save
        </OptionsButton>
        <AutosaveIntervalSlider
          :min="10"
          :max="60"
          :interval="1"
          :is-cloud="false"
        />
      </div>
      <div class="l-options-grid__row">
        <OptionsButton
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameStorage.exportAsFile()"
        >
          Export save as file
        </OptionsButton>
        <OptionsButton
          class="c-file-import-button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        >
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
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="Display time since save:"
        />
      </div>
      <div class="l-options-grid__row">
        <SaveFileName />
        <OptionsButton
          v-if="canSpeedrun"
          class="o-primary-btn--option_font-x-large"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="Modal.enterSpeedrun.show()"
        >
          Start Speedrun
        </OptionsButton>
      </div>
      <OpenModalHotkeysButton />
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
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        >
          Cloud save
        </OptionsButton>
        <OptionsButton
          onclick="GameOptions.cloudLoad()"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        >
          Cloud load
        </OptionsButton>
        <OptionsButton
          v-if="loggedIn"
          onclick="GameOptions.logout()"
        >
          Disconnect Google Account and disable Cloud Saving
        </OptionsButton>
        <OptionsButton
          v-else
          v-tooltip="'This will connect your Google Account to your Antimatter Dimensions savefiles'"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          onclick="GameOptions.login()"
        >
          Login with Google to enable Cloud Saving
        </OptionsButton>
      </div>
      <div class="l-options-grid__row">
        <PrimaryToggleButton
          v-model="cloudEnabled"
          class="o-primary-btn--option l-options-grid__button"
          :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
          label="Automatic cloud saving/loading:"
        />
        <AutosaveIntervalSlider
          :min="60"
          :max="600"
          :interval="20"
          :is-cloud="true"
        />
      </div>
    </div>
  </div>
</template>
