<script>
export default {
  name: "ClassicBigCrunchButton",
  methods: {
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) bigCrunchResetRequest();
      else Modal.bigCrunch.show();
    }
  }
};
</script>

<template>
  <button
    class="o-tab-btn o-big-crunch-btn"
    @click="handleClick"
  >
    Big Crunch
  </button>
</template>

<style scoped>

</style>
