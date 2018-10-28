class Tab {
  constructor(component) {
    this._component = component;
  }

  get isOpen() {
    return ui.view.tabs.current === this._component;
  }

  show() {
    hideLegacyTabs();
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
  if (tab === 'dimensions') {
    Tab.dimensions.show();
    return true;
  }
  ui.view.tabs.current = undefined;
  return false;
}