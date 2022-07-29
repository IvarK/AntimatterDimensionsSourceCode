<script>
export default {
  name: "HeaderBigCrunchButton",
  data() {
    return {
      isVisible: false,
      gainedIP: new Decimal(0),
      currentIPRate: new Decimal(0),
      peakIPRate: new Decimal(0),
      currentIP: new Decimal(0),
      tesseractAffordable: false,
      canCrunch: false,
      infinityGoal: new Decimal(0),
      inAntimatterChallenge: false,
      hover: false,
      headerTextColored: true,
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-infinity-button--unavailable": !this.canCrunch
      };
    },
    // Show IP/min below this threshold, color the IP number above it
    rateThreshold: () => 1e100,
    showIPRate() {
      return this.peakIPRate.lte(this.rateThreshold);
    },
    amountStyle() {
      if (!this.headerTextColored || this.currentIP.lt(this.rateThreshold)) return {
        "transition-duration": "0s"
      };
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };

      // Dynamically generate red-text-green based on the CSS entry for text color. This returns a string
      // as " #xxxxxx" (Yes, there's a leading space). stepRGB is an array specifying the three RGB codes,
      // which is then interpolated in order to generate the final color; only ratios between 0.9-1.1 give
      // a color gradient
      const textHexCode = getComputedStyle(document.body).getPropertyValue("--color-text").substring(2);
      const stepRGB = [
        [255, 0, 0],
        [
          parseInt(textHexCode.substring(0, 2), 16),
          parseInt(textHexCode.substring(2, 4), 16),
          parseInt(textHexCode.substring(4), 16)
        ],
        [0, 255, 0]
      ];
      const ratio = this.gainedIP.log10() / this.currentIP.log10();
      const interFn = index => {
        if (ratio < 0.9) return stepRGB[0][index];
        if (ratio < 1) {
          const r = 10 * (ratio - 0.9);
          return Math.round(stepRGB[0][index] * (1 - r) + stepRGB[1][index] * r);
        }
        if (ratio < 1.1) {
          const r = 10 * (ratio - 1);
          return Math.round(stepRGB[1][index] * (1 - r) + stepRGB[2][index] * r);
        }
        return stepRGB[2][index];
      };
      const rgb = [interFn(0), interFn(1), interFn(2)];
      return {
        color: `rgb(${rgb.join(",")})`,
        "transition-duration": "0.2s"
      };
    },
  },
  methods: {
    update() {
      this.isVisible = player.break;
      this.tesseractAffordable = Tesseracts.canBuyTesseract;
      if (!this.isVisible) return;
      this.canCrunch = Player.canCrunch;
      this.infinityGoal.copyFrom(Player.infinityGoal);
      this.inAntimatterChallenge = Player.isInAntimatterChallenge;
      this.headerTextColored = player.options.headerTextColored;

      const gainedIP = gainedInfinityPoints();
      this.currentIP.copyFrom(Currency.infinityPoints);
      this.gainedIP.copyFrom(gainedIP);
      if (this.showIPRate) {
        this.currentIPRate.copyFrom(gainedIP.dividedBy(Math.clampMin(0.0005, Time.thisInfinityRealTime.totalMinutes)));
      }
      this.peakIPRate.copyFrom(player.records.thisInfinity.bestIPmin);
    },
    switchToInfinity() {
      Tab.dimensions.infinity.show(true);
    },
    crunch() {
      if (!Player.canCrunch) return;
      manualBigCrunchResetRequest();
    }
  },
};
</script>

<template>
  <button
    v-if="isVisible && !tesseractAffordable"
    :class="buttonClassObject"
    class="o-prestige-button o-infinity-button l-game-header__big-crunch-btn"
    @click="crunch"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Crunch -->
    <template v-if="!canCrunch">
      Reach {{ format(infinityGoal, 2, 2) }}
      <br>
      antimatter
    </template>

    <!-- Can Crunch in challenge -->
    <template v-else-if="inAntimatterChallenge">
      Big Crunch to
      <br>
      complete the challenge
    </template>

    <!-- Can Crunch -->
    <template v-else>
      <div v-if="!showIPRate" />
      <b>
        Big Crunch for
        <span :style="amountStyle">{{ format(gainedIP, 2) }}</span>
        Infinity {{ pluralize("Point", gainedIP) }}.
      </b>
      <template v-if="showIPRate">
        <br>
        {{ format(currentIPRate, 2) }} IP/min
        <br>
        Peaked at {{ format(peakIPRate, 2) }} IP/min
      </template>
      <div v-else />
    </template>
  </button>

  <button
    v-else-if="tesseractAffordable"
    class="o-prestige-button l-game-header__big-crunch-btn c-game-header__tesseract-available"
    @click="switchToInfinity"
  >
    <b>
      You have enough Infinity Points to buy a Tesseract
    </b>
  </button>
</template>

<style scoped>

</style>
