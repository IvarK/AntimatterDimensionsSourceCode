"use strict";

Vue.component("normal-achievements-tab", {
  data() {
    return {
      achPower: new Decimal(0),
      timeUntilNext: 0,
      totalDisabledTime: 0,
      remainingDisabledTime: 0
    };
  },
  computed: {
    rows: () => Achievements.rows(1, 15)
  },
  methods: {
    update() {
      this.achPower.copyFrom(GameCache.achievementPower.value.pow(getAdjustedGlyphEffect("effarigachievement")));
      if (player.realities === 0) {
        this.timeUntilNext = 0;
        this.totalDisabledTime = 0;
        this.remainingDisabledTime = 0;
        return;
      }
      this.timeUntilNext = Achievements.timeUntilNext;
      this.totalDisabledTime = Achievements.totalDisabledTime;
      this.remainingDisabledTime = Achievements.remainingDisabledTime;
    },
    timeDisplay(value) {
      return timeDisplay(value);
    },
    timeDisplayNoDecimals(value) {
      return timeDisplayNoDecimals(value);
    }
  },
  template:
    `<div>
      <div
        class="c-achievements-tab__header"
      >Current achievement multiplier on each Dimension: {{ shorten(achPower, 2, 3) }}x</div>
      <div
        v-if="timeUntilNext > 0"
        class="c-achievements-tab__header"
      >Next achievement in {{timeDisplayNoDecimals(timeUntilNext)}}</div>
      <br>
      <div
        v-if="totalDisabledTime > 0"
        id="timeForAchievements"
        class="c-achievements-tab__timer"
      >You will gain your achievements back over the span of {{timeDisplay(totalDisabledTime)}}.</div>
      <div v-if="remainingDisabledTime > 0">(Remaining: {{timeDisplay(remainingDisabledTime)}})</div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="(row, i) in rows" :key="i" :row="row" />
      </div>
    </div>`
});
