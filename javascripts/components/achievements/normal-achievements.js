Vue.component('normal-achievements', {
  data: function() {
    return {
      achPower: new Decimal(0),
      nextAchIn: 0,
      timeForAchs: 0,
      allAchIn: 0
    };
  },
  created() {
    // To prevent flickering
    this.update();
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
      >You will gain your achievements back over the span of {{timeDisplay(timeForAchs)}}</div>
      <div v-if="allAchIn > 0">(Remaining: {{timeDisplay(allAchIn)}}</div>
      <div class="l-achievement-grid">
        <normal-achievement-row v-for="row in 14" :key="row" :row="row" />
      </div>
    </div>`
});

Vue.component('normal-achievement-row', {
  props: {
    row: Number
  },
  data: function() {
    return {
      isCompleted: false,
      updateStateAt: 0
    };
  },
  computed: {
    classObject: function() {
      return {
        "l-achievement-grid__row": true,
        "c-achievement-grid__row--completed": this.isCompleted
      };
    }
  },
  created() {
    this.on$(GameEvent.ACHIEVEMENT_UNLOCKED, this.updateState);
    this.on$(GameEvent.REALITY, this.updateState);
    this.updateState();
  },
  methods: {
    update() {
      if (this.isCompleted || this.updateStateAt === 0) return;
      if (new Date().getTime() < this.updateStateAt) return;
      this.updateState();
    },
    updateState() {
      const unlockState = Array.from({length: 8}, (v, i) => `r${this.row}${i + 1}`)
        .map(achId => isAchEnabled(achId));
      if (!unlockState.includes(false)) {
        this.isCompleted = true;
        return;
      }
      this.isCompleted = false;
      if (player.realities === 0) {
        this.updateStateAt = 0;
        return;
      }
      this.updateStateAt = new Date().getTime() + nextAchIn();
    }
  },
  template:
    `<div :class="classObject">
      <achievement
        v-for="column in 8"
        :key="column"
        :row="row"
        :column="column"
        class="l-achievement-grid__cell"
      />
    </div>`
});