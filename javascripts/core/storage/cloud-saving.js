/* eslint-disable import/extensions */
import pako from "pako/dist/pako.esm.mjs";
/* eslint-enable import/extensions */

import { get, getDatabase, ref, set } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { sha512_256 } from "js-sha512";

import { decodeBase64Binary } from "./base64-binary";
import { ProgressChecker } from "./progress-checker";

const firebaseConfig = {
  apiKey: "AIzaSyDuRTTluAFufmvw1zxGH6fsyEHmmbu8IHI",
  authDomain: "antimatter-dimensions-a00f2.firebaseapp.com",
  databaseURL: "https://antimatter-dimensions-a00f2.firebaseio.com",
  projectId: "antimatter-dimensions-a00f2",
  storageBucket: "antimatter-dimensions-a00f2.appspot.com",
  messagingSenderId: "904798020003",
  appId: "1:904798020003:web:d1448dcb2dedd8b5",
};

initializeApp(firebaseConfig);

export const Cloud = {
  provider: new GoogleAuthProvider(),
  auth: getAuth(),
  db: getDatabase(),
  user: null,
  hasSeenSavingConflict: false,
  shouldOverwriteCloudSave: true,
  lastCloudHash: null,

  get loggedIn() {
    return this.user !== null;
  },

  async login() {
    await signInWithPopup(this.auth, this.provider);
  },

  async loadMobile() {
    if (!this.user) return;
    const snapshot = await get(ref(this.db, `users/${this.user.id}/player`));
    if (snapshot.exists) {
      const encoded = snapshot.val();
      const uintArray = decodeBase64Binary(encoded.replace(/-/gu, "+").replace(/_/gu, "/"));
      const save = pako.ungzip(uintArray, { to: "string" });
      // TODO: do something with this.
      JSON.parse(save);
    }
  },

  compareSaves(cloud, local, hash) {
    return {
      farther: ProgressChecker.compareSaveProgress(cloud, local),
      older: ProgressChecker.compareSaveTimes(cloud, local),
      diffSTD: (cloud?.IAP?.totalSTD ?? 0) - (local?.IAP?.totalSTD ?? 0),
      differentName: cloud?.options.saveFileName !== local?.options.saveFileName,
      hashMismatch: hash && this.lastCloudHash !== hash,
    };
  },

  async saveCheck() {
    const save = await this.load();
    if (save === null) {
      this.save();
    } else {
      const root = GameSaveSerializer.deserialize(save);
      const saveId = GameStorage.currentSlot;
      const cloudSave = root.saves[saveId];
      const thisCloudHash = sha512_256(GameSaveSerializer.serialize(cloudSave));
      const localSave = GameStorage.saves[saveId];
      const saveComparison = this.compareSaves(cloudSave, localSave, thisCloudHash);

      // eslint-disable-next-line no-loop-func
      const overwriteAndSendCloudSave = () => {
        root.saves[saveId] = GameStorage.saves[saveId];
        this.save(saveId);
      };

      // Bring up the modal if cloud saving will overwrite a cloud save which is older or possibly farther
      const hasBoth = cloudSave && localSave;
      // NOTE THIS CHECK IS INTENTIONALLY DIFFERENT FROM THE LOAD CHECK
      // Hash mismatch check should be separate from the others because otherwise it only ever shows up on the first
      // mismatch; there are situations (eg. two devices actively saving) which can cause this to happen repeatedly.
      const hasConflict = hasBoth && (saveComparison.older === -1 || saveComparison.farther !== 1 ||
        saveComparison.diffSTD > 0 || saveComparison.differentName);
      if ((hasConflict && !this.hasSeenSavingConflict) || saveComparison.hashMismatch) {
        Modal.addCloudConflict(saveId, saveComparison, cloudSave, localSave, overwriteAndSendCloudSave);
        Modal.cloudSaveConflict.show();
      } else if (!hasConflict || (this.hasSeenSavingConflict && this.shouldOverwriteCloudSave)) {
        overwriteAndSendCloudSave();
      }
    }
  },

  save(slot) {
    if (!this.user) return;
    if (GlyphSelection.active || ui.$viewModel.modal.progressBar !== undefined) return;
    GameStorage.save();
    const root = {
      current: GameStorage.currentSlot,
      saves: GameStorage.saves,
    };

    this.lastCloudHash = sha512_256(GameSaveSerializer.serialize(root.saves[slot]));
    GameStorage.lastCloudSave = Date.now();
    GameIntervals.checkCloudSave.restart();
    set(ref(this.db, `users/${this.user.id}/web`), GameSaveSerializer.serialize(root));
    GameUI.notify.info(`Game saved (slot ${slot + 1}) to cloud with user ${this.user.displayName}`);
  },

  async loadCheck() {
    const save = await this.load();
    if (save === null) {
      GameUI.notify.info(`No cloud save for user ${this.user.displayName}`);
    } else {
      const root = GameSaveSerializer.deserialize(save);
      const saveId = GameStorage.currentSlot;
      const cloudSave = root.saves[saveId];
      const localSave = GameStorage.saves[saveId];
      const saveComparison = this.compareSaves(cloudSave, localSave);

      // eslint-disable-next-line no-loop-func
      const overwriteLocalSave = () => {
        GameStorage.overwriteSlot(saveId, cloudSave);
        GameUI.notify.info(`Cloud save (slot ${saveId + 1}) loaded for user ${this.user.displayName}`);
      };

      // Bring up the modal if cloud loading will overwrite a local save which is older or possibly farther
      const hasBoth = cloudSave && localSave;
      const hasConflict = hasBoth && (saveComparison.older === 1 || saveComparison.farther !== -1 ||
        saveComparison.diffSTD < 0 || saveComparison.differentName);
      if (hasConflict) {
        Modal.addCloudConflict(saveId, saveComparison, cloudSave, localSave, overwriteLocalSave);
        Modal.cloudLoadConflict.show();
      } else {
        overwriteLocalSave();
      }
    }
  },

  async load() {
    const snapshot = await get(ref(this.db, `users/${this.user.id}/web`));
    if (snapshot.exists) return snapshot.val();

    return null;
  },

  logout() {
    signOut(this.auth);
  },

  init() {
    getAuth().onAuthStateChanged(user => {
      if (user) {
        this.user = {
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
        };
      } else {
        this.user = null;
      }
    });
  },
};

Cloud.init();
