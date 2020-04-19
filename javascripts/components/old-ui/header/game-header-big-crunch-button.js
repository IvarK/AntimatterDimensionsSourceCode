"use strict";

Vue.component("game-header-big-crunch-button", {
  data() {
    return {
      isVisible: false,
      gainedIP: new Decimal(0),
      currentIPPM: new Decimal(0),
      peakIPPM: new Decimal(0),
      currentIP: new Decimal(0),
      tesseractUnlocked: false,
      tesseractCost: new Decimal(0),
    };
  },
  computed: {
    peakIPPMThreshold: () => new Decimal("1e100"),
    isPeakIPPMVisible() {
      return this.peakIPPM.lte(this.peakIPPMThreshold);
    },
    amountStyle() {
      // If the player is using a dark theme, it should be black instead of white when ratio is 1
      const darkTheme = Theme.current().isDark && Theme.current().name !== "S6";
      if (this.currentIP.lt(1e50)) return darkTheme ? { color: "black" } : { color: "white" };

      const ratio = this.gainedIP.log10() / this.currentIP.log10();
      let rgb;

      if (darkTheme) {
        rgb = [
          Math.round((1 - ratio) * 10 * 255),
          Math.round((ratio - 1) * 10 * 255),
          0
        ];
      } else {
        rgb = [
          Math.round(255 - (ratio - 1) * 10 * 255),
          Math.round(255 - (1 - ratio) * 10 * 255),
          ratio > 1 ? Math.round(255 - (ratio - 1) * 10 * 255)
          : Math.round(255 - (1 - ratio) * 10 * 255)
        ];
      }
      return { color: `rgb(${rgb.join(",")})` };
    },
    classObject() {
      return {
        "c-game-header__tesseract-available": this.tesseractUnlocked && this.currentIP.gt(this.tesseractCost),
      };
    },
  },
  methods: {
    update() {
      this.isVisible = player.break && player.antimatter.gte(Decimal.NUMBER_MAX_VALUE) && !InfinityChallenge.isRunning;
      if (NormalChallenge.isRunning) {
        if (!Enslaved.isRunning || Enslaved.BROKEN_CHALLENGE_EXEMPTIONS.includes(NormalChallenge.current.id)) {
          this.isVisible = false;
        }
      }
      if (!this.isVisible) return;
      const gainedIP = gainedInfinityPoints();
      this.currentIP.copyFrom(player.infinityPoints);
      this.gainedIP.copyFrom(gainedIP);
      this.peakIPPM.copyFrom(player.bestIPminThisInfinity);
      if (this.isPeakIPPMVisible) {
        this.currentIPPM.copyFrom(gainedIP.dividedBy(Time.thisInfinityRealTime.totalMinutes));
      }
      this.tesseractUnlocked = Enslaved.isCompleted;
      this.tesseractCost = Enslaved.tesseractCost;
    }
  },
  template:
    `<button
      v-if="isVisible"
      class="o-prestige-btn o-prestige-btn--big-crunch l-game-header__big-crunch-btn"
      :class="classObject"
      onclick="bigCrunchResetRequest()"
    >
      <b>Big Crunch for
      <span :style="amountStyle">{{format(gainedIP, 2, 0)}}</span>
      Infinity {{ "Point" | pluralize(gainedIP) }}.</b>
      <template v-if="isPeakIPPMVisible">
        <br>
        {{format(currentIPPM, 2, 0)}} IP/min
        <br>
        Peaked at {{format(peakIPPM, 2, 0)}} IP/min
      </template>
    </button>`
});
