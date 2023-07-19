import * as ADNotations from "@antimatter-dimensions/notations";

import { DEV } from "@/env";
import { devMigrations } from "./dev-migrations";
import { migrations } from "./migrations";

import { deepmergeAll } from "@/utility/deepmerge";

export const BACKUP_SLOT_TYPE = {
  ONLINE: 0,
  OFFLINE: 1,
  RESERVE: 2,
};

// Note: interval is in seconds, and only the first RESERVE slot is ever used. Having intervalStr as a redundant
// prop is necessary because using our TimeSpan formatting functions produces undesirable strings like "1.00 minutes"
export const AutoBackupSlots = [
  {
    id: 1,
    type: BACKUP_SLOT_TYPE.ONLINE,
    intervalStr: () => `${formatInt(1)} minute`,
    interval: 60,
  },
  {
    id: 2,
    type: BACKUP_SLOT_TYPE.ONLINE,
    intervalStr: () => `${formatInt(5)} minutes`,
    interval: 5 * 60,
  },
  {
    id: 3,
    type: BACKUP_SLOT_TYPE.ONLINE,
    intervalStr: () => `${formatInt(20)} minutes`,
    interval: 20 * 60,
  },
  {
    id: 4,
    type: BACKUP_SLOT_TYPE.ONLINE,
    intervalStr: () => `${formatInt(1)} hour`,
    interval: 3600,
  },
  {
    id: 5,
    type: BACKUP_SLOT_TYPE.OFFLINE,
    intervalStr: () => `${formatInt(10)} minutes`,
    interval: 10 * 60,
  },
  {
    id: 6,
    type: BACKUP_SLOT_TYPE.OFFLINE,
    intervalStr: () => `${formatInt(1)} hour`,
    interval: 3600,
  },
  {
    id: 7,
    type: BACKUP_SLOT_TYPE.OFFLINE,
    intervalStr: () => `${formatInt(5)} hours`,
    interval: 5 * 3600,
  },
  {
    id: 8,
    type: BACKUP_SLOT_TYPE.RESERVE,
  },
];

export const GameStorage = {
  currentSlot: 0,
  saves: {
    0: undefined,
    1: undefined,
    2: undefined
  },
  saved: 0,
  lastSaveTime: Date.now(),
  lastCloudSave: Date.now(),
  offlineEnabled: undefined,
  offlineTicks: undefined,
  lastUpdateOnLoad: 0,
  lastBackupTimes: [],
  oldBackupTimer: 0,
  ignoreBackupTimer: true,

  // Limit offline tick count using two conditions:
  // - Ticks should never be shorter than 33ms (this would allow offline to exploit tick microstructure)
  // - Count should be limited to 1e6 (the options UI doesn't allow for this to be set above this value)
  maxOfflineTicks(simulatedMs, defaultTicks = this.offlineTicks) {
    const tickLimit = Math.clampMax(Math.floor(simulatedMs / 33), 1e6);
    return Math.clampMax(defaultTicks, tickLimit);
  },

  get localStorageKey() {
    return DEV ? "dimensionTestSave" : "dimensionSave";
  },

  backupDataKey(saveSlot, backupSlot) {
    return DEV ? `backupTestSave-${saveSlot}-${backupSlot}` : `backupSave-${saveSlot}-${backupSlot}`;
  },

  backupTimeKey(saveSlot) {
    return DEV ? `backupTestTimes-${saveSlot}` : `backupTimes-${saveSlot}`;
  },

  load() {
    const save = localStorage.getItem(this.localStorageKey);
    const root = GameSaveSerializer.deserialize(save);

    this.loadRoot(root);
    Achievements.updateSteamStatus();
  },

  loadRoot(root) {
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
      this.loadBackupTimes();
      this.backupOfflineSlots();
      this.save(true);
      return;
    }

    this.saves = root.saves;
    this.currentSlot = root.current;
    this.loadPlayerObject(this.saves[this.currentSlot]);
    this.loadBackupTimes();
    this.backupOfflineSlots();
  },

  loadSlot(slot) {
    this.currentSlot = slot;
    // Save current slot to make sure no changes are lost
    this.save(true);
    this.loadPlayerObject(this.saves[slot] ?? Player.defaultStart);
    this.loadBackupTimes();
    this.backupOfflineSlots();
    Tabs.all.find(t => t.id === player.options.lastOpenTab).show(false);
    Modal.hideAll();
    Cloud.resetTempState();
    GameUI.notify.info("Game loaded");
    Achievements.updateSteamStatus();
  },

  import(saveData) {
    if (tryImportSecret(saveData) || Theme.tryUnlock(saveData)) {
      return;
    }
    const newPlayer = GameSaveSerializer.deserialize(saveData);
    if (this.checkPlayerObject(newPlayer) !== "") {
      Modal.message.show("Could not load the save (format unrecognized or invalid).");
      return;
    }
    this.oldBackupTimer = player.backupTimer;
    Modal.hideAll();
    Quote.clearAll();
    AutomatorBackend.clearEditor();
    this.loadPlayerObject(newPlayer);
    GlyphAppearanceHandler.clearInvalidCosmetics();
    if (player.speedrun?.isActive) Speedrun.setSegmented(true);
    this.save(true);
    Cloud.resetTempState();
    this.resetBackupTimer();

    // This is to fix a very specific exploit: When the game is ending, some tabs get hidden
    // The options tab is the first one of those, which makes the player redirect to the Pelle tab
    // You can doom your reality even if you haven't unlocked infinity yet if you import while the Pelle tab
    // is showing
    Tab.options.subtabs[0].show();
    GameUI.notify.info("Game imported");
    Achievements.updateSteamStatus();
  },

  importAsFile() {
    if (GameEnd.creditsEverClosed) return;
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

  // Some minimal save verification; if the save is valid then this returns an empty string, otherwise it returns a
  // a string roughly stating what's wrong with the save. In order for importing to work properly, this must return
  // an empty string.
  checkPlayerObject(save) {
    // Sometimes save is the output of GameSaveSerializer.deserialize, and if that function fails then it will result
    // in the input parameter here being undefined
    if (save === undefined || save === null) return "Save decoding failed (invalid format)";
    // Right now all we do is check for the existence of an antimatter prop, but if we wanted to do further save
    // verification then here's where we'd do it
    if (save.money === undefined && save.antimatter === undefined) return "Save does not have antimatter property";

    // Recursively check for any NaN props and add any we find to an array
    const invalidProps = [];
    function checkNaN(obj, path) {
      let hasNaN = false;
      for (const key in obj) {
        const prop = obj[key];
        let thisNaN;
        switch (typeof prop) {
          case "object":
            thisNaN = checkNaN(prop, `${path}.${key}`);
            hasNaN = hasNaN || thisNaN;
            break;
          case "number":
            thisNaN = Number.isNaN(prop);
            hasNaN = hasNaN || thisNaN;
            if (thisNaN) invalidProps.push(`${path}.${key}`);
            break;
          case "string":
            // If we're attempting to import, all NaN entries will still be strings
            thisNaN = prop === "NaN";
            hasNaN = hasNaN || thisNaN;
            if (thisNaN) invalidProps.push(`${path}.${key}`);
            break;
        }
      }
      return hasNaN;
    }
    checkNaN(save, "player");

    if (invalidProps.length === 0) return "";
    return `${quantify("NaN player property", invalidProps.length)} found:
      ${invalidProps.join(", ")}`;
  },

  // A few things in the current game state can prevent saving, which we want to do for all forms of saving
  canSave(ignoreSimulation = false) {
    const isSelectingGlyph = GlyphSelection.active;
    const isSimulating = ui.$viewModel.modal.progressBar !== undefined && !ignoreSimulation;
    const isEnd = (GameEnd.endState >= END_STATE_MARKERS.SAVE_DISABLED && !GameEnd.removeAdditionalEnd) ||
      GameEnd.endState >= END_STATE_MARKERS.INTERACTIVITY_DISABLED;
    return !isEnd && !(isSelectingGlyph || isSimulating);
  },

  save(silent = true, manual = false) {
    if (!this.canSave()) return;
    this.lastSaveTime = Date.now();
    GameIntervals.save.restart();
    if (manual && ++this.saved > 99) SecretAchievement(12).unlock();
    const root = {
      current: this.currentSlot,
      saves: this.saves
    };
    localStorage.setItem(this.localStorageKey, GameSaveSerializer.serialize(root));
    if (!silent) GameUI.notify.info("Game saved");
  },

  // Saves a backup, updates save timers (this is called before nextBackup is updated), and then saves the timers too.
  // When checking offline backups, this call typically resolves during offline progress simulation, so in this case
  // we want to ignore that (which saves the game state pre-simulation). This is because it's messier and less useful
  // to the player if we instead defer the call until after simulation
  saveToBackup(backupSlot, backupTimer) {
    if (!this.canSave(true)) return;
    localStorage.setItem(this.backupDataKey(this.currentSlot, backupSlot), GameSaveSerializer.serialize(player));
    this.lastBackupTimes[backupSlot] = {
      backupTimer,
      date: Date.now(),
    };
    localStorage.setItem(this.backupTimeKey(this.currentSlot), GameSaveSerializer.serialize(this.lastBackupTimes));
  },

  // Does not actually load, but returns an object which is meant to be passed on to loadPlayerObject()
  loadFromBackup(backupSlot) {
    const data = localStorage.getItem(this.backupDataKey(this.currentSlot, backupSlot));
    return GameSaveSerializer.deserialize(data);
  },

  // Check for the amount of time spent offline and perform an immediate backup for the longest applicable slot
  // which has had more than its timer elapse since the last time the game was open and saved
  backupOfflineSlots() {
    const currentTime = Date.now();
    const offlineTimeMs = currentTime - this.lastUpdateOnLoad;
    const offlineSlots = AutoBackupSlots
      .filter(slot => slot.type === BACKUP_SLOT_TYPE.OFFLINE)
      .sort((a, b) => b.interval - a.interval);
    for (const backupInfo of offlineSlots) {
      if (offlineTimeMs > 1000 * backupInfo.interval) {
        this.saveToBackup(backupInfo.id, player.backupTimer);
        break;
      }
    }
  },

  backupOnlineSlots(slotsToBackup) {
    const currentTime = player.backupTimer;
    for (const slot of slotsToBackup) this.saveToBackup(slot, currentTime);
  },

  // Loads in all the data from previous backup times in localStorage
  loadBackupTimes() {
    this.lastBackupTimes = GameSaveSerializer.deserialize(localStorage.getItem(this.backupTimeKey(this.currentSlot)));
    if (!this.lastBackupTimes) this.lastBackupTimes = {};
    for (const backupInfo of AutoBackupSlots) {
      const key = backupInfo.id;
      if (!this.lastBackupTimes[key]) {
        this.lastBackupTimes[key] = {
          backupTimer: 0,
          date: 0,
        };
      }
    }
  },

  // This is checked in the checkEverySecond game interval. Determining which slots to save has a 800ms grace time to
  // account for delays occurring from the saving operation itself; without this, the timer slips backwards by a second
  // every time it saves
  tryOnlineBackups() {
    const toBackup = [];
    for (const backupInfo of AutoBackupSlots.filter(slot => slot.type === BACKUP_SLOT_TYPE.ONLINE)) {
      const id = backupInfo.id;
      const timeSinceLast = player.backupTimer - (this.lastBackupTimes[id]?.backupTimer ?? 0);
      if (1000 * backupInfo.interval - timeSinceLast <= 800) toBackup.push(id);
    }
    this.backupOnlineSlots(toBackup);
  },

  // Set the next backup time, but make sure to skip forward an appropriate amount if a load or import happened,
  // since these may cause the backup timer to be significantly behind
  resetBackupTimer() {
    const latestBackupTime = Object.values(this.lastBackupTimes).map(t => t && t.backupTimer).max();
    player.backupTimer = Math.max(this.oldBackupTimer, player.backupTimer, latestBackupTime);
  },

  // Saves the current game state to the first reserve slot it finds
  saveToReserveSlot() {
    const targetSlot = AutoBackupSlots.find(slot => slot.type === BACKUP_SLOT_TYPE.RESERVE).id;
    this.saveToBackup(targetSlot, player.backupTimer);
  },

  export() {
    copyToClipboard(this.exportModifiedSave());
    GameUI.notify.info("Exported current savefile to your clipboard");
  },

  get exportDateString() {
    const dateObj = new Date();
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    return `${y}-${m}-${d}`;
  },

  exportAsFile() {
    if (!this.canSave()) return;
    player.options.exportedFileCount++;
    this.save(true);
    const saveFileName = player.options.saveFileName ? ` - ${player.options.saveFileName},` : "";
    const save = this.exportModifiedSave();
    download(
      `AD Save, Slot ${GameStorage.currentSlot + 1}${saveFileName} #${player.options.exportedFileCount} \
(${this.exportDateString}).txt`, save);
    GameUI.notify.info("Successfully downloaded current save file to your computer");
  },

  exportBackupsAsFile() {
    player.options.exportedFileCount++;
    const backupData = {};
    for (const id of AutoBackupSlots.map(slot => slot.id)) {
      const backup = this.loadFromBackup(id);
      if (backup) backupData[id] = backup;
    }
    backupData.time = GameSaveSerializer.deserialize(localStorage.getItem(this.backupTimeKey(this.currentSlot)));
    download(
      `AD Save Backups, Slot ${GameStorage.currentSlot + 1} #${player.options.exportedFileCount} \
(${this.exportDateString}).txt`, GameSaveSerializer.serialize(backupData));
    GameUI.notify.info("Successfully downloaded save file backups to your computer");
  },

  importBackupsFromFile(importText) {
    const backupData = GameSaveSerializer.deserialize(importText);
    localStorage.setItem(this.backupTimeKey(this.currentSlot), GameSaveSerializer.serialize(backupData.time));
    for (const backupKey of Object.keys(backupData)) {
      if (backupKey === "time") continue;
      const id = Number(backupKey);
      const storageKey = this.backupDataKey(this.currentSlot, id);
      localStorage.setItem(storageKey, GameSaveSerializer.serialize(backupData[backupKey]));
      this.backupTimeData[id] = {
        backupTimer: backupData.time[id].backupTimer,
        date: backupData.time[id].date,
      };
    }
    this.resetBackupTimer();
    GameUI.notify.info("Successfully imported save file backups from file");
  },

  // There are a couple props which may need to export with different values, so we handle that here
  exportModifiedSave() {
    // Speedrun segmented is exported as true
    const segmented = player.speedrun.isSegmented;
    Speedrun.setSegmented(true);

    // Serialize the altered data, then restore the old prop values afterwards and return
    const save = GameSaveSerializer.serialize(player);
    Speedrun.setSegmented(segmented);
    return save;
  },

  hardReset() {
    this.loadPlayerObject(Player.defaultStart);
    this.save(true);
    Tab.dimensions.antimatter.show();
    Cloud.resetTempState();
  },

  loadPlayerObject(playerObject) {
    this.saved = 0;

    const checkString = this.checkPlayerObject(playerObject);
    if (playerObject === Player.defaultStart || checkString !== "") {
      if (DEV && checkString !== "") {
        // eslint-disable-next-line no-console
        console.log(`Savefile was invalid and has been reset - ${checkString}`);
      }
      player = deepmergeAll([{}, Player.defaultStart]);
      player.records.gameCreatedTime = Date.now();
      player.lastUpdate = Date.now();
      if (DEV) {
        devMigrations.setLatestTestVersion(player);
      }
    } else {
      // We want to support importing from versions much older than the newest pre-reality version, but we also want
      // to support in-dev versions so we don't lose access to the large bank of in-dev saves we've accumulated. As
      // a result, we need to be careful with what order we apply the dev/live migrations and the deepmerge with the
      // default player object to fill in missing props.

      // For pre-Reality versions, we additionally need to fire off an event to ensure certain achievements and
      // notifications trigger properly. Missing props are filled in at this step via deepmerge
      const isPreviousVersionSave = playerObject.version < migrations.firstRealityMigration;
      player = migrations.patchPreReality(playerObject);
      if (isPreviousVersionSave) {
        if (DEV) devMigrations.setLatestTestVersion(player);
        EventHub.dispatch(GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION);
      }

      // All dev migrations are applied in-place, mutating the player object. Note that since we only want to apply dev
      // migrations in a dev environment, this means that test saves may fail to migrate on the live version
      if (DEV && player.options.testVersion !== undefined) {
        devMigrations.patch(player);
      }

      // Post-reality migrations are separated from pre-reality because they need to happen after any dev migrations,
      // which themselves must happen after the deepmerge
      player = migrations.patchPostReality(player);
    }

    this.saves[this.currentSlot] = player;
    this.lastUpdateOnLoad = player.lastUpdate;

    if (DEV) {
      guardFromNaNValues(player);
    }

    ui.view.news = player.options.news.enabled;
    ui.view.newUI = player.options.newUI;
    ui.view.tutorialState = player.tutorialState;
    ui.view.tutorialActive = player.tutorialActive;

    ECTimeStudyState.invalidateCachedRequirements();
    recalculateAllGlyphs();
    checkPerkValidity();
    V.updateTotalRunUnlocks();
    Enslaved.boostReality = false;
    GameEnd.additionalEnd = 0;
    Theme.set(Theme.currentName());
    Glyphs.unseen = [];
    Glyphs.unequipped = [];
    Notations.find(player.options.notation).setAsCurrent(true);
    ADNotations.Settings.exponentCommas.show = player.options.commas;

    EventHub.dispatch(GAME_EVENT.GAME_LOAD);
    AutomatorBackend.initializeFromSave();
    Lazy.invalidateAll();

    const rawDiff = Date.now() - player.lastUpdate;
    // We set offlineEnabled externally on importing or loading a backup; otherwise this is just a local load
    const simulateOffline = this.offlineEnabled ?? player.options.offlineProgress;
    if (simulateOffline && !Speedrun.isPausedAtStart()) {
      let diff = rawDiff;
      player.speedrun.offlineTimeUsed += diff;
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
      if (!Speedrun.isPausedAtStart()) Achievement(35).tryUnlock();
      player.lastUpdate = Date.now();
      this.postLoadStuff();
    }

    // 2-week threshold for showing the catchup modal. We want to show this even if offline progress is disabled
    // because its presence and usefulness is tied to what the player experiences, not the game. setTimeout seems to be
    // the only way to get this to display, as it won't display even if called after init() entirely nor is it getting
    // actively hidden by Modal.hideAll(), so delaying it asynchronously gets past whatever is causing it to not appear.
    // Delay time is relatively long to make it more likely to work on much slower computers.
    if (rawDiff > 1000 * 86400 * 14) {
      if (["S4", "S9"].includes(Theme.current().name)) Theme.set("Normal");
      // Looks like the game takes too long to load so we need to setTimeout else it doesn't check for the notation.
      setTimeout(() => {
        if (Notations.current.isPainful) Notation.mixedScientific.setAsCurrent();
      }, 2500);
      setTimeout(() => Modal.catchup.show(rawDiff), 5000);
    }
  },
  postLoadStuff() {
    // This is called from simulateTime, if that's called; otherwise, it gets called
    // manually above
    GameIntervals.restart();
    GameStorage.ignoreBackupTimer = false;
    Enslaved.nextTickDiff = player.options.updateRate;
    // The condition for this secret achievement is only checked when the player is actively storing real time, either
    // when online or simulating time. When only storing offline, the condition is never actually entered in the
    // gameLoop due to the option technically being false, so we need to check it on-load too.
    if (player.celestials.enslaved.storedReal > (24 * 60 * 60 * 1000)) SecretAchievement(46).unlock();
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
