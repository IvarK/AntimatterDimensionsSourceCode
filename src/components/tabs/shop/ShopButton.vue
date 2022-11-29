<script>
export default {
  name: "ShopButton",
  props: {
    purchase: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      currentMult: 0,
      nextMult: 0,
      canAfford: false,
      iapDisabled: false,
      cost: 0,
      hasChosen: false,
      chosenSet: "",
      lockedCount: 0,
    };
  },
  computed: {
    isSingleCosmeticSet() {
      return this.purchase.config.key === "singleCosmeticSet";
    },
    isAllCosmeticSets() {
      return this.purchase.config.key === "allCosmeticSets";
    },
    allSetsUnlocked() {
      return (this.isSingleCosmeticSet || this.isAllCosmeticSets) && !this.lockedCount;
    }
  },
  methods: {
    update() {
      this.currentMult = this.purchase.currentMultForDisplay;
      this.nextMult = this.purchase.nextMultForDisplay;
      this.canAfford = this.purchase.canBeBought;
      this.iapDisabled = !ShopPurchaseData.isIAPEnabled;
      this.cost = Math.clampMin(this.purchase.cost, 0);
      this.hasChosen = GlyphAppearanceHandler.chosenFromModal !== null;
      this.chosenSet = GlyphAppearanceHandler.chosenFromModal?.name ?? "Not Selected";
      this.lockedCount = GlyphAppearanceHandler.lockedSets.length;
    },
    openSelectionModal() {
      Modal.cosmeticSetChoice.show();
    },
    purchaseButtonObject() {
      return {
        "o-shop-button-button": true,
        "o-shop-button-button--disabled": !this.canAfford ||
          (this.isSingleCosmeticSet && !this.hasChosen)
      };
    }
  },
};
</script>

<template>
  <div class="c-shop-button-container">
    <div class="o-shop-button-description">
      {{ purchase.description }}
      <br>
      <span
        v-if="purchase.shouldDisplayMult"
        class="o-shop-button-multiplier"
        :class="{ 'o-shop-button-multiplier--disabled': iapDisabled }"
      >
        Currently {{ purchase.formatEffect(currentMult) }}, next: {{ purchase.formatEffect(nextMult) }}
      </span>
    </div>
    <div v-if="isSingleCosmeticSet && lockedCount">
      <br>
      <button
        class="o-shop-button-button"
        @click="openSelectionModal"
      >
        Choose Set
      </button>
      Chosen Set: {{ chosenSet }}
    </div>
    <div v-if="isAllCosmeticSets && lockedCount">
      Will unlock {{ quantify("set", lockedCount) }}
    </div>
    <div
      v-if="allSetsUnlocked"
      class="o-shop-button-multiplier"
    >
      All Sets unlocked!
    </div>
    <button
      v-else
      :class="purchaseButtonObject()"
      @click="purchase.purchase()"
    >
      Cost: {{ cost }}
      <img
        src="images/std_coin.png"
        class="o-shop-button-button__img"
      >
    </button>
  </div>
</template>

<style scoped>
.c-shop-button-container {
  display: flex;
  flex-direction: column;
  width: 30rem;
  height: 16rem;
  justify-content: space-between;
  color: white;
  background: #3c3c3c;
  border: var(--var-border-width, 0.2rem) solid #1f7d1f;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0.5rem;
  padding: 1rem;
}

.o-shop-button-button {
  display: flex;
  align-items: center;
  font-family: Typewriter;
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0 auto;
  padding: 0.5rem 2rem;
  cursor: pointer;
}

.o-shop-button-button--disabled {
  background: rgb(150, 150, 150);
  cursor: default;
}

.o-shop-button-button__img {
  height: 40px;
  margin-left: 1rem;
}

.o-shop-button-multiplier {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.o-shop-button-multiplier--disabled {
  color: red;
  text-decoration: line-through;
}
</style>
