/* eslint-disable import/extensions */
import pako from "pako/dist/pako.esm.mjs";
/* eslint-enable import/extensions */

import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { sha512_256 } from "js-sha512";

import { STEAM } from "@/env";

import { decodeBase64Binary } from "./base64-binary";
import { firebaseConfig } from "./firebase-config";
import { ProgressChecker } from "./progress-checker";
import { SteamRuntime } from "@/steam";

const hasFirebaseConfig = firebaseConfig.apiKey !== null;
if (hasFirebaseConfig) {
  initializeApp(firebaseConfig);
}

export const Cloud = {
  provider: hasFirebaseConfig ? new GoogleAuthProvider() : null,
  auth: hasFirebaseConfig ? getAuth() : null,
  db: hasFirebaseConfig ? getDatabase() : null,
  user: null,
  lastCloudHash: null,

  get isAvailable() {
    return hasFirebaseConfig;
  },

  resetTempState() {
    this.lastCloudHash = null;
    GameStorage.lastCloudSave = Date.now();
    GameIntervals.checkCloudSave.restart();
  },

  get loggedIn() {
    return this.user !== null;
  },

  async login() {
    if (!this.isAvailable) {
      return;
    }

    try {
      await signInWithPopup(this.auth, this.provider);
      ShopPurchaseData.syncSTD();
      if (player.options.hideGoogleName) GameUI.notify.success(`Successfully logged in to Google Account`);
      else GameUI.notify.success(`Successfully logged in as ${this.user.displayName}`);
      if (ShopPurchaseData.isIAPEnabled) Speedrun.setSTDUse(true);
    } catch (e) {
      GameUI.notify.error("Google Account login failed");
    }
  },

  async loginWithSteam(accountId, staticAccountId, screenName) {
    if (!this.isAvailable) {
      return;
    }

    if (this.loggedIn) {
      Cloud.user.displayName = screenName;
      return;
    }

    const email = `${accountId}@ad.com`;
    const pass = staticAccountId;
    let error = undefined;

    await signInWithEmailAndPassword(this.auth, email, pass)
      .catch(() => createUserWithEmailAndPassword(this.auth, email, pass))
      .catch(x => error = x);

    if (error !== undefined) {
      // eslint-disable-next-line no-console
      console.log(`Firebase Login Error: ${error}`);
      return;
    }

    Cloud.user.displayName = screenName;
  },

  // NOTE: This function is largely untested due to not being used at any place within web reality code
  async loadMobile() {
    if (!this.user) return;
    const snapshot = await get(ref(this.db, `users/${this.user.id}/player`));
    if (snapshot.exists) {
      const encoded = snapshot.val();
      const uintArray = decodeBase64Binary(encoded.replace(/-/gu, "+").replace(/_/gu, "/"));
      const save = pako.ungzip(uintArray, { to: "string" });
    }
  },

  compareSaves(cloud, local, hash) {
    // This try/except will generally only throw an exception if the cloud save is somehow malformed.
    // In practice this should only happen for saves which are really old, or from very early development.
    // This will be handled upstream by showing a modal notifying the player of the invalid data and giving them
    // options to resolve it without needing to open up the console.
    // Note: This could also technically happen if the local save is malformed instead - this shouldn't
    // happen unless the player is overtly cheating through the console, and in that case it seems unreasonable
    // to attempt to handle such open-ended behavior gracefully
    try {
      return {
        farther: ProgressChecker.compareSaveProgress(cloud, local),
        older: ProgressChecker.compareSaveTimes(cloud, local),
        differentName: cloud?.options.saveFileName !== local?.options.saveFileName,
        hashMismatch: this.lastCloudHash && this.lastCloudHash !== hash,
      };
    } catch (e) {
      return null;
    }
  },

  async saveCheck(forceModal = false) {
    if (!this.isAvailable) {
      return;
    }

    const saveId = GameStorage.currentSlot;
    const cloudSave = await this.load();
    if (cloudSave === null) {
      this.save();
    } else {
      const thisCloudHash = sha512_256(GameSaveSerializer.serialize(cloudSave));
      if (!this.lastCloudHash) this.lastCloudHash = thisCloudHash;
      const localSave = GameStorage.saves[saveId];
      const saveComparison = this.compareSaves(cloudSave, localSave, thisCloudHash);
      const overwriteAndSendCloudSave = () => this.save();

      // If the comparison fails, we assume the cloud data is corrupted and show the relevant modal
      if (!saveComparison) {
        Modal.addCloudConflict(saveId, saveComparison, cloudSave, localSave, overwriteAndSendCloudSave);
        Modal.cloudInvalidData.show({ isSaving: true });
        return;
      }

      // Bring up the modal if cloud saving will overwrite a cloud save which is older or possibly farther
      const hasBoth = cloudSave && localSave;
      // NOTE THIS CHECK IS INTENTIONALLY DIFFERENT FROM THE LOAD CHECK
      const hasConflict = hasBoth && saveComparison && (saveComparison.older === -1 || saveComparison.farther === -1 ||
        saveComparison.differentName || saveComparison.hashMismatch);
      if (forceModal || (hasConflict && player.options.showCloudModal)) {
        Modal.addCloudConflict(saveId, saveComparison, cloudSave, localSave, overwriteAndSendCloudSave);
        Modal.cloudSaveConflict.show();
      } else if (!hasConflict || player.options.forceCloudOverwrite) {
        overwriteAndSendCloudSave();
      }
    }
  },

  save() {
    if (!this.user) return;
    if (GlyphSelection.active || ui.$viewModel.modal.progressBar !== undefined) return;
    if (player.options.syncSaveIntervals) GameStorage.save();
    const serializedSave = GameSaveSerializer.serialize(GameStorage.saves[GameStorage.currentSlot]);

    this.lastCloudHash = sha512_256(serializedSave);
    GameStorage.lastCloudSave = Date.now();
    GameIntervals.checkCloudSave.restart();

    const slot = GameStorage.currentSlot;
    this.writeToCloudDB(slot, serializedSave);

    // TODO We should revisit this (and the below in loadCheck) at some point after the steam-web merge
    // since the hiding motivation was identifying info, and Steam usernames are generally more publicly
    // visible than Google info. Also affects the visibility of the button in the Options/Saving subtab
    if (STEAM) {
      GameUI.notify.info(`Game saved (slot ${slot + 1}) to cloud as user ${this.user.displayName}`);
      return;
    }

    if (player.options.hideGoogleName) GameUI.notify.info(`Game saved (slot ${slot + 1}) to cloud`);
    else GameUI.notify.info(`Game saved (slot ${slot + 1}) to cloud as user ${this.user.displayName}`);
  },

  async loadCheck() {
    if (!this.isAvailable) {
      return;
    }

    const save = await this.load();
    if (save === null) {
      if (player.options.hideGoogleName) GameUI.notify.info(`No cloud save for current Google Account`);
      else GameUI.notify.info(`No cloud save for user ${this.user.displayName}`);
    } else {
      const cloudSave = save;
      const saveId = GameStorage.currentSlot;
      const localSave = GameStorage.saves[saveId];
      const saveComparison = this.compareSaves(cloudSave, localSave);

      // eslint-disable-next-line no-loop-func
      const overwriteLocalSave = () => {
        GameStorage.overwriteSlot(saveId, cloudSave);

        if (STEAM) {
          GameUI.notify.info(`Cloud save loaded`);
          return;
        }

        if (player.options.hideGoogleName) GameUI.notify.info(`Cloud save (slot ${saveId + 1}) loaded`);
        else GameUI.notify.info(`Cloud save (slot ${saveId + 1}) loaded for user ${this.user.displayName}`);
      };

      // If the comparison fails, we assume the cloud data is corrupted and show the relevant modal
      if (!saveComparison) {
        Modal.addCloudConflict(saveId, saveComparison, cloudSave, localSave, overwriteLocalSave);
        Modal.cloudInvalidData.show({ isSaving: false });
        return;
      }

      // Bring up the modal if cloud loading will overwrite a local save which is older or possibly farther
      const hasBoth = cloudSave && localSave;
      const hasConflict = hasBoth && (saveComparison.older === 1 || saveComparison.farther !== -1 ||
        saveComparison.differentName);
      if (hasConflict) {
        Modal.addCloudConflict(saveId, saveComparison, cloudSave, localSave, overwriteLocalSave);
        Modal.cloudLoadConflict.show();
      } else {
        overwriteLocalSave();
      }
    }
  },

  async load() {
    let singleSlot = await this.readFromCloudDB(GameStorage.currentSlot);
    if (singleSlot.exists()) return GameSaveSerializer.deserialize(singleSlot.val());

    // An optimization to reduce cloud save operations was done which migrates the format from an old one where all
    // slots were saved together to a new one where all three are saved in separate spots. This part of the code should
    // only be reached and executed if this migration hasn't happened yet, in which case we migrate and try again. If
    // it's *still* empty, then there was nothing to migrate in the first place
    await this.separateSaveSlots();
    singleSlot = await this.readFromCloudDB(GameStorage.currentSlot);
    if (singleSlot.exists()) return GameSaveSerializer.deserialize(singleSlot.val());

    return null;
  },

  // The initial implementation of cloud saving combined all save files in the same DB entry, but we have since changed
  // it so that they're all saved in separate slots. The database itself retains the single-entry data until the first
  // player load attempt after this change, at which point this is called client-side to do a one-time format migration
  // Before the migration, saves were stored in ".../web" and afterward they have been moved to ".../web/1" and similar
  async separateSaveSlots() {
    const oldData = await this.readFromCloudDB(null);
    if (!oldData.exists()) return;
    const allData = GameSaveSerializer.deserialize(oldData.val());
    if (!allData) return;

    for (const slot of Object.keys(allData.saves)) {
      const newData = GameSaveSerializer.serialize(allData.saves[slot]);
      await this.writeToCloudDB(Number(slot), newData);
    }
  },

  readFromCloudDB(slot) {
    const slotStr = slot === null ? "" : `/${slot}`;
    return get(ref(this.db, `users/${this.user.id}/web${slotStr}`));
  },

  writeToCloudDB(slot, data) {
    const slotStr = slot === null ? "" : `/${slot}`;
    return set(ref(this.db, `users/${this.user.id}/web${slotStr}`), data);
  },

  logout() {
    if (!this.isAvailable) {
      return;
    }

    signOut(this.auth);
    ShopPurchaseData.clearLocalSTD();
  },

  init() {
    if (!this.isAvailable) {
      return;
    }

    getAuth().onAuthStateChanged(user => {
      if (user) {
        this.user = {
          id: user.uid,
          displayName: STEAM
            ? SteamRuntime.screenName
            : user.displayName,
          email: user.email,
        };
        if (!STEAM) {
          ShopPurchaseData.syncSTD();
        }
      } else {
        this.user = null;
      }
    });
  },
};
