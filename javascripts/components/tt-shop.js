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
      },
      showST: false,
      STamount: 0
    };
  },
  computed: {
    theoremAmountDisplay() {
      const theorems = this.theoremAmount;
      if (theorems.gt(99999)) {
        return format(theorems, 2, 1);
      }
      return Math.floor(theorems.toNumber()).toFixed(0);
    },
    theoremNoun() {
      return this.theoremAmount.floor().eq(1) ? "Theorem" : "Theorems";
    },
    spaceTheoremNoun() {
      return Math.floor(this.STamount) === 1 ? "Theorem" : "Theorems";
    },
    minimized() {
      return this.minimizeAvailable && this.shopMinimized;
    },
    minimizeArrowStyle() {
      return {
        transform: this.minimized ? "rotateX(180deg)" : "",
      };
    },
    saveLoadText() {
      return this.$viewModel.shiftDown ? "save:" : "load:";
    },
    autobuyerText() {
      return this.ttAutobuyerOn ? "ON" : "OFF";
    }
  },
  methods: {
    minimize() {
      player.timestudy.shopMinimized = !player.timestudy.shopMinimized;
    },
    formatAM(am) {
      return `${format(am)} AM`;
    },
    buyWithAM() {
      TimeTheorems.buyWithAntimatter();
    },
    formatIP(ip) {
      return `${format(ip)} IP`;
    },
    buyWithIP() {
      TimeTheorems.buyWithIP();
    },
    formatEP(ep) {
      return `${format(ep, 2, 0)} EP`;
    },
    buyWithEP() {
      TimeTheorems.buyWithEP();
    },
    buyMaxTheorems() {
      TimeTheorems.buyMax();
    },
    update() {
      this.theoremAmount.copyFrom(player.timestudy.theorem);
      this.shopMinimized = player.timestudy.shopMinimized;
      this.minimizeAvailable = DilationUpgrade.ttGenerator.isBought;
      this.hasTTAutobuyer = Perk.autobuyerTT1.isBought;
      this.ttAutobuyerOn = player.ttbuyer;
      const budget = this.budget;
      budget.am.copyFrom(player.antimatter);
      budget.ip.copyFrom(player.infinityPoints);
      budget.ep.copyFrom(player.eternityPoints);
      const costs = this.costs;
      costs.am.copyFrom(player.timestudy.amcost);
      costs.ip.copyFrom(player.timestudy.ipcost);
      costs.ep.copyFrom(player.timestudy.epcost);
      this.showST = V.availableST > 0;
      this.STamount = V.availableST;
    },
    toggleTTAutobuyer() {
      player.ttbuyer = !player.ttbuyer;
    }
  },
  template: `
    <div id="TTbuttons">
      <div class="ttshop-container ttshop-background">
        <div data-role="page" class="ttbuttons-row ttbuttons-top-row">
          <p id="timetheorems">
            <span class="c-tt-amount">{{ theoremAmountDisplay }}</span> Time {{ theoremNoun }}
            <span v-if="showST"><br>{{ STamount }} Space {{ spaceTheoremNoun }}</span>
          </p>
          <div style="display: flex; flex-direction: row; align-items: center;">
            <span class="c-ttshop__save-load-text">{{ saveLoadText }}</span>
            <tt-save-load-button v-for="saveslot in 6" :key="saveslot" :saveslot="saveslot"></tt-save-load-button>
          </div>
        </div>
        <div class="ttbuttons-row" v-if="!minimized">
          <tt-buy-button :budget="budget.am" :cost="costs.am" :formatCost="formatAM" :action="buyWithAM"/>
          <tt-buy-button :budget="budget.ip" :cost="costs.ip" :formatCost="formatIP" :action="buyWithIP"/>
          <tt-buy-button :budget="budget.ep" :cost="costs.ep" :formatCost="formatEP" :action="buyWithEP"/>
          <div class="l-tt-buy-max-vbox">
            <button v-if="!minimized" class="o-tt-top-row-button c-tt-buy-button c-tt-buy-button--unlocked"
              @click="buyMaxTheorems">
              Buy max
            </button>
            <button v-if="!minimized && hasTTAutobuyer" class="o-tt-autobuyer-button c-tt-buy-button c-tt-buy-button--unlocked"
              @click="toggleTTAutobuyer">
              Auto: {{autobuyerText}}
            </button>
          </div>
        </div>
      </div>
      <button v-if="minimizeAvailable" class="ttshop-minimize-btn ttshop-background" @click="minimize">
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
      if (this.preset.studies) {
        importStudyTree(this.preset.studies);
      } else {
        Modal.message.show("This time study list currently contains no studies.");
      }
    },
    handleExport() {
      this.hideContextMenu();
      copyToClipboardAndNotify(this.preset.studies);
    },
    edit() {
      const newValue = prompt("Edit time study list", this.preset.studies);
      this.hideContextMenu();
      if (newValue !== null) this.preset.studies = newValue;
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
  props: ["budget", "cost", "formatCost", "action"],
  template: `
    <button class="l-tt-buy-button c-tt-buy-button"
            :class="enabledClass"
            @click="action">
      {{ formatCost(cost) }}
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
