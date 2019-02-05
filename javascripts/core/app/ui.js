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
    shorten: function(value, places, placesUnder1000) {
      return shorten(value, places, placesUnder1000);
    },
    shortenPostBreak: function(value, places, placesUnder1000) {
      return shortenPostBreak(value, places, placesUnder1000);
    },
    shortenRateOfChange: function(value) {
      return shortenRateOfChange(value);
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
      if (GameUI.initialized) {
        this.update();
      }
    }
  },
  destroyed() {
    EventHub.global.offAll(this);
  }
});

Vue.filter("pluralize", function (value, amount, plural) {
  if (value === undefined || amount === undefined)
    throw "Arguments must be defined";
  let isSingular = true;
  if (typeof amount === "number") {
    isSingular = amount === 1;
  }
  else if (amount instanceof Decimal) {
    isSingular = amount.eq(1);
  }
  else
    throw "Amount must be either a number or Decimal";
  return isSingular ? value : (plural !== undefined ? plural : value + "s");
});

const GameUI = {
  events: [],
  flushPromise: undefined,
  initialized: false,
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
    if (PerformanceStats.isOn && PerformanceStats.currentBlocks.length > 0) {
      Vue.nextTick(() => PerformanceStats.start("Vue Render"));
      PerformanceStats.start("Vue Update");
    }
    for (let event of this.events) {
      EventHub.global.emit(event);
    }
    EventHub.global.emit(GameEvent.UPDATE);
    if (PerformanceStats.isOn && PerformanceStats.currentBlocks.length > 0) {
      PerformanceStats.end();
      Vue.nextTick(() => {
        PerformanceStats.end("Vue Render");
        PerformanceStats.end("Frame Time");
        PerformanceStats.render();
      });
    }
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

(function() {
  const vTooltip = VTooltip.VTooltip.options;
  vTooltip.defaultClass = 'general-tooltip';
  vTooltip.popover.defaultBaseClass = 'general-tooltip';
  vTooltip.defaultTemplate = '<div role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
}());

ui = new Vue({
  el: '#ui',
  data: ui,
  computed: {
    themeCss() {
      return "stylesheets/theme-" + this.view.theme + ".css";
    },
    notation() {
      return Notation.find(this.notationName);
    }
  }
});

GameUI.initialized = true;