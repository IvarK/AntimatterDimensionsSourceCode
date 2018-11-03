Vue.mixin({
  computed: {
    $viewModel: function() {
      return ui.view;
    }
  },
  methods: {
    emitClick: function() {
      this.$emit('click');
    },
    emitInput: function(val) {
      this.$emit('input', val);
    },
    emitClose: function() {
      this.$emit('close');
    },
    on$: function(event, fn) {
      EventHub.global.on(event, fn, this);
    },
    shorten: function(value) {
      return shorten(value);
    },
    shortenCosts: function(value) {
      return shortenCosts(value);
    },
    shortenDimensions: function(value) {
      return shortenDimensions(value);
    },
    shortenMoney: function(value) {
      return shortenMoney(value);
    },
    shortenGlyphEffect: function(value) {
      return shortenGlyphEffect(value);
    },
    shortenMultiplier: function(value) {
      return shortenMultiplier(value);
    }
  },
  created() {
    if (this.update) {
      this.on$(GameEvent.UPDATE, this.update);
    }
  },
  destroyed() {
    EventHub.global.offAll(this);
  }
});

VTooltip.VTooltip.options.defaultClass = 'general-tooltip';
VTooltip.VTooltip.options.defaultTemplate = '<div role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';

ui = new Vue({
  el: '#ui',
  data: ui,
  computed: {
    themeCss: function() {
      return "stylesheets/theme-" + this.view.theme + ".css";
    }
  }
});

ui.addCloudConflict = function(saveId, cloudSave, localSave, onAccept, onLastConflict) {
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

ui.dispatch = function(event) {
  EventHub.global.emit(event);
};

const UIID = function() {
  let id = 0;
  return { next: () => id++ };
}();

const uiInitialized = true;