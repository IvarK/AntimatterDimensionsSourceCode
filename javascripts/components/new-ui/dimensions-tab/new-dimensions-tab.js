"use strict";

Vue.component("new-dimensions-tab", {
  data() {
    return {
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      isInMatterChallenge: false,
      matter: new Decimal(0),
      inEffarig: false,
      effarigMultNerfText: 0,
      effarigTickNerfText: 0,
      disabledCondition: "",
      currCelestial: "",
      challengeDisplay: "",
      isInAnyChallenge: false,
      isChallengePowerVisible: false,
      challengePower: "",
      isQuickResetAvailable: false
    };
  },
  computed: {
    sacrificeTooltip() {
      return `Boosts 8th Dimension by ${formatX(this.sacrificeBoost, 2, 2)}`;
    },
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    toggleUntil10() {
      player.buyUntil10 = !player.buyUntil10;
    },
    getUntil10Display() {
      return this.buyUntil10 ? "Until 10" : "Buy 1";
    },
    update() {
      this.buyUntil10 = player.buyUntil10;
      this.isInAnyChallenge = this.challengeDisplay.length !== 0;
      const isC2Running = NormalChallenge(2).isRunning;
      const isC3Running = NormalChallenge(3).isRunning;
      const isIC6Running = InfinityChallenge(6).isRunning;
      const isIC8Running = InfinityChallenge(8).isRunning;
      const isChallengePowerVisible = isC2Running || isC3Running || isIC6Running || isIC8Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (isChallengePowerVisible) {
        const powerArray = [];
        if (isC2Running) powerArray.push(`Production: ${formatPercents(player.chall2Pow, 2, 2)}`);
        if (isC3Running) powerArray.push(`First dimension: ${formatX(player.chall3Pow, 2, 2)}`);
        if (isIC6Running) powerArray.push(`Matter: /
          ${format(new Decimal(1).timesEffectOf(InfinityChallenge(6)), 2, 2)}`);
        if (isIC8Running) powerArray.push(`Production: /
          ${format(new Decimal(1).timesEffectOf(InfinityChallenge(8)).reciprocal(), 2, 2)}`);
        this.challengePower = powerArray.join(", ");
      }
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      this.isQuickResetAvailable = challenge && challenge.isQuickResettable;

      this.isInMatterChallenge = Player.isInMatterChallenge;
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Player.effectiveMatterAmount);
      }
      this.inEffarig = Effarig.isRunning;
      if (this.inEffarig) {
        this.effarigMultNerfText = `^${format(0.25 + 0.25 * Effarig.nerfFactor(player.infinityPower), 0, 5)}`;
        this.effarigTickNerfText = `^${format(0.7 + 0.1 * Effarig.nerfFactor(player.timeShards), 0, 5)}`;
      }

      this.updateCelestial();
      this.updateChallengeDisplay();

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
    },
    updateCelestial() {
      if (Teresa.isRunning) this.currCelestial = "Teresa's";
      else if (Effarig.isRunning) this.currCelestial = "Effarig's";
      else if (Enslaved.isRunning) this.currCelestial = "The Enslaved Ones'";
      else if (V.isRunning) this.currCelestial = "V's";
      else if (Ra.isRunning) this.currCelestial = "Ra's";
      else if (Laitela.isRunning) this.currCelestial = "Lai'tela's";
      else this.currCelestial = "";
    },
    updateChallengeDisplay() {
      let displayValue = "";

      const inCelestialReality = this.currCelestial.length !== 0;
      if (inCelestialReality) displayValue += ` + ${this.currCelestial} Reality`;

      const inDilation = player.dilation.active;
      if (inDilation) displayValue += " + Time Dilation";

      const normalChallenge = NormalChallenge.current;
      if (normalChallenge !== undefined) displayValue += ` + ${normalChallenge.config.reward} Challenge `;

      const infinityChallenge = InfinityChallenge.current;
      if (infinityChallenge !== undefined) displayValue += ` + Infinity Challenge ${infinityChallenge.id}`;

      const eternityChallenge = EternityChallenge.current;
      if (eternityChallenge !== undefined) displayValue += ` + Eternity Challenge ${eternityChallenge.id}`;

      if (displayValue.length !== 0) this.challengeDisplay = displayValue.substring(3);
      else if (PlayerProgress.infinityUnlocked()) {
        this.challengeDisplay = "the Antimatter Universe (no active challenges)";
      } else this.challengeDisplay = "";
    }
  },
  template:
  `<div class="l-normal-dim-tab">
    <div class="information-header" >
      <span v-if="isInAnyChallenge">You are currently in {{challengeDisplay}}</span>
      <div v-if="inEffarig">
        Gamespeed and multipliers dilated {{effarigMultNerfText}}<br>
        Tickspeed dilated {{effarigTickNerfText}}
      </div>
      <div v-if="isInMatterChallenge">There is {{format(matter, 2, 1)}} matter.</div>
      <br><span v-if="isChallengePowerVisible">{{challengePower}}</span>
    </div>
    <div class="modes-container">
      <button class="o-primary-btn" @click="toggleUntil10" style="width: 100px; height: 30px; padding: 0;">
        {{ getUntil10Display() }}
      </button>
      <primary-button
          v-show="isSacrificeUnlocked"
          v-tooltip="sacrificeTooltip"
          :enabled="isSacrificeAffordable"
          class="o-primary-btn sacrifice-btn"
          @click="sacrifice"
        >
        <span v-if="isSacrificeAffordable">Dimensional Sacrifice ({{ formatX(sacrificeBoost, 2, 2) }})</span>
        <span v-else>Sacrifice Disabled ({{ disabledCondition }})</span>
      </primary-button>
      <button class="o-primary-btn" @click="maxAll" style="width: 100px; height: 30px; padding: 0;">Max All (M)</button>
    </div>
    <span v-if="isSacrificeUnlocked">Sacrifice multiplier: {{ formatX(currentSacrifice, 2, 2) }}</span>
    <new-tickspeed-row></new-tickspeed-row>
    <div class="dimensions-container">
      <new-dimension-row
        v-for="tier in 8"
        :key="tier"
        :tier="tier"></new-dimension-row>
    </div>
    <div class="resets-container">
      <new-dim-shift-row></new-dim-shift-row>
      <primary-button
          v-if="isQuickResetAvailable"
          class="o-primary-btn--quick-reset"
          onclick="softReset(-1, true, true)"
        >Lose a reset, returning to the start of the reset</primary-button>
      <new-galaxy-row></new-galaxy-row>
    </div>
    <normal-dim-tab-progress-bar/>
  </div>`
});
