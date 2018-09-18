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
        hideModal: function () {
            ui.view.modal.current = undefined;
            ui.view.modal.cloudConflicts = [];
        },
        addCloudConflict: function(saveId, cloudSave, localSave, callback) {
            ui.view.modal.cloudConflicts.push({
                saveId: saveId,
                cloud: getSaveInfo(cloudSave),
                local: getSaveInfo(localSave),
                callback: callback,
                // Use closure here so Vue doesn't bother to convert save to reactive object
                getCloudSave: function() {
                    return cloudSave;
                }
            });

            function getSaveInfo(save) {
                return {
                    infinities: save ? save.infinitied : 0,
                    eternities: save ? save.eternities : 0
                }
            }
        }
    }
});

var Modal = {
    animationOptions: "modal-animation-options",
    confirmationOptions: "modal-confirmation-options",
    loadGame: "modal-load-game",
    cloudLoadConflict: "modal-cloud-load-conflict"
};

var updateVue = function () {
    ui.model.player = player;
};