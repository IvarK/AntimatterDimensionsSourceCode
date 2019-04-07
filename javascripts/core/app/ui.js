Vue.mixin({
  computed: {
    $viewModel() {
      return ui.view;
    }
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    emitClose() {
      this.$emit("close");
    },
    on$(event, fn) {
      EventHub.global.on(event, fn, this);
    },
    shorten(value, places, placesUnder1000) {
      return shorten(value, places, placesUnder1000);
    },
    shortenPostBreak(value, places, placesUnder1000) {
      return shortenPostBreak(value, places, placesUnder1000);
    },
    shortenRateOfChange(value) {
      return shortenRateOfChange(value);
    },
    shortenCosts(value) {
      return shortenCosts(value);
    },
    shortenDimensions(value) {
      return shortenDimensions(value);
    },
    shortenMoney(value) {
      return shortenMoney(value);
    },
    shortenGlyphEffect(value) {
      return shortenGlyphEffect(value);
    },
    shortenMultiplier(value) {
      return shortenMultiplier(value);
    },
    shortenSmallInteger(value) {
      return shortenSmallInteger(value);
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
  globalClickListener: null,
  touchDevice: ("ontouchstart" in window ||
    window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0 ||
    (window.DocumentTouch && document instanceof DocumentTouch)),
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
    },
    currentGlyphTooltip() {
      return this.view.tabs.reality.currentGlyphTooltip;
    },
    scrollWindow() {
      return this.view.scrollWindow;
    }
  },
  methods: {
    scroll(t) {
      const now = Date.now();
      if (this.view.scrollWindow) {
        window.scrollBy(0, this.view.scrollWindow * (now - t) / 2);
        setTimeout(() => this.scroll(now), 20);
      }
    },
  },
  watch: {
    currentGlyphTooltip(newVal) {
      if (newVal !== -1 && !GameUI.globalClickListener) {
        GameUI.globalClickListener = () => {
          this.view.tabs.reality.currentGlyphTooltip = -1;
          document.removeEventListener("click", GameUI.globalClickListener);
          GameUI.globalClickListener = null;
        }
        document.addEventListener("click", GameUI.globalClickListener);
      } else if (newVal === -1 && GameUI.globalClickListener) {
        document.removeEventListener("click", GameUI.globalClickListener);
        GameUI.globalClickListener = null;
      }
    },
    scrollWindow(newVal, oldVal) {
      if (newVal !== 0 && oldVal === 0) {
        this.scroll(Date.now());
      }
    },
  },
});

GameUI.initialized = true;