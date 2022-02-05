<script>
export default {
  data() {
    return {
      opacity: 0
    };
  },
  methods: {
    update() {
      this.opacity = (Pelle.endState - 2.5) / 2;
    }
  }
};
</script>

<template>
  <div
    class="black-overlay"
    :style="{ opacity: opacity }"
  />
</template>

<style scoped>
  .black-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: black;
    z-index: 6;
  }
</style>