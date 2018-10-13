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

// small hack until Vue migration is complete
function tryShowtab(tab) {
  if (tab === 'options') {
    Tab.options.show();
    return true;
  }
  if (tab === 'statistics') {
    Tab.statistics.show();
    return true;
  }
  if (tab === 'dimensionsvue') {
    Tab.dimensions.show();
    return true;
  }
  ui.view.tab.current = undefined;
  return false;
}

var Tab = function Tab(component) {
  this.show = function() {
    ui.view.tab.current = component;
  };
  this.isCurrent = function() {
    return ui.view.tab.current === component;
  };
};

Tab.options = new Tab("options-tab");
Tab.statistics = new Tab("statistics-tab");
Tab.dimensions = new Tab("dimensions-tab");