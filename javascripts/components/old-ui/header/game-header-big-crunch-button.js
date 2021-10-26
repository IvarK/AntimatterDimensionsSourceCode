"use strict";

Vue.component("game-header-big-crunch-button", {
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
      if (!this.headerTextColored || this.currentIP.lt(this.rateThreshold)) return {};
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };

      const ratio = this.gainedIP.log10() / this.currentIP.log10();
      const rgb = [
        Math.round(255 - (ratio - 1) * 10 * 255),
        Math.round(255 - (1 - ratio) * 10 * 255),
        ratio > 1
          ? Math.round(255 - (ratio - 1) * 10 * 255)
          : Math.round(255 - (1 - ratio) * 10 * 255)
      ];
      return {
        color: `rgb(${rgb.join(",")})`,
        "transition-duration": "0.2s"
      };
    },
  },
  methods: {
    update() {
      this.isVisible = player.break;
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
        this.peakIPRate.copyFrom(player.records.thisInfinity.bestIPmin);
      }
      this.tesseractAffordable = Tesseracts.canBuyTesseract;
    },
    switchToInfinity() {
      Tab.dimensions.infinity.show(true);
    },
  },
  template: `
    <button
      v-if="isVisible && !tesseractAffordable"
      :class="buttonClassObject"
      class="o-prestige-button o-infinity-button l-game-header__big-crunch-btn"
      onclick="bigCrunchResetRequest()"
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
          Infinity {{ "Point" | pluralize(gainedIP) }}.
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
    </button>`
});
