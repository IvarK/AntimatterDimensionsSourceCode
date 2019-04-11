Vue.component("tt-shop", {
  data() {
    return {
      theoremAmount: new Decimal(0),
      shopMinimized: false,
      minimizeAvailable: false,
      hasTTAutobuyer: false,
      ttAutobuyerOn: false,
      budget: {
        am: new Decimal(0),
        ip: new Decimal(0),
        ep: new Decimal(0)
      },
      costs: {
        am: new Decimal(0),
        ip: new Decimal(0),
        ep: new Decimal(0)
      }
    };
  },
  computed: {
    theoremAmountDisplay() {
      const theorems = this.theoremAmount;
      if (theorems.gt(99999)) {
        return this.shortenMoney(theorems);
      }
      return Math.floor(theorems.toNumber()).toFixed(0);
    },
    theoremNoun() {
      return this.theoremAmount.eq(1) ? "Theorem" : "Theorems";
    },
    minimized() {
      return this.minimizeAvailable && this.shopMinimized;
    },
    minimizeArrowStyle() {
      return {
        transform: this.minimized ? "rotateX(180deg)" : "",
      };
    },
    containerStyle() {
      return {
        // Transform: this.minimized ? "translateY(73px)" : "",
        width: this.minimized ? "440px" : "555px"
      };
    },
    autobuyerText() {
      return this.ttAutobuyerOn ? "Auto: ON" : "Auto: OFF";
    }
  },
  methods: {
    minimize() {
      player.timestudy.shopMinimized = !player.timestudy.shopMinimized;
    },
    formatAM(am) {
      return this.shortenCosts(am) + " AM";
    },
    buyWithAM() {
      buyWithAntimatter();
    },
    formatIP(ip) {
      return this.shortenCosts(ip) + " IP";
    },
    buyWithIP() {
      buyWithIP();
    },
    formatEP(ep) {
      return this.shortenDimensions(ep) + " EP";
    },
    buyWithEP() {
      buyWithEP();
    },
    update() {
      this.theoremAmount = player.timestudy.theorem;
      this.shopMinimized = player.timestudy.shopMinimized;
      this.minimizeAvailable = DilationUpgrade.ttGenerator.isBought;
      this.hasTTAutobuyer = Perk.autobuyerTT1.isBought;
      this.ttAutobuyerOn = player.ttbuyer;
      const budget = this.budget;
      budget.am.copyFrom(player.money);
      budget.ip.copyFrom(player.infinityPoints);
      budget.ep.copyFrom(player.eternityPoints);
      const costs = this.costs;
      costs.am.copyFrom(player.timestudy.amcost);
      costs.ip.copyFrom(player.timestudy.ipcost);
      costs.ep.copyFrom(player.timestudy.epcost);
    },
    toggleTTAutobuyer() {
      player.ttbuyer = !player.ttbuyer;
    }
  },
  template:
    `<div id="TTbuttons">
      <div id="theorembuybackground" class="ttshop-container" :style="containerStyle">
        <div data-role="page" class="ttbuttons-row ttbuttons-top-row">
          <button
            class="o-tt-buy-max-button c-tt-buy-button c-tt-buy-button--unlocked"
            style="width:130px; white-space:nowrap;"
            v-if="!minimized"
            onclick="maxTheorems()"
          >
            Buy max
          </button>
          <button
            v-if="hasTTAutobuyer"
            @click="toggleTTAutobuyer"
            class="o-tt-autobuyer-button c-tt-buy-button c-tt-buy-button--unlocked"
            id="ttautobuyer"
          >
            {{autobuyerText}}
          </button>
          <p id="timetheorems">
            <span class="c-tt-amount">{{ theoremAmountDisplay }}</span> Time {{ theoremNoun }}.
          </p>
          <div style="display: flex; flex-direction: row; align-items: center">
            <p id="studytreeloadsavetext">{{ $viewModel.shiftDown ? 'save:' : 'load:' }}</p>
            <tt-save-load-button v-for="saveslot in 3" :key="saveslot" :saveslot="saveslot"></tt-save-load-button>
          </div>
        </div>
        <div class="ttbuttons-row" v-if="!minimized">
          <tt-buy-button :budget="budget.am" :cost="costs.am" :format="formatAM" :action="buyWithAM"/>
          <tt-buy-button :budget="budget.ip" :cost="costs.ip" :format="formatIP" :action="buyWithIP"/>
          <tt-buy-button :budget="budget.ep" :cost="costs.ep" :format="formatEP" :action="buyWithEP"/>
        </div>
      </div>
      <button v-if="minimizeAvailable" id="theorembuybackground" class="ttshop-minimize-btn" @click="minimize">
        <span id="minimizeArrow" :style="minimizeArrowStyle">▼</span>
      </button>
    </div>`
});

Vue.component("tt-save-load-button", {
  props: {
    saveslot: Number
  },
  data: () => ({
      msg: "Hold to save",
      showTip: false,
    }),
  computed: {
    tooltip() {
      return {
        content: this.msg,
        placement: "top",
        show: this.showTip,
        trigger: "manual"
      };
    },
    listeners() {
      return Object.assign({}, this.$listeners, {
        touchstart: () => this.showTip = true,
        mouseover: () => this.showTip = true,
        mouseout: () => this.resetTip(),
        touchend: () => this.resetTip(),
        touchcancel: () => this.resetTip(),
        touchmove: e => {
          e.preventDefault();
          const t = e.changedTouches[0];
          if (this.$el !== document.elementFromPoint(t.pageX, t.pageY)) {
            this.resetTip();
          }
        },
        "longpress": () => {
          studyTreeSaveButton(this.saveslot, true);
          this.msg = "Saved";
        },
        "longpressclick": () => {
          studyTreeSaveButton(this.saveslot, false);
        }
      });
    }
  },
  template:
    `<button class="timetheorembtn tt-save-load-btn" v-on="listeners"
             v-tooltip="tooltip" v-long-press="{ delay: 1000 }">{{saveslot}}</button>`,
  methods: {
    resetTip() {
      this.msg = "Hold to save";
      this.showTip = false;
    }
  },
});

Vue.component("tt-buy-button", {
  props: ["budget", "cost", "format", "action"],
  template: `
    <button :class="['l-tt-buy-button', 'c-tt-buy-button', enabledClass]"
            @click="action">
      {{ format(cost) }}
    </button>`,
  computed: {
    isEnabled() {
      return this.budget.gte(this.cost);
    },
    enabledClass() {
      return this.isEnabled ? "c-tt-buy-button--unlocked" : "c-tt-buy-button--locked";
    }
  }
});