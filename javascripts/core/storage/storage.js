"use strict";

const GameStorage = {
  currentSlot: 0,
  saves: {
    0: undefined,
    1: undefined,
    2: undefined
  },
  saved: 0,

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
    Tab.dimensions.normal.show();
    GameUI.notify.info("Game loaded");
  },

  import(saveData) {
    if (tryImportSecret(saveData) || Theme.tryUnlock(saveData)) {
      return;
    }
    const player = GameSaveSerializer.deserialize(saveData);
    if (!this.verifyPlayerObject(player)) {
      Modal.message.show("Could not load the save");
      return;
    }
    this.loadPlayerObject(player);
    this.save(true);
    GameUI.notify.info("Game imported");
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

  save(silent = false) {
    if (GlyphSelection.active) return;
    if (++this.saved > 99) SecretAchievement(12).unlock();
    const root = {
      current: this.currentSlot,
      saves: this.saves
    };
    localStorage.setItem(this.localStorageKey, GameSaveSerializer.serialize(root));
    if (!silent) GameUI.notify.info("Game saved");
  },

  export() {
    const save = GameSaveSerializer.serialize(player);
    copyToClipboardAndNotify(save);
  },

  hardReset() {
    this.loadPlayerObject(Player.defaultStart);
    this.save();
    Tab.dimensions.normal.show();
  },

  loadPlayerObject(playerObject) {
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
      player = this.migrations.patch(playerObject);
      this.devMigrations.patch(player);
    }

    this.saves[this.currentSlot] = player;

    if (isDevEnvironment()) {
      guardFromNaNValues(player);
    }

    if (player.infinitied.gt(0) && !NormalChallenge(1).isCompleted) {
      NormalChallenge(1).complete();
    }

    ui.view.news = player.options.news;
    ui.view.newUI = player.options.newUI;

    recalculateAllGlyphs();
    checkPerkValidity();
    V.updateTotalRunUnlocks();
    Enslaved.boostReality = false;
    Theme.set(player.options.theme);
    Notations.find(player.options.notation).setAsCurrent();

    EventHub.dispatch(GameEvent.GAME_LOAD);
    AutomatorBackend.initializeFromSave();
    Lazy.invalidateAll();

    let diff = Date.now() - player.lastUpdate;
    if (diff > 5 * 60 * 1000 && player.celestials.enslaved.autoStoreReal) {
      diff = Enslaved.autoStoreRealTime(diff);
    }
    
    if (diff > 1000 * 1000) {
      simulateTime(diff / 1000);
    }
    Enslaved.nextTickDiff = player.options.updateRate;
    GameUI.update();
    if (GameIntervals.gameLoop.isStarted) {
      GameIntervals.gameLoop.restart();
    }

    for (const resource of AlchemyResources.all) {
      resource.before = resource.amount;
    }
  }
};
