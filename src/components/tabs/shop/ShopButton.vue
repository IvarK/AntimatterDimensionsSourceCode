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
    // Note: This will always be false on non-cosmetic buttons and thus will never disable them in purchaseButtonObject
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
    performPurchase() {
      if (this.isSingleCosmeticSet && !this.hasChosen) {
        return;
      }
      this.purchase.purchase();
    },
    purchaseButtonObject() {
      const lockCosmetics = (this.isSingleCosmeticSet && !this.hasChosen) || this.allSetsUnlocked;
      return {
        "o-shop-button-button": true,
        "o-shop-button-button--disabled": !this.canAfford || lockCosmetics
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
    <div>
      <div v-if="isSingleCosmeticSet">
        <div
          v-if="allSetsUnlocked"
          class="o-shop-button-multiplier"
        >
          All Sets unlocked!
        </div>
        <div v-else>
          <button
            class="o-shop-button-button"
            @click="openSelectionModal"
          >
            Choose Set
          </button>
          Chosen Set: {{ chosenSet }}
        </div>
      </div>
      <div
        v-if="isAllCosmeticSets"
        class="o-shop-button-multiplier"
      >
        <div v-if="allSetsUnlocked">
          All Sets unlocked!
        </div>
        <div v-else>
          Will unlock {{ quantify("set", lockedCount) }}
        </div>
      </div>
    </div>
    <button
      :class="purchaseButtonObject()"
      @click="performPurchase"
    >
      Cost: {{ cost }}
      <img
        src="images/std_coin.png"
        class="o-shop-button-button__img"
      >
    </button>
    <div
      v-if="!purchase.isUnlocked()"
      class="o-shop-button-locked-text"
    >
      This affects a feature you have not unlocked yet ({{ purchase.lockText }})
    </div>
  </div>
</template>

<style scoped>
.c-shop-button-container {
  display: flex;
  flex-direction: column;
  width: 30rem;
  height: 18rem;
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

.o-shop-button-locked-text {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-bad);
}
</style>
