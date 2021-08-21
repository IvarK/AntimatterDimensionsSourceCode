"use strict";

const firebaseConfig = {
  apiKey: "AIzaSyDuRTTluAFufmvw1zxGH6fsyEHmmbu8IHI",
  authDomain: "antimatter-dimensions-a00f2.firebaseapp.com",
  databaseURL: "https://antimatter-dimensions-a00f2.firebaseio.com",
  projectId: "antimatter-dimensions-a00f2",
  storageBucket: "antimatter-dimensions-a00f2.appspot.com",
  messagingSenderId: "904798020003",
  appId: "1:904798020003:web:d1448dcb2dedd8b5",
};

firebase.initializeApp(firebaseConfig);

const Cloud = {
  provider: new firebase.auth.GoogleAuthProvider(),
  auth: firebase.auth(),
  db: firebase.database(),
  user: null,
  hasSeenSavingConflict: false,
  shouldOverwriteCloudSave: true,

  get loggedIn() {
    return this.user !== null;
  },

  async login() {
    await this.auth.signInWithPopup(this.provider);
  },

  async loadMobile() {
    if (!this.user) return;
    const snapshot = await this.db.ref(`users/${this.user.id}/player`).get();
    if (snapshot.exists) {
      const encoded = snapshot.val();
      const uintArray = Base64Binary.decode(encoded.replace(/-/gu, "+").replace(/_/gu, "/"));
      const save = pako.ungzip(uintArray, { to: "string" });
      // TODO: do something with this.
      JSON.parse(save);
    }
  },

  async saveCheck() {
    const save = await this.load();
    if (save === null) {
      this.save();
    } else {
      const root = GameSaveSerializer.deserialize(save);
      const saveId = GameStorage.currentSlot;
      const cloudSave = root.saves[saveId];
      const localSave = GameStorage.saves[saveId];
      const saveComparison = {
        farther: ProgressChecker.compareSaveProgress(cloudSave, localSave),
        older: ProgressChecker.compareSaveTimes(cloudSave, localSave)
      };

      // eslint-disable-next-line no-loop-func
      const overwriteAndSendCloudSave = () => {
        root.saves[saveId] = GameStorage.saves[saveId];
        this.save(saveId);
      };

      // Bring up the modal if cloud saving will overwrite a cloud save which is older or possibly farther
      const hasBoth = cloudSave && localSave;
      const hasConflict = hasBoth && (saveComparison.older === -1 || saveComparison.farther !== 1);
      if (hasConflict && !this.hasSeenSavingConflict) {
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
    const root = {
      current: GameStorage.currentSlot,
      saves: GameStorage.saves,
    };

    this.db.ref(`users/${this.user.id}/web`).set(GameSaveSerializer.serialize(root));
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
      const saveComparison = {
        farther: ProgressChecker.compareSaveProgress(cloudSave, localSave),
        older: ProgressChecker.compareSaveTimes(cloudSave, localSave)
      };

      // eslint-disable-next-line no-loop-func
      const overwriteLocalSave = () => {
        GameStorage.overwriteSlot(saveId, cloudSave);
        GameUI.notify.info(`Cloud save (slot ${saveId + 1}) loaded for user ${this.user.displayName}`);
      };

      // Bring up the modal if cloud loading will overwrite a local save which is older or possibly farther
      const hasBoth = cloudSave && localSave;
      if (hasBoth && (saveComparison.older === 1 || saveComparison.farther !== -1)) {
        Modal.addCloudConflict(saveId, saveComparison, cloudSave, localSave, overwriteLocalSave);
        Modal.cloudLoadConflict.show();
      } else {
        overwriteLocalSave();
      }
    }
  },

  async load() {
    const snapshot = await this.db.ref(`users/${this.user.id}/web`).get();
    if (snapshot.exists) return snapshot.val();

    return null;
  },

  logout() {
    this.auth.signOut();
  },

  init() {
    firebase.auth().onAuthStateChanged(user => {
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
