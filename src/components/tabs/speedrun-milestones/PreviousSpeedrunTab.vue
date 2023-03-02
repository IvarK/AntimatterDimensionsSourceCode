<script>
import PreviousSpeedrunInfo from "./PreviousSpeedrunInfo";
import PrimaryButton from "@/components/PrimaryButton";
import SpeedrunMilestoneCompare from "./SpeedrunMilestoneCompare";

export default {
  name: "PreviousSpeedrunTab",
  components: {
    PrimaryButton,
    SpeedrunMilestoneCompare,
    PreviousSpeedrunInfo,
  },
  data() {
    return {
      milestoneTimes: [],
      displayBest: false,
      isSpectating: false,
      selectedRun: 0,
    };
  },
  computed: {
    milestones: () => GameDatabase.speedrunMilestones,
    previousRuns() {
      const keys = Object.keys(player.speedrun.previousRuns);
      const allRuns = [];
      for (const key of keys) {
        const run = player.speedrun.previousRuns[key];
        run.id = Number(key);
        allRuns.push(run);
      }
      return allRuns;
    },
    bestPreviousTimes() {
      const recLength = GameDatabase.speedrunMilestones.length + 1;
      const bestTimes = Array.repeat(0, recLength);
      const bestRunIndices = [...bestTimes];
      for (const index of Object.keys(player.speedrun.previousRuns)) {
        const run = player.speedrun.previousRuns[index].records;
        for (let rec = 0; rec < recLength; rec++) {
          if (run[rec] !== 0 && (run[rec] < bestTimes[rec] || bestTimes[rec] === 0)) {
            bestTimes[rec] = run[rec];
            bestRunIndices[rec] = index;
          }
        }
      }

      const milestoneList = Array.repeat({}, recLength);
      for (let rec = 0; rec < recLength; rec++) {
        milestoneList[rec] = { time: bestTimes[rec], index: bestRunIndices[rec] };
      }
      return milestoneList;
    },
    numRuns() {
      return Object.keys(this.previousRuns).length;
    },
    spectateText() {
      return this.isSpectating
        ? "Numbers here are unaffected by END so that you can see your final records"
        : null;
    }
  },
  watch: {
    displayBest(newValue) {
      player.speedrun.compareBest = newValue;
    }
  },
  methods: {
    update() {
      this.milestoneTimes = [...player.speedrun.records];
      this.isSpectating = GameEnd.endState > END_STATE_MARKERS.SPECTATE_GAME;
      this.displayBest = player.speedrun.compareBest;
    },
    selectRun(index) {
      this.selectedRun = index;
    }
  },
};
</script>

<template>
  <div class="c-previous-runs">
    <b>You have completed {{ quantify("speedrun", numRuns, 0, 0, x => x) }} prior to this playthrough.</b>
    <b>Statistics of previous runs are below, mouseover icons for more details.</b>
    <b>Click the magnifying glass to compare the milestones on a particular run to this run.</b>
    <b>{{ spectateText }}</b>
    <br>
    <div class="c-previous-runs">
      <span
        v-for="run in previousRuns"
        :key="run.id"
        class="c-single-run"
      >
        <PrimaryButton
          class="o-primary-btn--subtab-option fas fa-magnifying-glass"
          :class="{ 'o-selected-btn' : selectedRun === run.id }"
          @click="selectRun(run.id)"
        />
        <PreviousSpeedrunInfo
          :prev-run-info="run"
        />
      </span>
    </div>
    <br>
    <div class="c-legend">
      <div class="c-legend-row">
        <span class="o-box l-milestone-none" /> Not reached this run
      </div>
      <div class="c-legend-row">
        <span class="o-box l-milestone-slow" /> Slower than comparison
      </div>
      <div class="c-legend-row">
        <span class="o-box l-milestone-fast" /> Faster than comparison
      </div>
      <div class="c-legend-row">
        <span class="o-box l-milestone-fastest" /> Faster than best
      </div>
    </div>
    <div class="l-speedrun-milestone-tab">
      <SpeedrunMilestoneCompare
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :curr-time="milestoneTimes[milestone.id]"
        :ref-time="selectedRun ? previousRuns.find(run => run.id === selectedRun).records[milestone.id] : null"
        :best-time="bestPreviousTimes[milestone.id].time"
        :run-indices="[selectedRun, bestPreviousTimes[milestone.id].index]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-previous-runs {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}

.c-single-run {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  border: 0.1rem solid;
}

.o-selected-btn {
  background-color: var(--color-good);
}

.c-legend {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 95rem;
}

.c-legend-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 30rem;
  font-size: 1.5rem;
}

.o-box {
  display: grid;
  width: 2rem;
  height: 2rem;
  margin: 0.3rem;
  border: var(--var-border-width, 0.2rem) solid var(--color-text);
  border-radius: var(--var-border-radius, 0.5rem);
}

.l-milestone-none {
  background-color: var(--color-base);
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
