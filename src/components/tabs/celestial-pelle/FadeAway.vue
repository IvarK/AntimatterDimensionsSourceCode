<script>
export default {
  name: "FadeAway",
  data() {
    return {
      opacity: 0
    };
  },
  methods: {
    update() {
      this.opacity = (GameEnd.endState - 2.5) / 2;
    }
  }
};
</script>

<template>
  <div
    class="c-background-overlay"
    :style="{
      opacity,
      pointerEvents: opacity > 1 ? 'auto' : 'none'
    }"
  />
</template>

<style scoped>
.c-background-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
}
</style>
