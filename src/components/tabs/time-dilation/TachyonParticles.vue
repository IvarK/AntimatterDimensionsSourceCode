<script>
import TachyonParticle from "./TachyonParticle";

export default {
  name: "TachyonParticles",
  components: {
    TachyonParticle
  },
  data() {
    return {
      count: 0,
      initialized: false,
      bounds: {
        x: 0,
        y: 0
      },
      isBlob: false,
    };
  },
  mounted() {
    this.$nextTick(this.updateSize);
    window.addEventListener("resize", this.updateSize);
    this.initialized = true;
  },
  destroyed() {
    window.removeEventListener("resize", this.updateSize);
  },
  methods: {
    update() {
      this.count = Currency.tachyonParticles.gte(1)
        ? Math.clampMin(Math.floor(20 * Math.log10(Currency.tachyonParticles.exponent)), 1)
        : 0;
      this.isBlob = Theme.currentName() === "S11";
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  }
};
</script>

<template>
  <svg
    v-if="initialized"
    class="c-tachyon-particle-container"
  >
    <TachyonParticle
      v-for="i in count"
      :key="i"
      :bounds="bounds"
      :is-blob="isBlob"
    />
  </svg>
</template>

<style scoped>

</style>
