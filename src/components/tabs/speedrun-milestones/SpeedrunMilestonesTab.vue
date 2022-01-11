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
    };
  },
  methods: {
    update() {
      const db = GameDatabase.speedrunMilestones;
      const idList = db.map(m => m.id);
      this.milestones = [];

      // Push completed ones in the order of completion, then the rest in numerical order
      for (const completed of idList) {
        const milestone = db.find(m => m.id === completed);
        const time = player.speedrun.records[milestone.key];
        this.milestones.push({
          db: db.find(m => m.id === completed),
          time,
        });
      }
    },
  },
};
</script>

<template>
  <div>
    Milestones will be <i>displayed</i> in a "standard" order, but may be completed in any order.
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
