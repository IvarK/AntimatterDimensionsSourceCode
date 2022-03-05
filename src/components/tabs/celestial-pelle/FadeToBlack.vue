<script>
export default {
  name: "FadeToBlack",
  data() {
    return {
      opacity: 0
    };
  },
  methods: {
    update() {
      // Original code
      // this.opacity = (Pelle.endState - 2.5) / 2;
      this.opacity = (player.records.thisReality.realTime - 1e4) / 4000;
    }
  }
};
</script>

<template>
  <div
    class="black-overlay"
    :style="{
      opacity,
      pointerEvents: opacity > 1 ? 'auto' : 'none'
    }"
  />
</template>

<style scoped>
  .black-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    z-index: 8;
  }
</style>
