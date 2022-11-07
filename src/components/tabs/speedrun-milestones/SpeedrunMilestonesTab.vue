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
      milestones: [],
      startTimeStr: "",
      displayAll: false,
    };
  },
  watch: {
    displayAll(newValue) {
      player.speedrun.displayAllMilestones = newValue;
    }
  },
  methods: {
    update() {
      this.displayAll = player.speedrun.displayAllMilestones;
      const db = GameDatabase.speedrunMilestones;
      const idList = db.map(m => m.id);
      this.milestones = [];
      for (const completed of idList) {
        const milestone = db.find(m => m.id === completed);
        const time = player.speedrun.records[milestone.key];
        this.milestones.push({
          db: db.find(m => m.id === completed),
          time,
        });
      }
      // It's possible to complete milestones out of order,
      // so we have to check which was the last completed and show everything up to that + the next one.
      const maxMilestone = this.milestones.map(i => Boolean(i.time)).lastIndexOf(true);
      this.milestones.forEach((m, i) => m.display = this.displayAll || (i <= maxMilestone + 1));
      this.startTimeStr = player.speedrun.startDate === 0
        ? "Speedrun not started yet."
        : `Speedrun started at ${Time.toDateTimeString(player.speedrun.startDate)}`;
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
    <div class="l-speedrun-milestone-tab">
      <SpeedrunMilestoneSingle
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone.db"
        :display="milestone.display"
        :time="milestone.time"
      />
    </div>
  </div>
</template>
