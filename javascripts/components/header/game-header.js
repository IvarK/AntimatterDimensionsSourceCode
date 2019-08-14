Vue.component("game-header", {
  data: function() {
    return {
      isInAnyChallenge: false,
      isInMatterChallenge: false,
      matter: new Decimal(0),
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0),
      currCelestial: "",
      challengeDisplay: ""
    };
  },
  computed: {
    classObject: function() {
      return {
        "l-game-header--hidden": this.$viewModel.bigCrunch
      };
    }
  },
  methods: {
    update() {
      this.isInAnyChallenge = this.challengeDisplay.length !== 0;
      this.isInMatterChallenge = Player.isInMatterChallenge;
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Player.effectiveMatterAmount);
      }
      this.antimatter.copyFrom(player.money);
      this.antimatterPerSec.copyFrom(Player.antimatterPerSecond);
      this.updateCelestial();
      this.updateChallengeDisplay();
    },
    updateCelestial: function() {
      if (Teresa.isRunning) this.currCelestial = "Teresa's";
      else if (Effarig.isRunning) this.currCelestial = "Effarig's";
      else if (Enslaved.isRunning) this.currCelestial = "The Enslaved Ones'";
      else if (V.isRunning) this.currCelestial = "V'";
      else if (Ra.isRunning) this.currCelestial = "Ra'";
      else if (Laitela.isRunning) this.currCelestial = "Lai'tela"
      else this.currCelestial = String.empty;
    },
    updateChallengeDisplay: function() {
      // Pls don't hate me Razen
      let displayValue = "";

      let inCelestialReality = this.currCelestial.length !== 0;
      if (inCelestialReality) displayValue += " + " + this.currCelestial + " Reality";

      let inDilation = player.dilation.active;
      if (inDilation) displayValue += " + Time Dilation";

      const challenge = Challenge.current();
      if (challenge !== undefined) displayValue += ` + ${challenge.config.reward} Challenge `;

      const infinityChallenge = InfinityChallenge.current();
      if (infinityChallenge !== undefined) displayValue += ` + Infinity Challenge ${infinityChallenge.id}`;

      const eternityChallenge = EternityChallenge.current();
      if (eternityChallenge !== undefined) displayValue += ` + Eternity Challenge ${eternityChallenge.id}`;

      if (displayValue.length != 0) this.challengeDisplay = displayValue.substring(3);
      else if (PlayerProgress.infinityUnlocked()) this.challengeDisplay = "the Antimatter Universe (no active challenges)";
      else  this.challengeDisplay = "";
    }
  },
  template:
    `<div :class="classObject">
      <div v-if="isInAnyChallenge">You are currently in {{challengeDisplay}}</div>
      <div v-if="isInMatterChallenge">There is {{shortenMoney(matter)}} matter.</div>
        <game-header-amounts-line />
        <div>
          <p>You have <span class="c-game-header__antimatter">{{shortenMoney(antimatter)}}</span> antimatter.</p>
        </div>
        <div class="l-game-header__buttons-line">
          <game-header-big-crunch-button />
          <game-header-new-dim-button />
          <game-header-eternity-button />
        </div>
        <div>You are getting {{shortenDimensions(antimatterPerSec)}} antimatter per second.</div>
        <game-header-tickspeed-row />
    </div>`
});
