<script>
export default {
  name: "HeaderChallengeEffects",
  data() {
    return {
      isInEffarig: false,
      effarigMultNerfText: "",
      effarigTickNerfText: "",
      isInLaitela: false,
      laitelaTimer: 0,
      laitelaEntropy: "",
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
    }
  },
};
</script>

<template>
  <div>
    <div v-if="isInEffarig">
      Game speed and multipliers are Dilated {{ effarigMultNerfText }}
      <br>
      Tickspeed is Dilated {{ effarigTickNerfText }}
    </div>
    <div v-if="isInLaitela">
      Entropy: {{ laitelaEntropy }} ({{ laitelaTimer }})
    </div>
  </div>
</template>

<style scoped>

</style>
