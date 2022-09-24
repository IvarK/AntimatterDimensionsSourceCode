<script>
export default {
  name: "TickspeedRow",
  data() {
    return {
      purchasedTickspeed: 0,
      freeTickspeed: 0,
      isVisible: false,
      mult: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      tickspeed: new Decimal(0),
      gameSpeedMult: 1,
      galaxyCount: 0,
      isContinuumActive: false,
      continuumValue: 0,
      hasTutorial: false,
      hasRealityButton: false,
    };
  },
  computed: {
    classObject() {
      return {
        "l-tickspeed-container": true,
        "l-tickspeed-container--hidden": !this.isVisible
      };
    },
    multiplierDisplay() {
      if (InfinityChallenge(3).isRunning) return `Multiply all Antimatter Dimensions by
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)}`;
      const tickmult = this.mult;
      return `${formatX(tickmult.reciprocal(), 2, 3)} faster / upgrade.`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    upgradeCount() {
      const purchased = this.purchasedTickspeed;
      if (!this.freeTickspeed) return `${formatInt(purchased)} Purchased Upgrades`;
      if (purchased === 0 || this.isContinuumActive) return `${formatInt(this.freeTickspeed)} Free Upgrades`;
      return `${formatInt(purchased)} Purchased + ${formatInt(this.freeTickspeed)} Free`;
    }
  },
  methods: {
    update() {
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.purchasedTickspeed = player.totalTickBought;
      this.freeTickspeed = FreeTickspeed.amount;
      const isEC9Running = EternityChallenge(9).isRunning;
      this.isVisible = Tickspeed.isUnlocked || isEC9Running;
      if (!this.isVisible) return;
      this.mult.copyFrom(Tickspeed.multiplier);
      this.cost.copyFrom(Tickspeed.cost);
      this.isAffordable = !isEC9Running && canAfford(Tickspeed.cost);
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.gameSpeedMult = getGameSpeedupForDisplay();
      this.galaxyCount = player.galaxies;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = Tickspeed.continuumValue;
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.TICKSPEED);
    },
    buttonClass() {
      return {
        "o-primary-btn": true,
        "tickspeed-btn": true,
        "o-primary-btn--disabled": !this.isAffordable && !this.isContinuumActive,
        "o-non-clickable": this.isContinuumActive,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    },
    buyUpgrade() {
      if (!buyTickSpeed()) return;
      Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
    },
    buyMaxUpgrade() {
      if (!buyMaxTickSpeed()) return;
      Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
    },
  }
};
</script>

<template>
  <div :class="classObject">
    <div class="tickspeed-buttons">
      <button
        v-tooltip="upgradeCount"
        :class="buttonClass()"
        @click="buyUpgrade"
      >
        <span v-if="isContinuumActive">
          Tickspeed Continuum: {{ continuumString }}
        </span>
        <span v-else>
          Tickspeed Cost: {{ format(cost) }}
        </span>
        <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
        />
      </button>
      <button
        v-if="!isContinuumActive"
        class="o-primary-btn tickspeed-max-btn"
        :class="{ 'o-primary-btn--disabled': !isAffordable && !isContinuumActive }"
        @click="buyMaxUpgrade"
      >
        Buy Max
      </button>
    </div>
    <div
      v-if="hasRealityButton"
      class="tickspeed-labels"
    >
      {{ tickspeedDisplay }}
      <br>
      {{ multiplierDisplay }}
    </div>
  </div>
</template>

<style scoped>
.o-primary-btn {
  position: relative;
  vertical-align: middle;
}

.tickspeed-btn {
  width: 30rem;
}

.tickspeed-labels {
  color: var(--color-text);
  padding: 0.5rem 1rem;
}

.l-tickspeed-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.l-tickspeed-container--hidden {
  visibility: hidden;
}

.tickspeed-max-btn {
  margin-left: 0.5rem;
}

.o-non-clickable {
  cursor: auto;
}
</style>
