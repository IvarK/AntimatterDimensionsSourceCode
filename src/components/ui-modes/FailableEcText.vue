<script>
export default {
  name: "FailableEcText",
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
      // by not allowing full red and green at the same time.
      const darkTheme = Theme.current().isDark() && Theme.current().name !== "S6";
      // Setting this constant to 2 will give green - yellow - red, setting it to 1
      // will give a straight line between green and red in colorspace, intermediate values
      // will give intermediate results.
      // The last factor in the green term darkens the text on light themes to provide better contrast
      const c = darkTheme ? 2 : 1.5;
      const rgb = [
        Math.round(Math.min(c * ratio, 1) * 255),
        Math.round(Math.min(c * (1 - ratio), 1) * 255 * (darkTheme ? 1 : 0.7)),
        0
      ];

      return { color: `rgb(${rgb.join(",")})` };
    },
    text() {
      if (this.currentEternityChallengeId === 4) {
        return `${formatInt(this.currentResource)} / ${formatInt(this.maximumResource)} Infinities used`;
      }
      // We're always either in EC4 or EC12 when displaying this text.
      return `${TimeSpan.fromSeconds(this.currentResource.toNumber()).toString()} /
        ${TimeSpan.fromSeconds(this.maximumResource.toNumber()).toString()} time spent`;
    }
  },
  methods: {
    update() {
      if (EternityChallenge.current && [4, 12].includes(EternityChallenge.current.id)) {
        this.currentEternityChallengeId = EternityChallenge.current.id;
        if (this.currentEternityChallengeId === 4) {
          this.currentResource.copyFrom(Currency.infinities);
        } else {
          this.currentResource = new Decimal(Time.thisEternity.totalSeconds);
        }
        this.maximumResource = new Decimal(EternityChallenge.current.config.restriction(
          EternityChallenge.current.completions));
      }
    },
  },
};
</script>

<template>
  <span> - <span :style="textStyle">{{ text }}</span></span>
</template>

<style scoped>

</style>
