<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import TimeTheoremBuyButton from "./TimeTheoremBuyButton";
import TimeStudySaveLoadButton from "./TimeStudySaveLoadButton";

export default {
  name: "TimeTheoremShop",
  components: {
    PrimaryToggleButton,
    TimeTheoremBuyButton,
    TimeStudySaveLoadButton
  },
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
    formatTimeTheoremType() {
      if (this.theoremAmount.gte(1e6)) {
        return format;
      }
      if (!(Teresa.isRunning || Enslaved.isRunning) &&
        getAdjustedGlyphEffect("dilationTTgen") > 0 && !DilationUpgrade.ttGenerator.isBought) {
        return formatFloat;
      }
      return formatInt;
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
      return `${quantify("total Time Theorem", this.totalTimeTheorems, 2, 2)}`;
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
      TimeTheorems.buyMax(false);
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
      this.showST = V.spaceTheorems > 0 && !Pelle.isDoomed;
      this.STamount = V.availableST;
      this.showTTGen = this.theoremGeneration.gt(0) && !ui.view.shiftDown;
    },
  },
};
</script>

<template>
  <div id="TTbuttons">
    <div class="ttshop-container ttshop-background">
      <div
        data-role="page"
        class="ttbuttons-row ttbuttons-top-row"
      >
        <button
          class="tt-save-load-btn tt-buy-button tt-buy-button--unlocked"
          onClick="Modal.preferredTree.show()"
        >
          <i class="fas fa-cog" />
        </button>
        <p id="timetheorems">
          <span class="c-tt-amount">
            {{ quantify("Time Theorem", theoremAmount, 2, 0, formatTimeTheoremType) }}
          </span>
          <span v-if="showST">
            <br>
            {{ quantifyInt("Space Theorem", STamount) }}
          </span>
        </p>
        <div class="tree-load-tt-gen-area">
          <div class="tree-load-buttons">
            <span class="ttshop__save-load-text">{{ saveLoadText }}</span>
            <TimeStudySaveLoadButton
              v-for="saveslot in 6"
              :key="saveslot"
              :saveslot="saveslot"
            />
          </div>
          <span v-if="showTTGen">
            You are gaining {{ TTgenRateText }}.
          </span>
          <span v-else>
            You have {{ totalTimeTheoremText }}.
          </span>
        </div>
      </div>
      <div
        v-if="!minimized"
        class="ttbuttons-row"
      >
        <TimeTheoremBuyButton
          :budget="budget.am"
          :cost="costs.am"
          :format-cost="formatAM"
          :action="buyWithAM"
        />
        <TimeTheoremBuyButton
          :budget="budget.ip"
          :cost="costs.ip"
          :format-cost="formatIP"
          :action="buyWithIP"
        />
        <TimeTheoremBuyButton
          :budget="budget.ep"
          :cost="costs.ep"
          :format-cost="formatEP"
          :action="buyWithEP"
        />
        <div class="tt-buy-max-vbox">
          <button
            v-if="!minimized"
            class="tt-top-row-button tt-buy-button tt-buy-button--unlocked"
            @click="buyMaxTheorems"
          >
            Buy max
          </button>
          <PrimaryToggleButton
            v-if="!minimized && hasTTAutobuyer"
            v-model="isAutobuyerOn"
            class="tt-autobuyer-button tt-buy-button tt-buy-button--unlocked"
            label="Auto:"
          />
        </div>
      </div>
    </div>
    <button
      v-if="minimizeAvailable"
      class="ttshop-minimize-btn ttshop-background"
      @click="minimize"
    >
      <span
        id="minimizeArrow"
        :style="minimizeArrowStyle"
      >▼</span>
    </button>
  </div>
</template>

<style scoped>
#TTbuttons {
  color: var(--color-text);
  position: fixed;
  bottom: 0;
  font-family: Typewriter, serif;
  display: flex;
  align-items: flex-end;
  z-index: 2;
  width: 55.5rem;
}

#timetheorems {
  font-size: 15px;
  text-align: center;
  flex: 1 0 auto;
}

.ttbuttons-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
}

.ttbuttons-top-row {
  align-items: center;
}

.tt-save-load-btn {
  min-width: 2em;
}

.tt-buy-button {
  font-weight: bold;
  font-family: Typewriter, serif;
  border: 0.1rem solid #691fa5;
  transition-duration: 0.2s;
  border-radius: 4px;
  font-size: 1.35rem;
}

.tt-buy-button--unlocked {
  color: #3AACD6;
  background: #232028;
  cursor: pointer;
}

.tt-buy-button--unlocked:hover {
  color: #232028;
  background: #3AACD6;
}

.tree-load-tt-gen-area {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.tree-load-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ttshop__save-load-text {
  font-size: 10px;
}

.tt-buy-max-vbox {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.tt-top-row-button {
  min-height: 3rem;
  font-size: 1.2rem;
  margin: 0.3rem;
  flex-grow: 0;
  flex-shrink: 0;
  align-self: stretch;
  padding-left: 1rem;
  padding-right: 1rem;
}

.tt-autobuyer-button {
  height: 2.5rem;
  font-size: 1rem !important;
  margin: 0.3rem;
  flex-grow: 0;
  flex-shrink: 0;
  align-self: stretch;
  padding-left: 1rem;
  padding-right: 1rem;
  min-width: 8rem;
}
</style>