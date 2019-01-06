var Modal = function Modal(component) {
    this.show = function() {
        if (!uiInitialized) return;
        ui.view.modal.current = component;
    };

};

Modal.animationOptions = new Modal("modal-animation-options");
Modal.confirmationOptions = new Modal("modal-confirmation-options");
Modal.loadGame = new Modal("modal-load-game");
Modal.cloudSaveConflict = new Modal("modal-cloud-save-conflict");
Modal.cloudLoadConflict = new Modal("modal-cloud-load-conflict");
Modal.import = new Modal("modal-import");
Modal.message = new Modal("modal-message");
Modal.message.show = function(text, callback, closeButton = false) {
    if (!uiInitialized) return;
    ui.view.modal.message = text;
    ui.view.modal.callback = callback;
    ui.view.modal.closeButton = closeButton;
    ui.view.modal.current = "modal-message";
};

Modal.hide = function() {
    if (!uiInitialized) return;
    ui.view.modal.current = undefined;
    ui.view.modal.cloudConflicts = [];
};