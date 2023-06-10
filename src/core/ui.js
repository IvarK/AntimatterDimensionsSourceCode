import VTooltip from "v-tooltip";
import VueGtag from "vue-gtag";

import { DEV } from "@/env";

import { useLongPress, useRepeatingClick } from "./longpress";
import { notify } from "./notify";
import { state } from "./ui.init";

import GameUIComponent from "@/components/GameUIComponent";

Vue.mixin({
  computed: {
    $viewModel() {
      return state.view;
    }
  },
  created() {
    if (this.update) {
      this.on$(GAME_EVENT.UPDATE, this.update);
      if (GameUI.initialized) {
        this.update();
      }
    }

    // Following is used to force the recomputation of computed values
    // from this fiddle https://codepen.io/sirlancelot/pen/JBeXeV
    const recomputed = Object.create(null);
    const watchers = this._computedWatchers;

    if (!watchers) return;

    for (const key in watchers) makeRecomputable(watchers[key], key, recomputed);

    this.$recompute = key => recomputed[key] = !recomputed[key];
    Vue.observable(recomputed);
  },
  destroyed() {
    EventHub.ui.offAll(this);
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
      EventHub.ui.on(event, fn, this);
    },
    format(value, places, placesUnder1000) {
      return format(value, places, placesUnder1000);
    },
    formatInt(value) {
      return formatInt(value);
    },
    formatPercents(value, places) {
      return formatPercents(value, places);
    },
    formatRarity(value) {
      return formatRarity(value);
    },
    formatX(value, places, placesUnder1000) {
      return formatX(value, places, placesUnder1000);
    },
    formatPow(value, places, placesUnder1000) {
      return formatPow(value, places, placesUnder1000);
    },
    formatPostBreak(value, places, placesUnder1000) {
      return formatPostBreak(value, places, placesUnder1000);
    },
    pluralize,
    quantify,
    quantifyInt
  }
});

// This function is also from the fiddle above
function makeRecomputable(watcher, key, recomputed) {
  const original = watcher.getter;
  recomputed[key] = true;

  // eslint-disable-next-line no-sequences
  watcher.getter = vm => (recomputed[key], original.call(vm, vm));
}

const ReactivityComplainer = {
  complain() {
    this.checkReactivity(player, "player");
  },
  checkReactivity(obj, path) {
    if (obj === undefined || obj === null) {
      return;
    }
    if (obj.__ob__ !== undefined) {
      throw new Error(`Boi you fukked up - ${path} became REACTIVE (oh shite)`);
    }
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const prop = obj[key];
      if (typeof prop === "object") {
        this.checkReactivity(prop, `${path}.${key}`);
      }
    }
  }
};

export const GameUI = {
  notify,
  events: [],
  flushPromise: undefined,
  initialized: false,
  globalClickListener: null,
  touchDevice: ("ontouchstart" in window ||
    window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0 ||
    (window.DocumentTouch && document instanceof DocumentTouch)),
  dispatch(event, args) {
    const index = this.events.indexOf(event);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
    if (event !== GAME_EVENT.UPDATE) {
      this.events.push([event, args]);
    }
    if (this.flushPromise) return;
    this.flushPromise = Promise.resolve()
      .then(this.flushEvents.bind(this));
  },
  flushEvents() {
    this.flushPromise = undefined;
    if (DEV) {
      if (PerformanceStats.isOn && PerformanceStats.currentBlocks.length > 0) {
        Vue.nextTick(() => PerformanceStats.start("Vue Render"));
        PerformanceStats.start("Vue Update");
      }
    }
    for (const event of this.events) {
      EventHub.ui.dispatch(event[0], event[1]);
    }
    EventHub.ui.dispatch(GAME_EVENT.UPDATE);
    if (DEV) {
      ReactivityComplainer.complain();
      if (PerformanceStats.isOn && PerformanceStats.currentBlocks.length > 0) {
        PerformanceStats.end();
        Vue.nextTick(() => {
          PerformanceStats.end("Vue Render");
          PerformanceStats.end("Frame Time");
          PerformanceStats.render();
        });
      }
    }
    this.events = [];
  },
  update() {
    this.dispatch(GAME_EVENT.UPDATE);
  }
};

export const UIID = (function() {
  let id = 0;
  return { next: () => id++ };
}());

VTooltip.options.defaultClass = "general-tooltip";
VTooltip.options.popover.defaultBaseClass = "general-tooltip";
VTooltip.options.defaultTemplate =
  '<div role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
Vue.use(VTooltip);

(function() {
  const methodStrategy = Vue.config.optionMergeStrategies.methods;
  // eslint-disable-next-line max-params
  Vue.config.optionMergeStrategies.methods = (parentVal, childVal, vm, key) => {
    const result = methodStrategy(parentVal, childVal, vm, key);
    const hasUpdate = val => val && val.update;
    if (!hasUpdate(parentVal) || !hasUpdate(childVal)) return result;
    result.update = function() {
      parentVal.update.call(this);
      childVal.update.call(this);
    };
    return result;
  };
}());

useLongPress(Vue);
useRepeatingClick(Vue);
Vue.use(VueGtag, {
  config: { id: "UA-77268961-1" }
});

export const ui = new Vue({
  el: "#ui",
  components: {
    GameUIComponent
  },
  data: state,
  computed: {
    notation() {
      return Notations.find(this.notationName);
    },
    currentGlyphTooltip() {
      return this.view.tabs.reality.currentGlyphTooltip;
    },
    scrollWindow() {
      return this.view.scrollWindow;
    },
    newUI() {
      return this.view.newUI;
    },
  },
  watch: {
    currentGlyphTooltip(newVal) {
      if (newVal !== -1 && !GameUI.globalClickListener) {
        GameUI.globalClickListener = () => {
          this.view.tabs.reality.currentGlyphTooltip = -1;
          document.removeEventListener("click", GameUI.globalClickListener);
          GameUI.globalClickListener = null;
        };
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
  methods: {
    scroll(t) {
      const now = Date.now();
      if (this.view.scrollWindow) {
        window.scrollBy(0, this.view.scrollWindow * (now - t) / 2);
        setTimeout(() => this.scroll(now), 20);
      }
    }
  },
  render: h => h(GameUIComponent)
});
