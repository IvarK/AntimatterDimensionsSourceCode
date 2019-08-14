Vue.component('normal-achievements-tab', {
  data: function() {
    return {
      achPower: new Decimal(0),
      nextAchIn: 0,
      timeForAchs: 0,
      allAchIn: 0
    };
  },
  methods: {
    update() {
      this.achPower.copyFrom(player.achPow);
      if (player.realities === 0) {
        this.nextAchAt = 0;
        this.timeForAchs = 0;
        this.allAchAt = 0;
        return;
      }
      this.nextAchIn = nextAchIn();
      const totalAchTime = timeForAllAchievements() * 1000;
      this.timeForAchs = totalAchTime;
      this.allAchIn = totalAchTime - player.thisReality;
    },
    timeDisplay: function(value) {
      return timeDisplay(value);
    },
    timeDisplayNoDecimals: function(value) {
      return timeDisplayNoDecimals(value);
    }
  },
  template:
    `<div>
      <div
        class="c-achievements-tab__header"
      >Current achievement multiplier on each Dimension: {{achPower.toFixed(1)}}x</div>
      <div
        v-if="nextAchIn > 0"
        class="c-achievements-tab__header"
      >Next achievement in {{timeDisplayNoDecimals(nextAchIn)}}</div>
      <br>
      <div
        v-if="timeForAchs > 0"
        id="timeForAchievements"
        class="c-achievements-tab__timer"
      >You will gain your achievements back over the span of {{timeDisplay(timeForAchs)}}.</div>
      <div v-if="allAchIn > 0">(Remaining: {{timeDisplay(allAchIn)}})</div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="row in 15" :key="row" :row="row" />
      </div>
    </div>`
});