"use strict";

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
    saveLoadText() {
      return this.$viewModel.shiftDown ? "save:" : "load:";
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
  template: `
    <div id="TTbuttons">
      <div id="theorembuybackground" class="ttshop-container" :style="containerStyle">
        <div data-role="page" class="ttbuttons-row ttbuttons-top-row">
          <p id="timetheorems">
            <span class="c-tt-amount">{{ theoremAmountDisplay }}</span> Time {{ theoremNoun }}
          </p>
          <div style="display: flex; flex-direction: row; align-items: center;">
            <span class="c-ttshop__save-load-text">{{ saveLoadText }}</span>
            <tt-save-load-button v-for="saveslot in 6" :key="saveslot" :saveslot="saveslot"></tt-save-load-button>
          </div>
        </div>
        <div class="ttbuttons-row" v-if="!minimized">
          <tt-buy-button :budget="budget.am" :cost="costs.am" :format="formatAM" :action="buyWithAM"/>
          <tt-buy-button :budget="budget.ip" :cost="costs.ip" :format="formatIP" :action="buyWithIP"/>
          <tt-buy-button :budget="budget.ep" :cost="costs.ep" :format="formatEP" :action="buyWithEP"/>
          <div class="l-tt-buy-max-vbox">
            <button v-if="!minimized" class="o-tt-top-row-button c-tt-buy-button c-tt-buy-button--unlocked"
              onclick="maxTheorems()">
              Buy max
            </button>
            <button v-if="!minimized" class="o-tt-autobuyer-button c-tt-buy-button c-tt-buy-button--unlocked"
              onclick="maxTheorems()">
              Auto: ON
            </button>
          </div>
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
  data() {
    return {
      name: player.timestudy.presets[this.saveslot - 1].name,
    };
  },
  computed: {
    preset() {
      return player.timestudy.presets[this.saveslot - 1];
    },
    displayName() {
      return this.name === "" ? this.saveslot : this.name;
    }
  },
  methods: {
    nicknameBlur(event) {
      this.preset.name = event.target.value.slice(0, 4);
      this.name = this.preset.name;
    },
    hideContextMenu() {
      this.$viewModel.currentContextMenu = null;
    },
    save() {
      this.hideContextMenu();
      this.preset.studies = studyTreeExportString();
    },
    load() {
      this.hideContextMenu();
      if (this.preset.studies !== "") importStudyTree(this.preset.studies);
    },
    handleExport() {
      this.hideContextMenu();
      copyToClipboardAndNotify(this.preset.studies);
    },
    edit() {
      const newValue = prompt("Edit time study list", this.preset.studies);
      this.hideContextMenu();
      this.preset.studies = newValue;
    }
  },
  template: `
  <hover-menu class="l-tt-save-load-btn__wrapper">
    <button slot="object"
            class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked"
            @click.shift.exact="save"
            @click.exact="load">
      {{displayName}}
    </button>
    <div slot="menu"
         class="l-tt-save-load-btn__menu c-tt-save-load-btn__menu">
      <input type="text" size="4" maxlength="4"
             class="l-tt-save-load-btn__menu-rename c-tt-save-load-btn__menu-rename"
             :value="name"
             ach-tooltip="Set a custom name (up to 4 characters)"
             @keyup.esc="hideContextMenu"
             @blur="nicknameBlur" />
      <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="edit">Edit</div>
      <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="handleExport">Export</div>
      <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="save">Save</div>
      <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="load">Load</div>
    </div>
  </hover-menu>
`,
});

Vue.component("tt-buy-button", {
  props: ["budget", "cost", "format", "action"],
  template: `
    <button class="l-tt-buy-button c-tt-buy-button"
            :class="enabledClass"
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