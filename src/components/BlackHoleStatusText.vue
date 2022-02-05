<script>
export default {
  name: "BlackHoleStatusText",
  props: {
    blackHole: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      state: "",
    };
  },
  computed: {
    id() {
      return this.blackHole.id;
    }
  },
  methods: {
    update() {
      const { blackHole } = this;
      this.isUnlocked = blackHole.isUnlocked;
      this.state = blackHole.displayState;
    }
  }
};
</script>

<template>
  <span v-if="isUnlocked">
    🌀{{ id }}:<span v-html="state" />
  </span>
</template>

<style scoped>

</style>
