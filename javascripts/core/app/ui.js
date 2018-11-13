Vue.mixin({
  computed: {
    $viewModel: function() {
      return ui.view;
    },
    formatter: function() {
      return {
        shorten: this.shorten,
        shortenCosts: this.shortenCosts,
        shortenDimensions: this.shortenDimensions,
        shortenMoney: this.shortenMoney,
        shortenGlyphEffect: this.shortenGlyphEffect,
        shortenMultiplier: this.shortenMultiplier
      };
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
      this.update();
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

const GameUI = {
  events: [],
  flushPromise: undefined,
  dispatch(event) {
    const index = this.events.indexOf(event);
    if (index !== -1) {
      this.events = this.events.splice(index, 1);
    }
    if (event !== GameEvent.UPDATE) {
      this.events.push(event);
    }
    if (this.flushPromise) return;
    this.flushPromise = Promise.resolve()
      .then(this.flushEvents.bind(this));
  },
  flushEvents() {
    this.flushPromise = undefined;
    for (let event of this.events) {
      EventHub.global.emit(event);
    }
    EventHub.global.emit(GameEvent.UPDATE);
    this.events = [];
  },
  update() {
    this.dispatch(GameEvent.UPDATE);
  }
};

const UIID = function() {
  let id = 0;
  return { next: () => id++ };
}();

const uiInitialized = true;