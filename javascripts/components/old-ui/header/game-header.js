"use strict";

Vue.component("game-header", {
  data() {
    return {
      isInEffarig: false,
      effarigMultNerfText: "",
      effarigTickNerfText: "",
      isInLaitela: false,
      laitelaTimer: 0,
      laitelaEntropy: "",
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0)
    };
  },
  methods: {
    update() {
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
      this.antimatter.copyFrom(Currency.antimatter);
      this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
    }
  },
  template: `
    <div>
      <header-challenge-display />
      <div v-if="isInEffarig">
        Gamespeed and multipliers are Dilated {{ effarigMultNerfText }}
        <br>
        Tickspeed is Dilated {{ effarigTickNerfText }}
      </div>
      <div v-if="isInLaitela">
        Entropy: {{ laitelaEntropy }} ({{ laitelaTimer }})
      </div>
      <game-header-amounts-line />
      <div>
        <p>
          You have <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span> antimatter.
        </p>
      </div>
      <div class="l-game-header__buttons-line">
        <game-header-big-crunch-button />
        <game-header-new-dim-button />
        <game-header-eternity-button />
      </div>
      <div>You are getting {{ format(antimatterPerSec, 2, 0) }} antimatter per second.</div>
      <game-header-tickspeed-row />
      <black-hole-header-row />
    </div>`
});
