<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SpeedrunMilestoneSingle from "./SpeedrunMilestoneSingle";

export default {
  name: "SpeedrunMilestonesTab",
  components: {
    PrimaryToggleButton,
    SpeedrunMilestoneSingle,
  },
  data() {
    return {
      milestoneTimes: [],
      maxMilestone: 1,
      startTimeStr: "",
      displayAll: false,
      isSpectating: false,
    };
  },
  computed: {
    milestones: () => GameDatabase.speedrunMilestones,
    spectateText() {
      return this.isSpectating
        ? "Times here are unaffected by END so that you can see your final records"
        : null;
    }
  },
  watch: {
    displayAll(newValue) {
      player.speedrun.displayAllMilestones = newValue;
    }
  },
  methods: {
    update() {
      this.milestoneTimes = [...player.speedrun.records];
      this.maxMilestone = this.milestoneTimes.map(i => Boolean(i)).lastIndexOf(true) + 1;
      this.startTimeStr = player.speedrun.startDate === 0
        ? "Speedrun not started yet."
        : `Speedrun started at ${Time.toDateTimeString(player.speedrun.startDate)}`;
      this.displayAll = player.speedrun.displayAllMilestones;
      this.isSpectating = GameEnd.endState > END_STATE_MARKERS.SPECTATE_GAME;
    },
  },
};
</script>

<template>
  <div>
    <PrimaryToggleButton
      v-model="displayAll"
      class="o-primary-btn--subtab-option"
      label="Describe all milestones:"
    />
    <br>
    <b>{{ startTimeStr }}</b>
    <br>
    <b>{{ spectateText }}</b>
    <br>
    <div class="l-speedrun-milestone-tab">
      <SpeedrunMilestoneSingle
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :display="displayAll || milestone.id <= maxMilestone"
        :time="milestoneTimes[milestone.id]"
      />
    </div>
  </div>
</template>
