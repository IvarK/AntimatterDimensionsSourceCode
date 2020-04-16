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
      challengeDisplay: "",
      isInMatterChallenge: false,
      matter: new Decimal(0),
      isInEffarig: false,
      effarigMultNerfText: "",
      effarigTickNerfText: "",
      isInLaitela: false,
      laitelaTimer: 0,
      laitelaEntropy: "",
      currCelestial: "",
      isInAnyChallenge: false,
      isChallengePowerVisible: false,
      challengePower: "",
    };
  },
  computed: {
    news() {
      return this.$viewModel.news;
    }
  },
  methods: {
    update() {
      this.antimatter.copyFrom(player.antimatter);
      this.antimatterPerSec.copyFrom(Player.antimatterPerSecond);
      this.breakInfinity = player.break;
      this.realities = player.realities;

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

      this.isInMatterChallenge = Player.isInMatterChallenge;
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Player.effectiveMatterAmount);
      }
      this.isInEffarig = Effarig.isRunning;
      if (this.isInEffarig) {
        this.effarigMultNerfText = `${formatPow(0.25 + 0.25 * Effarig.nerfFactor(player.infinityPower), 0, 5)}`;
        this.effarigTickNerfText = `${formatPow(0.7 + 0.1 * Effarig.nerfFactor(player.timeShards), 0, 5)}`;
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

      this.updateCelestial();
      this.updateChallengeDisplay();

      let canCrunch = player.antimatter.gte(Player.infinityGoal);
      const challenge = NormalChallenge.current || InfinityChallenge.current;
      if (!canCrunch || Tabs.current !== Tab.dimensions || (player.break && challenge === undefined)) {
        this.bigCrunch = false;
        this.smallCrunch = false;
        return;
      }
      if (InfinityChallenge.current) canCrunch = player.thisEternityMaxAM.gte(InfinityChallenge.current.goal);
      this.smallCrunch = true;
      const endOfChallenge = challenge !== undefined && !player.options.retryChallenge;
      this.bigCrunch = endOfChallenge || Time.thisInfinityRealTime.totalMinutes > 1;
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
  `<div id="page">
    <link rel="stylesheet" type="text/css" href="stylesheets/new-ui-styles.css">
    <sidebar />
    <div class="game-container">
      <news-ticker v-if="news"/>
      <div v-if="bigCrunch" class="l-new-ui-big-crunch__container">
        <h3>The world has collapsed due to excess antimatter.</h3>
        <button class="btn-big-crunch" onclick="bigCrunchResetRequest()">Big Crunch</button>
      </div>
      <div class="tab-container" v-else>
        <div class="l-reset-buttons-container" v-if="breakInfinity">
          <game-header-eternity-button/>
          <game-header-new-dim-button/>
          <game-header-big-crunch-button/>
        </div>
        <game-header-amounts-line />
        <div class="l-game-header__antimatter-container">
          <p>You have <span class="c-game-header__antimatter">{{format(antimatter, 2, 1)}}</span> antimatter.</p>
          <div>You are getting {{format(antimatterPerSec, 2, 0)}} antimatter per second.</div>
        </div>
        <div class="information-header" >
          <span v-if="isInAnyChallenge">You are currently in {{challengeDisplay}}</span>
          <div v-if="isInEffarig">
            Gamespeed and multipliers dilated {{effarigMultNerfText}}
            <br>
            Tickspeed dilated {{effarigTickNerfText}}
          </div>
          <div v-if="isInLaitela">
            Entropy: {{ laitelaEntropy }} ({{ laitelaTimer }})
          </div>
          <div v-if="isInMatterChallenge">There is {{format(matter, 2, 1)}} matter.</div>
          <br><span v-if="isChallengePowerVisible">{{challengePower}}</span>
          <black-hole-header-row />
        </div>
        <button 
        class="btn-big-crunch btn-big-crunch--small"
        onclick="bigCrunchResetRequest()"
        v-if="smallCrunch && !bigCrunch">Big Crunch</button>
        <slot />
      </div>
    </div>
  </div>`
});
