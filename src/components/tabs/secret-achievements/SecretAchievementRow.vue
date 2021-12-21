<script>
import SecretAchievement from "./SecretAchievement";

export default {
  name: "SecretAchievementRow",
  components: {
    SecretAchievement
  },
  props: {
    row: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isCompleted: false
    };
  },
  computed: {
    classObject() {
      return {
        "l-achievement-grid__row": true,
        "c-achievement-grid__row--completed": this.isCompleted
      };
    }
  },
  methods: {
    update() {
      this.isCompleted = this.row.every(a => a.isUnlocked);
    }
  }
};
</script>

<template>
  <div :class="classObject">
    <SecretAchievement
      v-for="(achievement, i) in row"
      :key="i"
      :achievement="achievement"
      class="l-achievement-grid__cell"
    />
  </div>
</template>
