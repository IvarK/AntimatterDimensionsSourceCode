Vue.component("speedrun-status", {
  data() {
    return {
      isActive: false,
      isImported: false,
      hasStarted: false,
      startDate: 0,
      saveName: "",
      timePlayedStr: "",
      offlineProgress: false,
      offlineFraction: 0,
      mostRecent: {},
    };
  },
  computed: {
    statusText() {
      return this.hasStarted
        ? `<span style="color: var(--color-good)">Running!</span>`
        : `<span style="color: var(--color-bad)">Not Started Yet</span>`;
    },
    segmentText() {
      return this.isImported ? "Segmented Speedrun (imported save)" : "Single-segment Speedrun (no save import)";
    },
    offlineText() {
      const stateText = this.offlineProgress
        ? `<span style="color: var(--color-good)">Enabled</span>`
        : `<span style="color: var(--color-bad)">Disabled</span>`;
      const fractionText = this.offlineFraction === 0
        ? "(No offline time used)"
        : `(${formatPercents(this.offlineFraction, 2)} time spent offline)`;
      return `${stateText} ${fractionText}`;
    }
  },
  methods: {
    update() {
      const speedrun = player.speedrun;
      this.isActive = speedrun.isActive;
      this.isImported = speedrun.isImported;
      this.hasStarted = speedrun.hasStarted;
      this.startDate = speedrun.startDate;
      this.saveName = speedrun.name;

      this.timePlayedStr = Time.totalTimePlayed.toStringShort();
      this.offlineProgress = player.options.offlineProgress;
      this.offlineFraction = speedrun.offlineTimeUsed / Math.clampMin(player.records.totalTimePlayed, 1);
      this.mostRecent = speedrun.mostRecentMilestone;
    },
  },
  template: `
    <div v-if="isActive" class="o-speedrun-status">
      <b>Speedrun Status (<span v-html="statusText" />)</b>
      <br>
      Player Name: {{ saveName }}
      <br>
      <i>{{ segmentText }}</i>
      <br>
      Time since start: {{ timePlayedStr }}
      <br>
      Offline Progress: <span v-html="offlineText" />
      <br>
      Most Recent Milestone: {{ mostRecent }}
    </div>`
});
