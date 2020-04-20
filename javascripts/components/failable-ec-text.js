"use strict";

Vue.component("failable-ec-text", {
  data() {
    return {
      currentResource: new Decimal(0),
      maximumResource: new Decimal(0),
      currentEternityChallengeId: 0
    };
  },
  computed: {
    textStyle() {
      if (this.maximumResource.eq(0)) return {};

      const ratio = this.currentResource.div(this.maximumResource).toNumber();
      // Goes from green to yellow to red. If theme is light, use a slightly lighter yellow
      // by not allowing full red and gree at the same time.
      const darkTheme = Theme.current().isDark && Theme.current().name !== "S6";
      let c = darkTheme ? 2 : 1.5;
      let rgb = [
        Math.round(Math.min(c * ratio, 1) * 255),
        Math.round(Math.min(c * (1 - ratio), 1) * 255),
        0
      ];
      
      return { color: `rgb(${rgb.join(",")})` };
    },
    text() {
      if (this.currentEternityChallengeId === 4) {
        return `${formatInt(this.currentResource)} / ${formatInt(this.maximumResource)} Infinities used`;
      }
      if (this.currentEternityChallengeId === 12) {
        return `${TimeSpan.fromSeconds(this.currentResource.toNumber()).toString()} /
          ${TimeSpan.fromSeconds(this.maximumResource.toNumber()).toString()} time spent`;
      }
    }
  },
  methods: {
    update() {
      if (EternityChallenge.current && [4, 12].includes(EternityChallenge.current.id)) {
        this.currentEternityChallengeId = EternityChallenge.current.id;
        this.currentResource = (this.currentEternityChallengeId === 4)
          ? player.infinitied : new Decimal(Time.thisEternity.totalSeconds);
        this.maximumResource = new Decimal(EternityChallenge.current.config.restriction(
          EternityChallenge.current.completions));
      }
    },
  },
  template:
  `<span> - <span :style="textStyle">{{text}}</span></span>`
});