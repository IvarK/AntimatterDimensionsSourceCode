"use strict";

Vue.component("new-dimensions-tab", {
  data() {
    return {
      until10Setting: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      sacrificeBoost: new Decimal(0),
      currCelestial: "",
      challengeDisplay: "",
      isInAnyChallenge: false,
      isChallengePowerVisible: false,
      challengePower: "",
      isQuickResetAvailable: false
    };
  },
  computed: {
    sacrificeBoostDisplay() {
      return this.shortenRateOfChange(this.sacrificeBoost);
    },
    sacrificeTooltip() {
      return `Boosts 8th Dimension by ${this.sacrificeBoostDisplay}x`;
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
      until10Setting = !until10Setting;
    },
    getUntil10Display() {
      return this.until10Setting ? "Until 10" : "Buy 1";
    },
    update() {
      this.until10Setting = until10Setting;
      this.isInAnyChallenge = this.challengeDisplay.length !== 0;
      const isC2Running = NormalChallenge(2).isRunning;
      const isC3Running = NormalChallenge(3).isRunning;
      const isChallengePowerVisible = isC2Running || isC3Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (isChallengePowerVisible) {
        const c2Power = `${(player.chall2Pow * 100).toFixed(2)}%`;
        const c3Power = `${this.shortenRateOfChange(player.chall3Pow.times(100))}%`;
        if (isC2Running && isC3Running) {
          this.challengePower = `Production: ${c2Power}, First dimension: ${c3Power}`;
        } else if (isC2Running) {
          this.challengePower = `Production: ${c2Power}`;
        } else if (isC3Running) {
          this.challengePower = `First dimension: ${c3Power}`;
        }
      }
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      this.isQuickResetAvailable = challenge && challenge.isQuickResettable;

      this.updateCelestial();
      this.updateChallengeDisplay();

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
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
      // Pls don't hate me Razen
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
      else if (PlayerProgress.infinityUnlocked()) this.challengeDisplay = "the Antimatter Universe (no active challenges)";
      else this.challengeDisplay = "";
    }
  },
  template:
  `<div class="l-normal-dim-tab">
    <div class="information-header" ><span v-if="isInAnyChallenge">You are currently in {{challengeDisplay}}</span><br><span v-if="isChallengePowerVisible">{{challengePower}}</span></div>
    <div class="modes-container">
      <button class="storebtn" @click="toggleUntil10" style="width: 100px; height: 30px; padding: 0;">{{ getUntil10Display() }}</button>
      <primary-button
          v-show="isSacrificeUnlocked"
          v-tooltip="sacrificeTooltip"
          :enabled="isSacrificeAffordable"
          class="storebtn sacrifice-btn"
          @click="sacrifice"
        >Dimensional Sacrifice ({{sacrificeBoostDisplay}}x)</primary-button>
      <button class="storebtn" @click="maxAll" style="width: 100px; height: 30px; padding: 0;">Max All (M)</button>
    </div>
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
          onclick="softReset(0)"
        >Lose a reset, returning to the start of the reset</primary-button>
      <new-galaxy-row></new-galaxy-row>
    </div>
    <normal-dim-tab-progress-bar/>
  </div>`
});
