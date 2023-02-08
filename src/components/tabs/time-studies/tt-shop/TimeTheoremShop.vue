<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import TimeStudySaveLoadButton from "./TimeStudySaveLoadButton";
import TimeTheoremBuyButton from "./TimeTheoremBuyButton";

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
      hasTTGen: false,
      showTTGen: false,
      invertTTgenDisplay: false,
    };
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
      return `${quantify("total Time Theorem", this.totalTimeTheorems, 2, 2, this.formatTimeTheoremType)}`;
    },
    minimizeArrowStyle() {
      return {
        transform: this.minimized ? "rotate(-180deg)" : "",
        transition: "all 0.25s ease-out"
      };
    },
    saveLoadText() {
      return this.$viewModel.shiftDown ? "Save:" : "Load:";
    },
    shopBottomRowHeightStyle() {
      return {
        height: this.hasTTAutobuyer ? "6.7rem" : "4.4rem",
      };
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.timeTheorem.isActive = newValue;
    },
    invertTTgenDisplay(newValue) {
      player.options.invertTTgenDisplay = newValue;
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
      this.theoremGeneration.copyFrom(getTTPerSecond().times(getGameSpeedupForDisplay()));
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
      this.hasTTGen = this.theoremGeneration.gt(0);
      this.showTTGen = this.hasTTGen && (ui.view.shiftDown === this.invertTTgenDisplay);
      this.invertTTgenDisplay = player.options.invertTTgenDisplay;
    },
    toggleTTgen() {
      this.invertTTgenDisplay = !this.invertTTgenDisplay;
    }
  },
};
</script>

<template>
  <div class="time-theorem-buttons">
    <div class="ttshop-container ttshop-background">
      <div
        data-role="page"
        class="ttbuttons-row ttbuttons-top-row"
      >
        <button
          class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked"
          onClick="Modal.preferredTree.show()"
        >
          <i class="fas fa-cog" />
        </button>
        <p class="timetheorems">
          <span class="c-tt-amount">
            {{ quantify("Time Theorem", theoremAmount, 2, 0, formatTimeTheoremType) }}
          </span>
          <span v-if="showST">
            <br>
            {{ quantifyInt("Space Theorem", STamount) }}
          </span>
        </p>
        <div class="l-load-tree-area">
          <div class="l-tree-load-button-wrapper">
            <span class="c-ttshop__save-load-text">{{ saveLoadText }}</span>
            <TimeStudySaveLoadButton
              v-for="saveslot in 6"
              :key="saveslot"
              :saveslot="saveslot"
            />
          </div>
          <div class="tt-gen-container">
            <span
              v-if="hasTTGen"
              class="checkbox-margin"
              ach-tooltip="This shows TT generation by default and total TT if you hold shift.
                Check this box to swap this behavior."
            >
              <input
                v-model="invertTTgenDisplay"
                type="checkbox"
                :value="invertTTgenDisplay"
                class="o-clickable"
                @input="toggleTTgen()"
              >
            </span>
            <span v-if="showTTGen">
              You are gaining {{ TTgenRateText }}.
            </span>
            <span v-else>
              You have {{ totalTimeTheoremText }}.
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="!minimized"
        class="ttbuttons-row"
        :style="shopBottomRowHeightStyle"
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
        <div class="l-tt-buy-max-vbox">
          <button
            v-if="!minimized"
            class="o-tt-top-row-button c-tt-buy-button c-tt-buy-button--unlocked"
            @click="buyMaxTheorems"
          >
            Buy max
          </button>
          <PrimaryToggleButton
            v-if="!minimized && hasTTAutobuyer"
            v-model="isAutobuyerOn"
            class="o-tt-autobuyer-button c-tt-buy-button c-tt-buy-button--unlocked"
            label="Auto:"
          />
        </div>
      </div>
      <div
        v-else
        class="ttbuttons-row ttbuttons-bottom-row-hide"
      />
    </div>
    <button
      v-if="minimizeAvailable"
      class="ttshop-minimize-btn ttshop-background"
      @click="minimize"
    >
      <span
        class="minimize-arrow"
        :style="minimizeArrowStyle"
      >▼</span>
    </button>
  </div>
</template>

<style scoped>
.l-load-tree-area {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: left;
}

.l-tree-load-button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.ttbuttons-bottom-row-hide {
  height: 0;
}

.tt-gen-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.checkbox-margin {
  margin: 0 0.4rem;
}
</style>
