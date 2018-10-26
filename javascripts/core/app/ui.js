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

VTooltip.VTooltip.options.defaultClass = 'general-tooltip';
VTooltip.VTooltip.options.defaultTemplate = '<div role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';

let uiInitialized = false;

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

function updateVue() {
    ui.model.player = player;
}

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
  ui.view.tabs.current = undefined;
  return false;
}

class Tab {
  constructor(component) {
    this._component = component;
  }

  get isOpen() {
    return ui.view.tabs.current === this._component;
  }

  show() {
    ui.view.tabs.current = this._component;
  }
}

class Subtab {
  constructor(id, parent, view, isDefault) {
    this._id = id;
    this._parent = parent;
    this._view = view;
    if (isDefault) {
      this._view.subtab = this._id;
    }
  }

  get isOpen() {
    return this._parent.isOpen && this._view.subtab === this._id;
  }

  show() {
    this._view.subtab = this._id;
    this._parent.show();
  }
}

Tab.dimensions = new Tab("dimensions-tab");
Tab.dimensions.normal = new Subtab("Dimensions", Tab.dimensions, ui.view.tabs.dimensions, true);
Tab.dimensions.infinity = new Subtab("Infinity Dimensions", Tab.dimensions, ui.view.tabs.dimensions);
Tab.dimensions.time = new Subtab("Time Dimensions", Tab.dimensions, ui.view.tabs.dimensions);
Tab.options = new Tab("options-tab");
Tab.statistics = new Tab("statistics-tab");