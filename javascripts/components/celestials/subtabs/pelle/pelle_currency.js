"use strict";

Vue.component("pelle-currency", {
  props: {
    currency: String,
    rebuyable: Object
  },
  data() {
    return {
      amount: new Decimal(0),
      fillTime: 0,
      timer: 0,
      description: "",
      canBeBought: false,
      showRebuyable: false,
      speedUpgrades: 0,
      unstableMatter: new Decimal(0)
    };
  },
  computed: {
    currencyDisplay() {
      switch (this.currency) {
        case "famine":
          return "Famine";
  
        case "pestilence":
          return "Pestilence";
  
        case "chaos":
          return "Chaos";

        default:
          return "";
      }
    },
    barStyle() {
      return {
        width: `${this.timer / 10 * 100}%`
      };
    },
    upgradeClass() {
      return {
        "pelle-upgrade--canbuy": this.canBeBought
      };
    },
    config() {
      return this.rebuyable.config;
    },
    speedUpgradeConfig() {
      const multiplier = {
        famine: 1,
        pestilence: 100,
        chaos: 1e4
      }
      return {
        cost: 500 * multiplier[this.currency] * (5 ** this.speedUpgrades),
        description: `Gain ${this.currency} 20% faster.`,
        effect: () => 1.2 ** this.speedUpgrades,
        formatEffect: x => formatX(x, 2, 2)
      }
    },
    canBuySpeedUpgrade() {
      return this.unstableMatter.gte(this.speedUpgradeConfig.cost);
    },
    speedUpgradeClass() {
      return {
        "pelle-upgrade--canbuy": this.canBuySpeedUpgrade
      };
    }
  },
  methods: {
    update() {
      this.amount.copyFrom(player.celestials.pelle[this.currency].amount);
      this.timer = player.celestials.pelle[this.currency].timer;

      this.fillTime = Pelle[this.currency].fillTime;
      this.description = Pelle[this.currency].bonusDescription;

      this.canBeBought = this.rebuyable.canBeBought;
      this.speedUpgrades = player.celestials.pelle[this.currency].speedUpgrades;
      this.unstableMatter.copyFrom(player.celestials.pelle.unstableMatter);

      switch (this.config.id) {
        case "permanentTickspeed":
          this.showRebuyable = PelleUpgrade.famineRebuyable.canBeApplied;
          break;

        case "permanentDimensionBoosts":
          this.showRebuyable = PelleUpgrade.pestilenceRebuyable.canBeApplied;
          break;

        case "permanentGalaxies":
            this.showRebuyable = PelleUpgrade.chaosRebuyable.canBeApplied;
            break;
      }
    },
    descriptionDisplay() {
      switch (this.currency) {
        case "famine":
          return `Fill time affected by Dimension Boost amount, currently 
            ${TimeSpan.fromSeconds(Pelle[this.currency].fillTime).toString()}`;
  
        case "pestilence":
          return `Fill time affected by Replicanti amount, currently 
            ${TimeSpan.fromSeconds(Pelle[this.currency].fillTime).toString()}`;

        case "chaos":
          return `Fill time affected by Time Shard amount, currently 
            ${TimeSpan.fromSeconds(Pelle[this.currency].fillTime).toString()}`;

        default:
          return "";
      }
    },
    purchaseSpeedUpgrade() {
      if (!this.canBuySpeedUpgrade) return;
      player.celestials.pelle.unstableMatter = player.celestials.pelle.unstableMatter.minus(this.speedUpgradeConfig.cost);
      player.celestials.pelle[this.currency].speedUpgrades++;
    }
  },
  template:
  `<div class="pelle-currency">
    <div class="pelle-currency--progress-bar">
      <div class="pelle-currency--progress-bar--fill" :style="barStyle"/>
      <h2><b>{{ format(amount, 2, 0) }}</b> {{ currencyDisplay }}</h2>
    </div>
    <p>{{ descriptionDisplay() }}</p>
    <p>{{ description }}</p>
    <div
      class="pelle-upgrade"
      :class="speedUpgradeClass" 
      @click="purchaseSpeedUpgrade()">
      <description-display :config="speedUpgradeConfig"/>
      <effect-display br :config="speedUpgradeConfig" />
      <cost-display br
        :config="speedUpgradeConfig"
        singular="Unstable Matter"
        plural="Unstable Matter"
      />
    </div>
    <div
      v-if="showRebuyable"
      class="pelle-upgrade"
      :class="upgradeClass" 
      @click="rebuyable.purchase()">
      <description-display :config="config"/>
      <effect-display br :config="config" />
      <cost-display br
        :config="config"
        :singular="rebuyable.currencyDisplay"
        :plural="rebuyable.currencyDisplay"
      />
    </div>
  </div>
  `
});