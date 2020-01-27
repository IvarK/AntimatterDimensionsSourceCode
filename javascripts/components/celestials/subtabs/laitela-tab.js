"use strict";

Vue.component("laitela-tab", {
  data() {
    return {
      matter: new Decimal(0),
      nextUnlock: "",
      matterEffectPercentage: "",
      dimMultNerf: 0,
      activeDimensions: [],
      higgs: new Decimal(0),
      higgsGain: new Decimal(0),
      showReset: false,
      darkEnergyChance: 0,
      darkEnergy: 0,
      annihilated: false,
    };
  },
  methods: {
    update() {
      this.matter.copyFrom(player.celestials.laitela.matter);
      this.nextUnlock = Laitela.nextMatterDimensionThreshold;
      this.matterEffectPercentage = Laitela.matterEffectPercentage;
      this.dimMultNerf = Laitela.dimMultNerf;
      this.realityReward = Laitela.realityReward;
      this.activeDimensions = Array.range(0, 4).filter(i => MatterDimension(i + 1).amount.neq(0));
      this.higgs.copyFrom(player.celestials.laitela.higgs);
      this.higgsGain.copyFrom(Laitela.higgsGain);
      this.annihilated = player.celestials.laitela.annihilated;
      this.showReset = this.annihilated || this.higgsGain.gt(0);
      this.darkEnergyChance = Laitela.darkEnergyChance;
      this.darkEnergy = player.celestials.laitela.darkEnergy;
      this.isRunning = Laitela.isRunning;
    },
    startRun() {
      if (this.isRunning) startRealityOver();
      else Laitela.startRun();
    },
    buyUnlock(info) {
      Laitela.buyUnlock(info);
    },
    hasUnlock(info) {
      return Laitela.has(info);
    },
    canBuyUnlock(info) {
      return Laitela.canBuyUnlock(info);
    },
    runButtonClassObject() {
      return {
        "o-laitela-run-button__icon": true,
        "o-laitela-run-button__icon--running": this.isRunning,
      };
    },
    unlockClassObject(upgrade) {
      return {
        "o-laitela-shop-button--bought": upgrade.isBought,
        "o-laitela-shop-button--available": upgrade.canBeBought
      };
    },
    annihilate() {
      Laitela.annihilate();
    }
  },
  computed: {
    dimensions: () => MatterDimensionState.list,
    runUnlockThresholds: () => laitelaRunUnlockThresholds,
    unlocksInfo: () => LAITELA_UNLOCKS,
    upgrades: () => AnnihilationUpgrade.all,
    darkEnergyUpgrades: () => DarkEnergyUpgrade.all
  },
  template:
    `<div class="l-laitela-celestial-tab">
      <div class="o-laitela-matter-amount">You have {{ format(matter, 2, 0) }} Dark Matter</div>
      <div v-if="annihilated">You have {{ format(higgs, 2, 0)}} Higgs {{"Boson" | pluralize(higgs)}}</div>
      <div v-if="higgs.gt(0)">Which cause you to have a {{ (darkEnergyChance * 100).toFixed(3) }}% chance of generating dark energy each dimension interval</div>
      <div v-if="darkEnergy > 0">You have {{ format(darkEnergy, 2, 0)}} Dark Energy</div>
      <div class="l-laitela-mechanics-container">
        <div>
          <matter-dimension-row
            v-for="i in activeDimensions"
            :key="i"
            :dimension="dimensions[i]"
            />
          <div>{{ nextUnlock }}</div>
        </div>
        <div class="l-laitela-unlocks-container" v-if="showReset">
          <button
            v-for="upgrade in upgrades"
            :key="upgrade.id"
            class="o-laitela-shop-button"
            :class="{'o-laitela-shop-button--available': upgrade.canBeBought }"
            @click="upgrade.purchase()">
              {{ upgrade.description }} <br/> Costs: <b>{{ format(upgrade.cost, 2, 0) }}</b> Higgs Bosons
              <br/>Currently: {{ upgrade.formattedEffect }}, Next: {{ upgrade.formattedNextEffect }}
          </button>
        </div>
      </div>
      <div class="l-laitela-mechanics-lower">
        <div class="l-laitela-buttons-container">
          <button class="o-laitela-run-button" @click="startRun">
            <b>Start Lai'tela's Reality</b>
            <div v-bind:class="runButtonClassObject()"></div>
            Tickspeed is disabled and all dimension multipliers are decreased based on dark matter,
            currently <b>x^{{ format(dimMultNerf, 3, 4) }}</b>
            <br>
            Multiply all dark matter dimensions based on highest AM reached,
            Currently: <b>{{ format(realityReward, 2, 3)}}x</b>
          </button>
          <button class="c-laitela-annihilation-button" @click="annihilate()" v-if="showReset">
            <h2>Annihilation</h2>
            <p>
              Resets your dark matter dimensions and Dark Matter, but gain <b>{{ format(higgsGain, 2, 0) }}</b>
              Higgs {{"Boson" | pluralize(higgsGain)}}
            </p>
          </button>
        </div>
        <div class="l-laitela-dark-energy-upgrades">
          <button
            v-for="upgrade in darkEnergyUpgrades"
            :key="upgrade.id"
            class="o-laitela-shop-button--dark-energy"
            :class="unlockClassObject(upgrade)"
            @click="upgrade.purchase()">
              {{ upgrade.description }} <br/> Costs: <b>{{ format(upgrade.cost, 2, 0) }}</b> Dark Energy
              <br/>{{ upgrade.formattedEffect }}
          </button>
        </div>
      </div>
    </div>`
});
