"use strict";

class Modal {
  constructor(component, bare = false) {
    this._component = component;
    this._bare = bare;
  }

  show() {
    if (!GameUI.initialized) return;
    ui.view.modal.current = this;
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

  static hide() {
    if (!GameUI.initialized) return;
    ui.view.modal.current = undefined;
    ui.view.modal.cloudConflicts = [];
  }

  static get isOpen() {
    return ui.view.modal.current !== undefined;
  }
}

Modal.h2p = new Modal("modal-h2p");
Modal.shortcuts = new Modal("modal-shortcuts");
Modal.animationOptions = new Modal("modal-animation-options");
Modal.confirmationOptions = new Modal("modal-confirmation-options");
Modal.infoDisplayOptions = new Modal("modal-info-display-options");
Modal.loadGame = new Modal("modal-load-game");
Modal.uiChoice = new Modal("modal-ui-choice");
Modal.import = new Modal("modal-import");
Modal.importTree = new Modal("modal-import-tree");
Modal.realityGlyph = new Modal("modal-reality-glyph-creation");
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
    ui.view.modal.current = this;
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
    ui.view.modal.current = this;
    this.message = text;
    this.callback = callback;
    this.closeButton = closeButton;
    // Sometimes we have stacked messages that get lost, since we don't have stacking modal system.
    // TODO: remove this console.log
    // eslint-disable-next-line no-console
    console.log(`Modal mesasge: ${text}`);
  }
}("modal-message");
