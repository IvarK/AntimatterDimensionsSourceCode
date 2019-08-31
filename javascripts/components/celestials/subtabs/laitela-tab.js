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
      showReset: false
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
      this.showReset = this.higgs.gt(0) || this.higgsGain.gt(0);
    },
    startRun() {
      Laitela.startRun();
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
    unlockClassObject(info) {
      return {
        "o-laitela-shop-button--bought": this.hasUnlock(info), 
        "o-laitela-shop-button--available": this.canBuyUnlock(info)
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
    upgrades: () => AnnihilationUpgrade.all
  },
  template:
    `<div class="l-laitela-celestial-tab">
      <button class="o-laitela-run-button" @click="startRun">
        <b>Start Lai'tela's Reality</b>
        <div class="o-laitela-run-button__icon">ᛝ</div>
        Tickspeed is disabled and all dimension multipliers are decreased based on matter, 
        currently <b>x^{{ shorten(dimMultNerf, 3, 4) }}</b>
        <br>
        Multiply all dark matter dimensions based on highest AM reached, 
        Currently: <b>{{ shorten(realityReward, 2, 3)}}x</b>
      </button>
      <div class="o-laitela-matter-amount">You have {{ shorten(matter, 2, 0) }} Dark Matter</div>
      <div>Dark Matter causes your dimension cost multipliers to increase {{ matterEffectPercentage }} slower</div>
      <matter-dimension-row
        v-for="i in activeDimensions"
        :key="i"
        :dimension="dimensions[i]"
      />
      <div>{{ nextUnlock }}</div>
      <button class="c-laitela-annihilation-button" @click="annihilate()" v-if="showReset">
        <h2>Annihilation</h2>
        <p>
          Resets your dark matter dimensions and Dark Matter, but gain <b>{{ shorten(higgsGain, 2, 0) }}</b> 
          Higgs {{"Boson" | pluralize(higgsGain)}}
        </p>
      </button>
      <div>You have {{ shorten(higgs, 2, 0)}} Higgs {{"Boson" | pluralize(higgs)}}</div>
      <div class="l-laitela-unlocks-container" v-if="showReset">
        <button 
          v-for="upgrade in upgrades" 
          :key="upgrade.id" 
          class="o-laitela-shop-button"
          :class="{'o-laitela-shop-button--available': upgrade.canBeBought }"
          @click="upgrade.purchase()"> 
            {{ upgrade.description }} <br/> Costs: <b>{{ shorten(upgrade.cost, 2, 0) }}</b> Higgs Bosons 
            <br/>Currently: {{ upgrade.formattedEffect }}, Next: {{ upgrade.formattedNextEffect }}
        </button>
      </div>
    </div>`
});