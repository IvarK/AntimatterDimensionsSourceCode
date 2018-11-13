Vue.component("replicanti-gain-text", {
  data: function() {
    return {
      text: String.empty
    };
  },
  methods: {
    update() {
      const noModInterval = getReplicantiInterval(true);
      const logInfinity = Math.log(Number.MAX_VALUE);
      const logChance = Math.log(Replicanti.chance + 1);
      const galaxyInterval = logInfinity / logChance * noModInterval;
      if (galaxyInterval < Time.deltaTimeMs / 2) {
        const gps = 1000 / Math.max(galaxyInterval, 0);
        const speed = gps < 1000 ? gps.toPrecision(3) : formatWithCommas(Math.floor(gps));
        this.text = `You gain Approximately ${speed} RGs per Second`;
      } else {
        const est = logChance * 1000 / getReplicantiInterval();
        const estimate = Math.max((logInfinity - Replicanti.amount.ln()) / est, 0);
        const timeSpan = TimeSpan.fromSeconds(estimate);
        this.text = `Approximately ${timeSpan} Until Infinite Replicanti`;
      }
    }
  },
  template: `<p>{{text}}</p>`
});