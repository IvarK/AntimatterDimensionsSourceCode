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
      this.loadPlayerObject(defaultStart);
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
    // Save current slot to make sure no changes are lost
    this.save(true);
    this.currentSlot = slot;
    this.loadPlayerObject(this.saves[slot]);
    Tab.dimensions.normal.show();
    Modal.hide();
    GameUI.notify.info("Game loaded");
  },

  import(saveData) {
    if (tryImportSecret(saveData) || Theme.tryUnlock(saveData)) {
      return;
    }
    const parsedSave = GameSaveSerializer.deserialize(saveData);
    if (!this.verify(parsedSave)) {
      Modal.message.show("Could not load the save");
      return;
    }
    this.loadPlayerObject(parsedSave);
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

  verify(save) {
    return save !== undefined && save.money !== undefined;
  },
  
  save(silent = false) {
    if (GlyphSelection.active) return;
    if (++this.saved > 99) SecretAchievement(12).unlock();
    player.reality.automatorOn = automatorOn;
    player.reality.automatorCurrentRow = automatorIdx;
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
    this.loadPlayerObject(defaultStart);
    this.save();
    Tab.dimensions.normal.show();
  },

  loadPlayerObject(playerObject) {
    this.saved = 0;

    postc8Mult = new Decimal(0);
    mult18 = new Decimal(1);
    IPminpeak = new Decimal(0);
    EPminpeak = new Decimal(0);

    if (playerObject === undefined || playerObject === defaultStart) {
      player = deepmerge.all([{}, defaultStart]);
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
    if (player.secretUnlocks.fixed === "hasbeenfixed") {
      SecretAchievement(42).unlock();
    }

    if (player.options.newsHidden) {
      document.getElementById("game").style.display = "none";
    }

    recalculateAllGlyphs();
    Autobuyer.tryUnlockAny();
    Autobuyer.checkIntervalAchievements();
    Autobuyer.checkBulkAchievements();
    resizeCanvas();
    updateAutomatorRows();
    checkPerkValidity();
    Teresa.checkPPShopValidity();
    drawPerkNetwork();
    updatePerkColors();
    V.updateTotalRunUnlocks();
    Enslaved.boostReality = false;
    Theme.set(player.options.theme);
    Notation.find(player.options.notation).setCurrent();

    if (localStorage.getItem("automatorScript1") !== null) {
      importAutomatorScript(localStorage.getItem("automatorScript1"));
    }
    automatorOn = player.reality.automatorOn;
    if (automatorOn) $("#automatorOn")[0].checked = true;
    automatorIdx = player.reality.automatorCurrentRow;

    Lazy.invalidateAll();

    let diff = new Date().getTime() - player.lastUpdate;
    if (diff > 5 * 60 * 1000 && player.celestials.enslaved.autoStoreReal) {
      diff = Enslaved.autoStoreRealTime(diff);
    }
    if (diff > 1000 * 1000) {
      simulateTime(diff / 1000);
    }
  }
};
