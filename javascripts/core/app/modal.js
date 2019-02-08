class Modal {
  constructor(component) {
    this._component = component;
  }

  show() {
    if (!GameUI.initialized) return;
    ui.view.modal.current = this._component;
  }

  static hide() {
    if (!GameUI.initialized) return;
    ui.view.modal.current = undefined;
    ui.view.modal.cloudConflicts = [];
  }

  static isOpen() {
    return ui.view.modal.current !== undefined;
  }
}

Modal.animationOptions = new Modal("modal-animation-options");
Modal.confirmationOptions = new Modal("modal-confirmation-options");
Modal.loadGame = new Modal("modal-load-game");
Modal.import = new Modal("modal-import");

Modal.cloudSaveConflict = new Modal("modal-cloud-save-conflict");
Modal.cloudLoadConflict = new Modal("modal-cloud-load-conflict");
Modal.addCloudConflict = function(saveId, cloudSave, localSave, onAccept, onLastConflict) {
  ui.view.modal.cloudConflicts.push({
    saveId: saveId,
    cloud: getSaveInfo(cloudSave),
    local: getSaveInfo(localSave),
    onAccept: onAccept,
    onLastConflict: onLastConflict
  });

  function getSaveInfo(save) {
    return {
      infinities: save ? save.infinitied : 0,
      eternities: save ? save.eternities : 0
    };
  }
};

Modal.message = new Modal("modal-message");
Modal.message.show = function(text, callback, closeButton = false) {
  if (!GameUI.initialized) return;
  ui.view.modal.message = text;
  ui.view.modal.callback = callback;
  ui.view.modal.closeButton = closeButton;
  ui.view.modal.current = "modal-message";
};
