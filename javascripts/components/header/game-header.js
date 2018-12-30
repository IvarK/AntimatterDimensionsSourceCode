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
      this.isInAnyChallenge = this.challengeDisplay.length != 0;
      this.isInMatterChallenge = ["challenge12", "postc1", "postc6"].includes(player.currentChallenge);
      if (this.isInMatterChallenge) {
        this.matter.copyFrom(Player.effectiveMatterAmount);
      }
      this.antimatter.copyFrom(player.money);
      this.antimatterPerSec.copyFrom(Player.antimatterPerSecond);
      this.updateCelestial();
      this.updateChallengeDisplay();
    },
    updateCelestial: function() {
      if (player.celestials.effarig.run)  this.currCelestial = "Effarig";
      else if (player.celestials.teresa.run)  this.currCelestial = "Teresa";
      else  this.currCelestial = "";
    },
    updateChallengeDisplay: function() {
      // 10/10 quality code
      const actualChallengeIds = [ null, 1, 2, 3, 10, 9, 5, 12, 4, 7, 6, 8, 11 ];
      let inNormalChallenge = player.currentChallenge.startsWith("challenge");
      let inInfinityChallenge = player.currentChallenge.startsWith("postc");
      let inEternityChallenge = player.currentEternityChall.startsWith("eterc");
      let inDilation = player.dilation.active;
      let inCelestialReality = this.currCelestial.length != 0;
      
      // Pls don't hate me Razen
      let displayValue = "";
      if (inCelestialReality) displayValue += " + " + this.currCelestial + " Reality";
      if (inDilation) displayValue += " + Time Dilation";
      if (inEternityChallenge)  displayValue += " + Eternity Challenge " + player.currentEternityChall.substring(5);
      if (inInfinityChallenge)  displayValue += " + Infinity Challenge " + player.currentChallenge.substring(5);
      if (inNormalChallenge)  displayValue += " + Challenge " + actualChallengeIds[parseInt(player.currentChallenge.substring(9))];
      
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
