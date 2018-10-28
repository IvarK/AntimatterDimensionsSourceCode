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
      <div style="font-size: 140%">Current achievement multiplier on each Dimension: {{achPower.toFixed(1)}}x</div>
      <div v-if="nextAchIn > 0" style="font-size: 140%">Next achievement in {{timeDisplayNoDecimals(nextAchIn)}}</div>
      <br>
      <div id="timeForAchievements"
        style="color: black; font-size: 12px; width: 40%; margin: 5px auto"
        v-if="timeForAchs > 0">
        You will gain your achievements back over the span of {{timeDisplay(timeForAchs)}}
      </div>
      <div v-if="allAchIn > 0">(Remaining: {{timeDisplay(allAchIn)}}</div>
      <table>
        <tr is="normal-achievement-row" v-for="row in 14" :row="row"></tr>
      </table>
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
        completedrow: this.isCompleted
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
    `<tr :class="classObject">
      <td v-for="column in 8">
        <achievement
          :row="row"
          :column="column">
        </achievement>
      </td>
    </tr>`
});