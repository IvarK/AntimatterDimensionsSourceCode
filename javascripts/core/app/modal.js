"use strict";

class Modal {
  constructor(component, bare = false) {
    this._component = component;
    this._bare = bare;
    this._modalConfig = {};
  }

  show(modalConfig) {
    if (!GameUI.initialized) return;
    this._props = Object.assign({}, modalConfig || {});
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = this;
    // New modals go to the back of the queue (shown last).
    if (!ui.view.modal.queue.includes(this)) ui.view.modal.queue.push(this);
  }

  get isOpen() {
    return ui.view.modal.current === this;
  }

  get component() {
    return this._component;
  }

  get isBare() {
    return this._bare;
  }

  get props() {
    return this._props;
  }

  static hide() {
    if (!GameUI.initialized) return;
    ui.view.modal.queue.shift();
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
    ui.view.modal.cloudConflicts = [];
  }

  static get isOpen() {
    return ui.view.modal.current === this;
  }
}

class ChallengeConfirmationModal extends Modal {
  show(id) {
    this.id = id;
    super.show();
  }
}

Modal.h2p = new Modal("modal-h2p");
Modal.shortcuts = new Modal("modal-shortcuts");
Modal.newsOptions = new Modal("modal-news-options");
Modal.animationOptions = new Modal("modal-animation-options");
Modal.confirmationOptions = new Modal("modal-confirmation-options");
Modal.infoDisplayOptions = new Modal("modal-info-display-options");
Modal.loadGame = new Modal("modal-load-game");
Modal.uiChoice = new Modal("modal-ui-choice");
Modal.import = new Modal("modal-import");
Modal.shop = new Modal("modal-std-store");
Modal.importTree = new Modal("modal-import-tree");
Modal.editTree = new Modal("modal-edit-tree");
Modal.deleteCompanion = new Modal("modal-delete-companion");
Modal.enslavedHints = new Modal("modal-enslaved-hints");
Modal.realityGlyph = new Modal("modal-reality-glyph-creation");
Modal.singularityMilestones = new Modal("singularity-milestones-modal");
Modal.startEternityChallenge = new ChallengeConfirmationModal("modal-start-eternity-challenge");
Modal.startInfinityChallenge = new ChallengeConfirmationModal("modal-start-infinity-challenge");
Modal.startNormalChallenge = new ChallengeConfirmationModal("modal-start-normal-challenge");
Modal.celestialQuote = new class extends Modal {
  show(celestial, lines) {
    if (!GameUI.initialized) return;
    const newLines = lines.map(l => ({
      celestial,
      line: l,
      showName: !l.startsWith("*")
    }));
    if (ui.view.modal.current === this) {
      // This shouldn't come up often, but in case we do have a pile of quotes
      // being shown in a row:
      this.lines = this.lines.concat(newLines);
      return;
    }
    super.show();
    this.lines = newLines;
  }
}("modal-celestial-quote", true);

Modal.cloudSaveConflict = new Modal("modal-cloud-save-conflict");
Modal.cloudLoadConflict = new Modal("modal-cloud-load-conflict");
// eslint-disable-next-line max-params
Modal.addCloudConflict = function(saveId, cloudSave, localSave, onAccept, onLastConflict) {
  ui.view.modal.cloudConflicts.push({
    saveId,
    cloud: getSaveInfo(cloudSave),
    local: getSaveInfo(localSave),
    onAccept,
    onLastConflict
  });

  function getSaveInfo(save) {
    return {
      infinities: save ? save.infinitied : 0,
      eternities: save ? save.eternities : 0
    };
  }
};

Modal.message = new class extends Modal {
  show(text, callback, closeButton = false) {
    if (!GameUI.initialized) return;
    super.show();
    if (this.message === undefined) {
      this.message = text;
      this.callback = callback;
      this.closeButton = closeButton;
    }
    if (!this.queue) this.queue = [];
    this.queue.push({ text, callback, closeButton });
    // Sometimes we have stacked messages that get lost, since we don't have stacking modal system.
    // TODO: remove this console.log
    // eslint-disable-next-line no-console
    console.log(`Modal message: ${text}`);
  }

  hide() {
    Modal.hide();
    this.queue.shift();
    if (this.queue && this.queue.length === 0) this.message = undefined;
    else {
      this.message = this.queue[0].text;
      this.callback = this.queue[0].callback;
      this.closeButton = this.queue[0].closeButton;
    }
  }
}("modal-message");

Modal.confirmation = new class extends Modal {
  show(text, callback, closeButton = false) {
    if (!GameUI.initialized) return;
    super.show();
    if (this.message === undefined) {
      this.message = text;
      this.callback = callback;
    }
    if (!this.queue) this.queue = [];
    this.queue.push({ text, callback, closeButton });
    // Sometimes we have stacked messages that get lost, since we don't have stacking modal system.
    // TODO: remove this console.log
    // eslint-disable-next-line no-console
    console.log(`Modal message: ${text}`);
  }

  hide() {
    Modal.hide();
    this.queue.shift();
    if (this.queue && this.queue.length === 0) this.message = undefined;
    else {
      this.message = this.queue[0].text;
      this.callback = this.queue[0].callback;
      this.closeButton = this.queue[0].closeButton;
    }
  }
}("modal-confirmation");
