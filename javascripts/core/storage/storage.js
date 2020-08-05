"use strict";

const GameStorage = {
  currentSlot: 0,
  saves: {
    0: undefined,
    1: undefined,
    2: undefined
  },
  saved: 0,
  count: 0,
  
  get localStorageKey() {
    return isDevEnvironment() ? "dimensionTestSave" : "dimensionSave";
  },

  load() {
    const save = localStorage.getItem(this.localStorageKey);
    const root = GameSaveSerializer.deserialize(save);

    if (root === undefined) {
      this.currentSlot = 0;
      this.loadPlayerObject(Player.defaultStart);
      return;
    }

    if (root.saves === undefined) {
      // Migrate old format
      this.saves = {
        0: root,
        1: undefined,
        2: undefined
      };
      this.currentSlot = 0;
      this.loadPlayerObject(root);
      this.save(true);
      return;
    }

    this.saves = root.saves;
    this.currentSlot = root.current;
    this.loadPlayerObject(this.saves[this.currentSlot]);
  },

  loadSlot(slot) {
    this.currentSlot = slot;
    // Save current slot to make sure no changes are lost
    this.save(true);
    this.loadPlayerObject(this.saves[slot]);
    Tab.dimensions.antimatter.show();
    GameUI.notify.info("Game loaded");
  },

  import(saveData, overrideLastUpdate = undefined) {
    if (tryImportSecret(saveData) || Theme.tryUnlock(saveData)) {
      return;
    }
    const player = GameSaveSerializer.deserialize(saveData);
    if (!this.verifyPlayerObject(player)) {
      Modal.message.show("Could not load the save");
      return;
    }
    this.loadPlayerObject(player, overrideLastUpdate);
    this.save(true);
    GameUI.notify.info("Game imported");
  },

  importAsFile() {
    const reader = new FileReader();
    const text = reader.readAsText(file);
    this.import(text);
  },

  overwriteSlot(slot, saveData) {
    this.saves[slot] = saveData;
    if (slot === this.currentSlot) {
      this.loadPlayerObject(saveData);
    }

    this.save(true);
  },

  verifyPlayerObject(save) {
    return save !== undefined && save !== null && (save.money !== undefined || save.antimatter !== undefined);
  },

  save(silent = false, manual = false) {
    if (GlyphSelection.active || ui.$viewModel.modal.progressBar !== undefined) return;
    if (manual && ++this.saved > 99) SecretAchievement(12).unlock();
    const root = {
      current: this.currentSlot,
      saves: this.saves
    };
    localStorage.setItem(this.localStorageKey, GameSaveSerializer.serialize(root));
    if (!silent) GameUI.notify.info("Game saved");
  },

  export() {
    const save = GameSaveSerializer.serialize(player);
    copyToClipboard(save);
    GameUI.notify.info("Exported current savefile to your clipboard");
  },

  exportAsFile() {
    GameStorage.count++;
    download(`AD-Save-${GameStorage.count}.txt`, GameSaveSerializer.serialize(player));
    GameUI.notify.info("Successfully downloaded current save file to your computer");
  },

  hardReset() {
    this.loadPlayerObject(Player.defaultStart);
    this.save();
    Tab.dimensions.antimatter.show();
  },

  loadPlayerObject(playerObject, overrideLastUpdate = undefined) {
    this.saved = 0;

    if (
      playerObject === Player.defaultStart ||
      !this.verifyPlayerObject(playerObject)
    ) {
      player = deepmerge.all([{}, Player.defaultStart]);
      player.gameCreatedTime = Date.now();
      player.lastUpdate = Date.now();
      if (isDevEnvironment()) this.devMigrations.setLatestTestVersion(player);
    } else {
      const isPreviousVersionSave = playerObject.version < 13;
      player = this.migrations.patch(playerObject);
      if (isPreviousVersionSave) {
        // Needed to check some reality upgrades which are usually only checked on eternity.
        EventHub.dispatch(GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION);
      }
      this.devMigrations.patch(player);
    }

    this.saves[this.currentSlot] = player;

    if (isDevEnvironment()) {
      guardFromNaNValues(player);
    }

    if (player.infinitied.gt(0) && !NormalChallenge(1).isCompleted) {
      NormalChallenge(1).complete();
    }

    ui.view.news = player.options.news.enabled;
    ui.view.newUI = player.options.newUI;
    ui.view.tutorialState = player.tutorialState;
    ui.view.tutorialActive = player.tutorialActive;

    recalculateAllGlyphs();
    checkPerkValidity();
    V.updateTotalRunUnlocks();
    Enslaved.boostReality = false;
    Theme.set(player.options.theme);
    Notations.find(player.options.notation).setAsCurrent(true);
    ADNotations.Settings.exponentCommas.show = player.options.commas;

    EventHub.dispatch(GAME_EVENT.GAME_LOAD);
    AutomatorBackend.initializeFromSave();
    Lazy.invalidateAll();

    if (overrideLastUpdate) {
      player.lastUpdate = overrideLastUpdate;
    }
    if (player.options.offlineProgress) {
      let diff = Date.now() - player.lastUpdate;
      if (diff > 5 * 60 * 1000 && player.celestials.enslaved.autoStoreReal) {
        diff = Enslaved.autoStoreRealTime(diff);
      }
      if (diff > 10000) {
        // The third parameter is a `fast` parameter that we use to only
        // simulate at most 50 ticks if the player was offline for less
        // than 50 seconds.
        simulateTime(diff / 1000, false, diff < 50 * 1000);
      } else {
        // This is ugly, should fix how we deal with it...
        this.postLoadStuff();
      }
    } else {
      // Try to unlock "Don't you dare sleep" (usually this check only happens
      // during a game tick, which makes the achievement impossible to get
      // with offline progress off)
      Achievement(35).tryUnlock();
      player.lastUpdate = Date.now();
      this.postLoadStuff();
    }
  },
  postLoadStuff() {
    // This is called from simulateTime, if that's called; otherwise, it gets called
    // manually above
    GameIntervals.restart();
    Enslaved.nextTickDiff = player.options.updateRate;
    GameUI.update();

    for (const resource of AlchemyResources.all) {
      resource.before = resource.amount;
    }
  }
};

function download(filename, text) {
  const pom = document.createElement("a");
  pom.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  pom.setAttribute("download", filename);

  if (document.createEvent) {
      const event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      pom.dispatchEvent(event);
  } else {
      pom.click();
  }
}
