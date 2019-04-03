Vue.component("replicanti-gain-text", {
  data: function() {
    return {
      text: String.empty
    };
  },
  methods: {
    update() {
      let modifiedTimePerTick = Time.deltaTimeMs * getGameSpeedupFactor();
      let logGainFactorPerTick = modifiedTimePerTick / 1000 * (Math.log(player.replicanti.chance + 1) * 1000 / getReplicantiInterval());
      let log10GainFactorPerTick = Decimal.pow(Math.E, logGainFactorPerTick).log10();
      if (TimeStudy(192).isBought && player.replicanti.amount.log10() > 308) {
        let postScale = Math.log10(scaleFactor) / scaleLog10;
        let factorGainPerSecond = Decimal.pow(Math.E, Math.log(logGainFactorPerTick * postScale + 1) / postScale * (1000 / Time.deltaTimeMs))
        this.text = `You are gaining x${shorten(factorGainPerSecond, 2, 1)} Replicanti per second`;
      } else if (log10GainFactorPerTick > 308) {
        let galaxiesPerSecond = (1000 / Time.deltaTimeMs) * log10GainFactorPerTick / 308;
        this.text = `You are gaining ${shorten(galaxiesPerSecond, 2, 1)} galaxies per second`;
      } else {
        let totalTime = Math.log10(Number.MAX_VALUE) / (1000 / Time.deltaTimeMs * log10GainFactorPerTick)
        let remainingTime = (Math.log10(Number.MAX_VALUE) - player.replicanti.amount.log10()) / (1000 / Time.deltaTimeMs * log10GainFactorPerTick)
        this.text = `${TimeSpan.fromSeconds(remainingTime)} until Infinite Replicanti (${TimeSpan.fromSeconds(totalTime)} total)`;
      }
    }
  },
  template: `<p>{{text}}</p>`
});