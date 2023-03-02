<script>
export default {
  name: "SpeedrunMilestoneCompare",
  props: {
    milestone: {
      type: Object,
      required: true
    },
    currTime: {
      type: Number,
      required: false,
      default: 0,
    },
    refTime: {
      type: Number,
      required: false,
      default: 0,
    },
    bestTime: {
      type: Number,
      required: true,
    },
    runIndices: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      realTime: 0,
    };
  },
  computed: {
    classObject() {
      const hasTime = this.currTime > 0 && this.refTime > 0;
      return {
        "l-speedrun-milestone-entry": true,
        "l-milestone-slow": hasTime && this.currTime > this.refTime,
        "l-milestone-fast": hasTime && this.currTime < this.refTime,
        "l-milestone-fastest": hasTime && this.currTime < this.bestTime,
      };
    },
  },
  methods: {
    update() {
      this.realTime = player.records.realTimePlayed;
    },
    timeString(ms, showGap) {
      const timeStr = TimeSpan.fromMilliseconds(ms).toStringShort(true, true);
      const diff = this.currTime > 0 ? this.currTime - ms : this.realTime - ms;
      let gapStr = TimeSpan.fromMilliseconds(Math.abs(diff)).toStringShort(true, true);
      gapStr = `${this.currTime > ms ? "-" : "+"}${gapStr}`;
      return ms > 0
        ? `${timeStr}${showGap ? ` (${gapStr})` : ""}`
        : "Not reached yet";
    },
    timeStyle(time) {
      const isFastest = time === [this.currTime, this.refTime, this.bestTime].filter(t => t !== 0).min();
      return {
        color: "var(--color-text)",
        opacity: isFastest ? 1 : 0.85,
        "font-weight": isFastest ? "bold" : null,
      };
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <span class="l-milestone-title">{{ milestone.name }}</span>
    <span :style="timeStyle(currTime)">Current run: {{ timeString(currTime) }}</span>
    <span
      v-if="refTime"
      :style="timeStyle(refTime)"
    >
      Run {{ runIndices[0] }}: {{ timeString(refTime, true) }}
    </span>
    <span :style="timeStyle(bestTime)">Best ({{ runIndices[1] }}): {{ timeString(bestTime, true) }}</span>
  </div>
</template>

<style scoped>
.l-milestone-title {
  font-size: 1.3rem;
  text-decoration: underline;
}

.l-milestone-slow {
  background-color: var(--color-bad);
}

.l-milestone-fast {
  background-color: var(--color-good);
}

.l-milestone-fastest {
  background-color: var(--color-celestials);
}
</style>
