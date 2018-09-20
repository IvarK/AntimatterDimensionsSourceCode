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

var uiInitialized = false;

function initVue() {
    ui = new Vue({
        el: '#ui',
        data: ui,
        methods: {
            hideModal: function() {
                Modal.hide();
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
                return "stylesheets/theme-" + this.model.player.options.theme + ".css";
            }
        }
    });
    uiInitialized = true;
}

initVue();

var updateVue = function () {
    ui.model.player = player;
};