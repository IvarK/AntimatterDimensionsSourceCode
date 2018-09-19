Vue.mixin({
    methods: {
        emitClick: function() {
            this.$emit('click');
        },
        emitInput: function(val) {
            this.$emit('input', val);
        },
        emitClose: function() {
            this.$emit('close');
        }
    }
});

ui = new Vue({
    el: '#ui',
    data: ui,
    methods: {
        showModal: function(name) {
            ui.view.modal.current = Modal[name] ? Modal[name] : name;
        },
        hideModal: function() {
            ui.view.modal.current = undefined;
            ui.view.modal.cloudConflicts = [];
        },
        showModalMessage: function(message) {
            ui.view.modal.message = message;
            ui.showModal(Modal.message);
        },
        addCloudConflict: function(saveId, cloudSave, localSave, onAccept, onLastConflict) {
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
                }
            }
        }
    },
    computed: {
        themeCss: function() {
            return "stylesheets/theme-"+ this.model.player.options.theme +".css";
        }
    }
});

var Modal = {
    animationOptions: "modal-animation-options",
    confirmationOptions: "modal-confirmation-options",
    loadGame: "modal-load-game",
    cloudSaveConflict: "modal-cloud-save-conflict",
    cloudLoadConflict: "modal-cloud-load-conflict",
    message: "modal-message"
};

var updateVue = function () {
    ui.model.player = player;
};