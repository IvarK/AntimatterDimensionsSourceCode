<script>
import SpeedrunMilestoneSingle from "./SpeedrunMilestoneSingle";

export default {
  name: "SpeedrunMilestonesTab",
  components: {
    SpeedrunMilestoneSingle,
  },
  data() {
    return {
      orderedMilestones: [],
    };
  },
  methods: {
    update() {
      const db = GameDatabase.speedrunMilestones;
      let idList = db.map(m => m.id);
      this.orderedMilestones = [];

      // Push completed ones in the order of completion, then the rest in numerical order
      let lastCompleted = 0;
      for (const completed of player.speedrun.milestones) {
        idList = idList.filter(id => id !== completed);
        const milestone = db.find(m => m.id === completed);
        const time = player.speedrun.records[milestone.key];
        this.orderedMilestones.push({
          db: db.find(m => m.id === completed),
          time,
          gap: time - lastCompleted,
        });
        lastCompleted = time;
      }
      for (const completed of idList) {
        this.orderedMilestones.push({
          db: db.find(m => m.id === completed)
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
        v-for="milestone in orderedMilestones"
        :key="milestone.id"
        :milestone="milestone.db"
        :time="milestone.time"
        :gap="milestone.gap"
      />
    </div>
  </div>
</template>
