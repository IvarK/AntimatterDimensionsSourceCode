<script>
import GameSpeedDisplay from "@/components/GameSpeedDisplay";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HeaderTickspeedRow",
  components: {
    PrimaryButton,
    GameSpeedDisplay
  },
  data() {
    return {
      purchasedTickspeed: 0,
      freeTickspeed: 0,
      isVisible: false,
      mult: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      tickspeed: new Decimal(0),
      galaxyCount: 0,
      isContinuumActive: false,
      continuumValue: 0
    };
  },
  computed: {
    classObject() {
      return {
        "c-game-header__tickspeed-row": true,
        "c-game-header__tickspeed-row--hidden": !this.isVisible
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
    showCostTitle() {
      return this.cost.exponent < 1000000;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    upgradeCount() {
      if (this.freeTickspeed === 0) return `Purchased ${quantifyInt("time", this.purchasedTickspeed)}`;
      return `${formatInt(this.purchasedTickspeed)} Purchased + ${formatInt(this.freeTickspeed)} Free`;
    }
  },
  methods: {
    update() {
      this.purchasedTickspeed = player.totalTickBought;
      this.freeTickspeed = FreeTickspeed.amount;
      const isEC9Running = EternityChallenge(9).isRunning;
      this.isVisible = Tickspeed.isUnlocked || isEC9Running;
      if (!this.isVisible) return;
      this.mult.copyFrom(Tickspeed.multiplier);
      this.cost.copyFrom(Tickspeed.cost);
      this.isAffordable = !isEC9Running && canAfford(Tickspeed.cost);
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.galaxyCount = player.galaxies;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = Tickspeed.continuumValue;
    },
    buttonClass() {
      return {
        "o-primary-btn--tickspeed": true,
        "o-continuum": this.isContinuumActive
      };
    }
  },
};
</script>

<template>
  <div :class="classObject">
    <div>{{ multiplierDisplay }}</div>
    <div>
      <PrimaryButton
        v-tooltip="upgradeCount"
        :enabled="isAffordable || isContinuumActive"
        :class="buttonClass()"
        onclick="buyTickSpeed()"
      >
        <span v-if="isContinuumActive">Continuum: {{ continuumString }}</span>
        <span v-else-if="showCostTitle">Cost: {{ format(cost) }}</span>
        <span v-else>{{ format(cost) }}<br></span>
      </PrimaryButton>
      <PrimaryButton
        v-if="!isContinuumActive"
        :enabled="isAffordable"
        class="o-primary-btn--buy-max"
        onclick="buyMaxTickSpeed()"
      >
        Buy Max
      </PrimaryButton>
    </div>
    <div>
      {{ tickspeedDisplay }}
      <GameSpeedDisplay :is-standalone="false" />
    </div>
  </div>
</template>

<style scoped>
.o-continuum {
  width: 25rem;
  transition: width 0s;
  cursor: auto;
}
</style>
