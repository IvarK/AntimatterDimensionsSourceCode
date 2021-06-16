"use strict";

Vue.component("tt-shop", {
  data() {
    return {
      theoremAmount: new Decimal(0),
      theoremGeneration: new Decimal(0),
      totalTimeTheorems: new Decimal(0),
      shopMinimized: false,
      minimizeAvailable: false,
      hasTTAutobuyer: false,
      isAutobuyerOn: false,
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
      STamount: 0,
      showTTGen: false
    };
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.timeTheorem.isActive = newValue;
    }
  },
  computed: {
    minimized() {
      return this.minimizeAvailable && this.shopMinimized;
    },
    formattedTheorems() {
      if (this.theoremAmount.gte(1e6)) {
        return format(this.theoremAmount, 2);
      }
      if (!(Teresa.isRunning || Enslaved.isRunning) &&
        getAdjustedGlyphEffect("dilationTTgen") > 0 && !DilationUpgrade.ttGenerator.isBought) {
        return formatFloat(this.theoremAmount, 2);
      }
      return formatInt(this.theoremAmount);
    },
    TTgenRateText() {
      if (this.theoremGeneration.lt(1 / 3600)) {
        return `one TT every ${TimeSpan.fromSeconds(
          this.theoremGeneration.reciprocal().toNumber()).toStringShort(false)}`;
      }
      if (this.theoremGeneration.lt(0.1)) {
        return `${format(this.theoremGeneration.times(3600), 2, 2)} TT/hour`;
      }
      return `${format(this.theoremGeneration, 2, 2)} TT/sec`;
    },
    totalTimeTheoremText() {
      return `${format(this.totalTimeTheorems, 2, 2)} total Time Theorems`;
    },
    minimizeArrowStyle() {
      return {
        transform: this.minimized ? "rotateX(180deg)" : "",
      };
    },
    saveLoadText() {
      return this.$viewModel.shiftDown ? "save:" : "load:";
    },
  },
  methods: {
    minimize() {
      player.timestudy.shopMinimized = !player.timestudy.shopMinimized;
    },
    formatAM(am) {
      return `${format(am)} AM`;
    },
    buyWithAM() {
      TimeTheorems.buyOne(false, "am");
    },
    formatIP(ip) {
      return `${format(ip)} IP`;
    },
    buyWithIP() {
      TimeTheorems.buyOne(false, "ip");
    },
    formatEP(ep) {
      return `${format(ep, 2, 0)} EP`;
    },
    buyWithEP() {
      TimeTheorems.buyOne(false, "ep");
    },
    buyMaxTheorems() {
      TimeTheorems.buyMax();
    },
    update() {
      this.theoremAmount.copyFrom(Currency.timeTheorems);
      this.theoremGeneration.copyFrom(getTTPerSecond().times(getGameSpeedupFactor()));
      this.totalTimeTheorems.copyFrom(Currency.timeTheorems.max);
      this.shopMinimized = player.timestudy.shopMinimized;
      this.hasTTAutobuyer = Autobuyer.timeTheorem.isUnlocked;
      this.isAutobuyerOn = Autobuyer.timeTheorem.isActive;
      this.minimizeAvailable = DilationUpgrade.ttGenerator.isBought || this.hasTTAutobuyer;
      const budget = this.budget;
      budget.am.copyFrom(TimeTheoremPurchaseType.am.currency);
      budget.ip.copyFrom(TimeTheoremPurchaseType.ip.currency);
      budget.ep.copyFrom(TimeTheoremPurchaseType.ep.currency);
      const costs = this.costs;
      costs.am.copyFrom(TimeTheoremPurchaseType.am.cost);
      costs.ip.copyFrom(TimeTheoremPurchaseType.ip.cost);
      costs.ep.copyFrom(TimeTheoremPurchaseType.ep.cost);
      this.showST = V.spaceTheorems > 0;
      this.STamount = V.availableST;
      this.showTTGen = this.theoremGeneration.gt(0) && !ui.view.shiftDown;
    },
  },
  template: `
    <div id="TTbuttons">
      <div class="ttshop-container ttshop-background">
        <div data-role="page" class="ttbuttons-row ttbuttons-top-row">
        <button
          class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked"
          onClick="Modal.preferredTree.show()"
        >
          <i class='fas fa-cog'></i>
        </button>
          <p id="timetheorems">
            <span class="c-tt-amount">
              {{ formattedTheorems }}
              {{ "Time Theorem" | pluralize(theoremAmount, "Time Theorems") }}
            </span>
            <span v-if="showST">
              <br>
              {{ formatInt(STamount) }} {{ "Space Theorem" | pluralize(STamount, "Space Theorems") }}
            </span>
          </p>
          <div style="display: flex; flex-direction: column; align-items: left;">
            <div style="display: flex; flex-direction: row; align-items: center;">
              <span class="c-ttshop__save-load-text">{{ saveLoadText }}</span>
              <tt-save-load-button v-for="saveslot in 6" :key="saveslot" :saveslot="saveslot"></tt-save-load-button>
            </div>
            <span v-if="showTTGen">
              You are gaining {{ TTgenRateText }}.
            </span>
            <span v-else>
              You have {{ totalTimeTheoremText }}.
            </span>
          </div>
        </div>
        <div class="ttbuttons-row" v-if="!minimized">
          <tt-buy-button :budget="budget.am" :cost="costs.am" :formatCost="formatAM" :action="buyWithAM" />
          <tt-buy-button :budget="budget.ip" :cost="costs.ip" :formatCost="formatIP" :action="buyWithIP" />
          <tt-buy-button :budget="budget.ep" :cost="costs.ep" :formatCost="formatEP" :action="buyWithEP" />
          <div class="l-tt-buy-max-vbox">
            <button
              v-if="!minimized"
              class="o-tt-top-row-button c-tt-buy-button c-tt-buy-button--unlocked"
              @click="buyMaxTheorems"
            >
              Buy max
            </button>
            <primary-button-on-off
              v-if="!minimized && hasTTAutobuyer"
              v-model="isAutobuyerOn"
              class="o-tt-autobuyer-button c-tt-buy-button c-tt-buy-button--unlocked"
              text="Auto:"
            />
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
      const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
      GameUI.notify.eternity(`${presetName} saved in slot ${this.saveslot}`);
    },
    load() {
      this.hideContextMenu();
      if (this.preset.studies) {
        importStudyTree(this.preset.studies);
        const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
        GameUI.notify.eternity(`${presetName} loaded from slot ${this.saveslot}`);
      } else {
        Modal.message.show("This Time Study list currently contains no Time Studies.");
      }
    },
    handleExport() {
      this.hideContextMenu();
      copyToClipboard(this.preset.studies);
      const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
      GameUI.notify.eternity(`${presetName} exported from slot ${this.saveslot} to your clipboard`);
    },
    edit() {
      Modal.editTree.show({ id: this.saveslot - 1 });
    }
  },
  template: `
    <hover-menu class="l-tt-save-load-btn__wrapper">
      <button
        slot="object"
        class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked"
        @click.shift.exact="save"
        @click.exact="load"
      >
        {{ displayName }}
      </button>
      <div
        slot="menu"
        class="l-tt-save-load-btn__menu c-tt-save-load-btn__menu"
      >
        <input
          type="text"
          size="4"
          maxlength="4"
          class="l-tt-save-load-btn__menu-rename c-tt-save-load-btn__menu-rename"
          :value="name"
          ach-tooltip="Set a custom name (up to 4 characters)"
          @keyup.esc="hideContextMenu"
          @blur="nicknameBlur"
        />
        <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="edit">Edit</div>
        <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="handleExport">Export</div>
        <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="save">Save</div>
        <div class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item" @click="load">Load</div>
      </div>
    </hover-menu>`
});

Vue.component("tt-buy-button", {
  props: ["budget", "cost", "formatCost", "action"],
  computed: {
    isEnabled() {
      return this.budget.gte(this.cost);
    },
    enabledClass() {
      return this.isEnabled ? "c-tt-buy-button--unlocked" : "c-tt-buy-button--locked";
    }
  },
  template: `
    <button
      class="l-tt-buy-button c-tt-buy-button"
      :class="enabledClass"
      @click="action"
    >
      {{ formatCost(cost) }}
    </button>`
});
