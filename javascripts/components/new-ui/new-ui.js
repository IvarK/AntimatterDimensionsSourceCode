"use strict";

Vue.component("new-ui", {
  data() {
    return {
      view: ui.view,
      bigCrunch: false,
      smallCrunch: false,
      breakInfinity: false,
      realities: 0,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0),
      isInMatterChallenge: false,
      matter: new Decimal(0),
      isInEffarig: false,
      effarigMultNerfText: "",
      effarigTickNerfText: "",
      isInLaitela: false,
      laitelaTimer: 0,
      laitelaEntropy: "",
      isChallengePowerVisible: false,
      challengePower: "",
      isInFailableEC: false,
    };
  },
  computed: {
    news() {
      return this.$viewModel.news;
    },
    topMargin() {
      return this.$viewModel.news ? "" : "margin-top: 3.9rem";
    }
  },
  methods: {
    update() {
      this.antimatter.copyFrom(Currency.antimatter);
      this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
      this.breakInfinity = player.break;
      this.realities = Currency.realities.value;

      this.currentEternityChallenge = EternityChallenge.current;
      this.isInFailableEC = this.currentEternityChallenge && [4, 12].includes(this.currentEternityChallenge.id);

      this.updateChallengePower();

      this.isInMatterChallenge = Player.isInMatterChallenge;
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Currency.matter);
      }
      this.isInEffarig = Effarig.isRunning;
      if (this.isInEffarig) {
        this.effarigMultNerfText = `${formatPow(0.25 + 0.25 * Effarig.nerfFactor(Currency.infinityPower.value), 0, 5)}`;
        this.effarigTickNerfText = `${formatPow(0.7 + 0.1 * Effarig.nerfFactor(Currency.timeShards.value), 0, 5)}`;
      }
      this.isInLaitela = Laitela.isRunning;
      if (this.isInLaitela) {
        if (player.celestials.laitela.entropy > 0) {
          this.laitelaEntropy = `${formatPercents(player.celestials.laitela.entropy, 2, 2)}`;
          this.laitelaTimer = Time.thisRealityRealTime.toStringShort();
        } else {
          this.laitelaEntropy = `${formatPercents(1, 2, 2)}`;
          this.laitelaTimer = TimeSpan.fromSeconds(player.celestials.laitela.thisCompletion).toStringShort();
        }
      }

      const crunchButtonVisible = !player.break && Player.canCrunch;
      const reachedInfinityInMinute = Time.bestInfinityRealTime.totalMinutes <= 1;
      this.bigCrunch = crunchButtonVisible && !reachedInfinityInMinute;
      this.smallCrunch = crunchButtonVisible && reachedInfinityInMinute;
    },
    updateChallengePower() {
      const isC2Running = NormalChallenge(2).isRunning;
      const isC3Running = NormalChallenge(3).isRunning;
      const isIC6Running = InfinityChallenge(6).isRunning;
      const isIC8Running = InfinityChallenge(8).isRunning;
      const isChallengePowerVisible = isC2Running || isC3Running || isIC6Running || isIC8Running;
      this.isChallengePowerVisible = isChallengePowerVisible;
      if (this.isChallengePowerVisible) {
        const powerArray = [];
        if (isC2Running) powerArray.push(`Production: ${formatPercents(player.chall2Pow, 2, 2)}`);
        if (isC3Running) powerArray.push(`First dimension: ${formatX(player.chall3Pow, 3, 4)}`);
        if (isIC6Running) powerArray.push(`Matter: /
          ${format(new Decimal(1).timesEffectOf(InfinityChallenge(6)), 2, 2)}`);
        if (isIC8Running) powerArray.push(`Production: /
          ${format(new Decimal(1).timesEffectOf(InfinityChallenge(8)).reciprocal(), 2, 2)}`);
        this.challengePower = powerArray.join(", ");
      }
    },
  },
  template: `
    <div id="page">
      <link rel="stylesheet" type="text/css" href="stylesheets/new-ui-styles.css">
      <div class="game-container" :style="topMargin">
        <news-ticker v-if="news" />
        <div v-if="bigCrunch" class="l-new-ui-big-crunch__container">
          <h3>The world has collapsed due to excess antimatter.</h3>
          <button class="btn-big-crunch" onclick="bigCrunchResetRequest()">Big Crunch</button>
        </div>
        <div class="tab-container" v-else>
          <div class="l-reset-buttons-container" v-if="breakInfinity">
            <game-header-eternity-button />
            <game-header-new-dim-button />
            <game-header-big-crunch-button />
          </div>
          <game-header-amounts-line />
          <div class="l-game-header__antimatter-container">
            <p>You have <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span> antimatter.</p>
            <div>You are getting {{ format(antimatterPerSec, 2, 0) }} antimatter per second.</div>
          </div>
          <div class="information-header">
            <header-challenge-display />
            <div v-if="isInEffarig">
              Gamespeed and multipliers are Dilated {{ effarigMultNerfText }}
              <br>
              Tickspeed is Dilated {{ effarigTickNerfText }}
            </div>
            <div v-if="isInLaitela">
              Entropy: {{ laitelaEntropy }} ({{ laitelaTimer }})
            </div>
            <br>
            <span v-if="isInMatterChallenge">There is {{ format(matter, 2, 1) }} matter.</span>
            <span v-if="isChallengePowerVisible">{{ challengePower }}</span>
            <black-hole-header-row />
          </div>
          <button
            class="btn-big-crunch btn-big-crunch--small"
            onclick="bigCrunchResetRequest()"
            v-if="smallCrunch && !bigCrunch"
          >
            Big Crunch
          </button>
          <slot />
        </div>
      </div>
    </div>`
});
