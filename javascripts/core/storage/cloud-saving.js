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

  get loggedIn() {
    return this.user !== null;
  },

  async login() {
    await this.auth.signInWithPopup(this.provider);
  },

  newestSave(first, second) {
    const getSaveInfo = save => {
      const prestiges = { infinities: new Decimal(0), eternities: new Decimal(0), realities: 0 };
      if (!save) return prestiges;
      prestiges.infinities.copyFrom(new Decimal(save.infinities));
      prestiges.eternities.copyFrom(new Decimal(save.eternities));
      prestiges.realities = save.realities;
      return prestiges;
    };
    const firstInfo = getSaveInfo(first);
    const secondInfo = getSaveInfo(second);
    if (
      firstInfo.realities === secondInfo.realities && 
      firstInfo.eternities.eq(secondInfo.eternities) && 
      firstInfo.infinities.eq(secondInfo.infinities)
    ) {
      return undefined;
    }

    if (firstInfo.realities > secondInfo.realities) {
      return first;
    }

    if (firstInfo.eternities.gt(secondInfo.eternities)) {
      return first;
    }

    if (firstInfo.infinities.gt(secondInfo.infinities)) {
      return first;
    }

    return second;
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
      for (let i = 0; i < 3; i++) {
        const saveId = i;
        const cloudSave = root.saves[saveId];
        const localSave = GameStorage.saves[saveId];
        const newestSaveCheck = this.newestSave(cloudSave, localSave);
        let isConflicted = false;

        // eslint-disable-next-line no-loop-func
        const overwriteCloudSave = () => {
          root.saves[saveId] = GameStorage.saves[saveId];
        };

        const sendCloudSave = () => {
          this.save();
        };

        if (newestSaveCheck === cloudSave && cloudSave && localSave) {
          isConflicted = true;
          Modal.addCloudConflict(saveId, cloudSave, localSave, overwriteCloudSave, sendCloudSave);
          Modal.cloudSaveConflict.show();
        } else {
          overwriteCloudSave();
        }

        if (!isConflicted) {
          sendCloudSave();
        }
      }
    }
  },

  save() {
    if (!this.user) return;
    if (GlyphSelection.active || ui.$viewModel.modal.progressBar !== undefined) return;
    const root = {
      current: GameStorage.currentSlot,
      saves: GameStorage.saves,
    };

    this.db.ref(`users/${this.user.id}/web`).set(GameSaveSerializer.serialize(root));
    GameUI.notify.info(`Game saved to cloud with user ${this.user.displayName}`);
  },

  async loadCheck() {
    const save = await this.load();
    if (save === null) {
      GameUI.notify.info(`No cloud save for user ${this.user.displayName}`);
    } else {
      const root = GameSaveSerializer.deserialize(save);
      for (let i = 0; i < 3; i++) {
        const saveId = i;
        const cloudSave = root.saves[saveId];
        const localSave = GameStorage.saves[saveId];
        const newestSaveCheck = this.newestSave(cloudSave, localSave);

        // eslint-disable-next-line no-loop-func
        const overwriteLocalSave = () => {
          GameStorage.overwriteSlot(saveId, cloudSave);
          GameUI.notify.info(`Cloud save loaded for user ${this.user.displayName}`);
        };

        if (newestSaveCheck === localSave && cloudSave && localSave) {
          Modal.addCloudConflict(saveId, cloudSave, localSave, overwriteLocalSave);
          Modal.cloudLoadConflict.show();
        } else {
          overwriteLocalSave();
        }
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
