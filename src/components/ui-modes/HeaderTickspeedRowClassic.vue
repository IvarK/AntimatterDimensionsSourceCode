<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HeaderTickspeedRowClassic",
  components: {
    PrimaryButton,
  },
  props: {
    inHeader: {
      type: Boolean,
      required: false,
      default: true,
    }
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
      continuumValue: 0,
      hasTutorial: false,
    };
  },
  computed: {
    classObject() {
      return {
        "c-game-header__tickspeed-row": true,
        "c-game-header__tickspeed-row--hidden": !this.isVisible,
        "l-inline-padding": !this.inHeader
      };
    },
    multiplierDisplay() {
      if (InfinityChallenge(3).isRunning) return `Multiply all Antimatter Dimensions by
        ${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)}`;
      const tickmult = this.mult;
      return `${formatX(tickmult.reciprocal(), 2, 3)} faster / upgrade`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    upgradeCount() {
      const purchased = this.purchasedTickspeed;
      if (!this.freeTickspeed) return `${formatInt(purchased)} Purchased`;
      if (purchased === 0 || this.isContinuumActive) return `${formatInt(this.freeTickspeed)} Free Upgrades`;
      return `${formatInt(purchased)} Purchased + ${formatInt(this.freeTickspeed)} Free`;
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
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.TICKSPEED);
    },
    buttonClass() {
      return {
        "l-long-button": !this.inHeader,
        "o-primary-btn--tickspeed": true,
        "l-glow-container": true,
        "o-continuum": this.isContinuumActive,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    },
    buyUpgrade() {
      if (!buyTickSpeed()) return;
      Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
    },
  },
};
</script>

<template>
  <div :class="classObject">
    <div v-if="inHeader">
      {{ multiplierDisplay }}
    </div>
    <div>
      <PrimaryButton
        v-tooltip="upgradeCount"
        :enabled="isAffordable || isContinuumActive"
        :class="buttonClass()"
        @click="buyUpgrade"
      >
        <span v-if="!inHeader">Tickspeed </span>
        <span v-if="isContinuumActive">Continuum: {{ continuumString }}</span>
        <span v-else>Cost: {{ format(cost) }}</span>
        <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
        />
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
      {{ tickspeedDisplay }} <span v-if="!inHeader">({{ multiplierDisplay }})</span>
    </div>
  </div>
</template>

<style scoped>
.o-continuum {
  transition: width 0s;
  cursor: auto;
}

.l-inline-padding {
  padding-top: 1rem;
}

.l-long-button {
  width: 30rem;
}
</style>
