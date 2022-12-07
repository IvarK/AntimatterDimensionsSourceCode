/* eslint-disable import/extensions */
import pako from "pako/dist/pako.esm.mjs";
/* eslint-enable import/extensions */

//import { get, getDatabase, ref, set } from "firebase/database";
//import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
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
  lastCloudHash: null,

  resetTempState() {
    this.lastCloudHash = null;
    GameStorage.lastCloudSave = Date.now();
    GameIntervals.checkCloudSave.restart();
  },

  get loggedIn() {
    return this.user !== null;
  },

  async login() {
    try {
      await signInWithPopup(this.auth, this.provider);
      ShopPurchaseData.syncSTD();
      GameUI.notify.success(`Logged in as ${this.user.displayName}`);
    } catch (e) {
      GameUI.notify.error("Google Account login failed");
    }
  },


  async manualCloudLogin(EmailAddress,Password) {
    //try{
      await signInWithEmailAndPassword(this.auth, EmailAddress, Password)
    /*}catch(error){
      console.log(`Could Not Login (Error: ${error}`)
      Cloud.manualCloudCreate(EmailAddress,Password)
    }*/
  },

  async manualCloudCreate(EmailAddress,Password) {
    //try{
      await createUserWithEmailAndPassword(this.auth, EmailAddress, Password);
    /*}catch(error){
      console.log(`Could Not Create (Error: ${error}`)
      Cloud.manualCloudLogin(EmailAddress,Password)
    }*/
  },

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
    const save = await this.load();
    if (save === null) {
      this.save();
    } else {
      const root = GameSaveSerializer.deserialize(save);
      const saveId = GameStorage.currentSlot;
      const cloudSave = root.saves[saveId];
      const thisCloudHash = sha512_256(GameSaveSerializer.serialize(cloudSave));
      if (!this.lastCloudHash) this.lastCloudHash = thisCloudHash;
      const localSave = GameStorage.saves[saveId];
      const saveComparison = this.compareSaves(cloudSave, localSave, thisCloudHash);

      // eslint-disable-next-line no-loop-func
      const overwriteAndSendCloudSave = () => {
        root.saves[saveId] = GameStorage.saves[saveId];
        this.save(saveId);
      };

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

  save(slot) {
    if (!this.user) return;
    if (GlyphSelection.active || ui.$viewModel.modal.progressBar !== undefined) return;
    if (player.options.syncSaveIntervals) GameStorage.save();
    const root = {
      current: GameStorage.currentSlot,
      saves: GameStorage.saves,
    };

    this.lastCloudHash = sha512_256(GameSaveSerializer.serialize(root.saves[slot]));
    GameStorage.lastCloudSave = Date.now();
    GameIntervals.checkCloudSave.restart();
    set(ref(this.db, `users/${this.user.id}/web`), GameSaveSerializer.serialize(root));
    GameUI.notify.info(`Game saved (slot ${slot + 1}) to cloud`);/* with user ${this.user.displayName}`);*/
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
        GameUI.notify.info(`Cloud save (slot ${saveId + 1}) loaded`);/* for user ${this.user.displayName}`);*/
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
          displayName: steamOn ? Steam.getSteamId().screenName : "",//user.displayName,
          email: user.email,
        };
        //ShopPurchaseData.syncSTD();
      } else {
        this.user = null;
      }
    });
  },
};

Cloud.init();
//this.user.displayName = Steam.getSteamId().screenName
