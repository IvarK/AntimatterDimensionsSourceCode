import { Modal } from "../core/app/modal";

Vue.component("speedrun-status", {
  data() {
    return {
      isActive: false,
      isSegmented: false,
      hasStarted: false,
      startDate: 0,
      saveName: "",
      timePlayedStr: "",
      offlineProgress: false,
      offlineFraction: 0,
      mostRecent: {},
      isCollapsed: false,
    };
  },
  computed: {
    statusText() {
      return this.hasStarted
        ? `<span style="color: var(--color-good)">Running!</span>`
        : `<span style="color: var(--color-bad)">Not Started Yet</span>`;
    },
    segmentText() {
      return this.isSegmented ? "Segmented Speedrun (imported save)" : "Single-segment Speedrun (no save import)";
    },
    offlineText() {
      const stateText = this.offlineProgress
        ? `<span style="color: var(--color-good)">Enabled</span>`
        : `<span style="color: var(--color-bad)">Disabled</span>`;
      const fractionText = this.offlineFraction === 0
        ? "(No offline time used)"
        : `(${formatPercents(this.offlineFraction, 2)} time spent offline)`;
      return `${stateText} ${fractionText}`;
    },
  },
  methods: {
    update() {
      const speedrun = player.speedrun;
      this.isActive = speedrun.isActive;
      this.isSegmented = speedrun.isSegmented;
      this.hasStarted = speedrun.hasStarted;
      this.startDate = speedrun.startDate;
      this.saveName = speedrun.name;
      this.isCollapsed = speedrun.hideInfo;

      this.timePlayedStr = Time.realTimePlayed.toStringShort();
      this.offlineProgress = player.options.offlineProgress;
      this.offlineFraction = speedrun.offlineTimeUsed / Math.clampMin(player.records.realTimePlayed, 1);
      this.mostRecent = speedrun.milestones.length === 0
        ? 0
        : speedrun.milestones[speedrun.milestones.length - 1];
    },
    milestoneName(id) {
      const db = GameDatabase.speedrunMilestones;
      return id === 0 ? "None" : db.find(m => m.id === id).name;
    },
    changeName() {
      if (this.hasStarted) return;
      Modal.changeName.show();
    },
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    collapseText() {
      return `Click to ${this.isCollapsed ? "expand" : "collapse"} Speedrun info`;
    },
    toggleCollapse() {
      player.speedrun.hideInfo = !this.isCollapsed;
    }
  },
  template: `
    <div
      v-if="isActive"
      class="o-speedrun-status"
    >
      <div v-if="!isCollapsed">
        <b>Speedrun Status (<span v-html="statusText" />)</b>
        <br>
        <span @click="changeName">Player Name: {{ saveName }}</span>
        <br>
        <i>{{ segmentText }}</i>
        <br>
        Total real playtime since start: {{ timePlayedStr }}
        <br>
        Offline Progress: <span v-html="offlineText" />
        <br>
        Most Recent Milestone: {{ milestoneName(mostRecent) }}
        <br>
      </div>
      <div
        class="o-speedrun-collapse"
        @click="toggleCollapse"
      >
        <i :class="collapseIcon()" />
        {{ collapseText() }}
        <i :class="collapseIcon()" />
      </div>
    </div>`
});
