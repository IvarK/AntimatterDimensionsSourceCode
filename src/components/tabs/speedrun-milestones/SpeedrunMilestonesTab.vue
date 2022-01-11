<script>
import SpeedrunMilestoneSingle from "./SpeedrunMilestoneSingle";

export default {
  name: "SpeedrunMilestonesTab",
  components: {
    SpeedrunMilestoneSingle,
  },
  data() {
    return {
      milestones: [],
      startTimeStr: "",
    };
  },
  methods: {
    update() {
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
      this.startTimeStr = player.speedrun.startDate === 0
        ? "Speedrun not started yet."
        : `Speedrun started at ${Time.toDateTimeString(player.speedrun.startDate)}`;
    },
  },
};
</script>

<template>
  <div>
    <b>{{ startTimeStr }}</b>
    <br>
    <div class="l-speedrun-milestone-tab">
      <SpeedrunMilestoneSingle
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone.db"
        :time="milestone.time"
        :gap="milestone.gap"
      />
    </div>
  </div>
</template>
