<script>
import BlobSnowflake from "@/components/BlobSnowflake";
import BlobBackground from "@/components/BlobBackground";

export default {
  name: "BlobSnowflakes",
  components: {
    BlobSnowflake,
    BlobBackground,
  },
  data() {
    return {
      animateBackground: false,
      count: 0,
      initialized: false,
      bounds: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    this.updateSize();
    window.addEventListener("resize", this.updateSize);
    this.initialized = true;
  },
  destroyed() {
    window.removeEventListener("resize", this.updateSize);
  },
  methods: {
    update() {
      this.animateBackground = player.options.animations.background;
      this.count = player.options.animations.blobSnowflakes;
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  },
};
</script>

<template>
  <div v-if="initialized">
    <svg
      v-if="animateBackground"
      class="c-blob-snowflake-container"
    >
      <BlobSnowflake
        v-for="i in count"
        :key="i"
        :bounds="bounds"
      />
    </svg>
    <svg
      v-else
      class="c-blob-background-container"
    >
      <BlobBackground
        v-for="i in count"
        :key="i"
        :bounds="bounds"
      />
    </svg>
  </div>
</template>

<style scoped>
.c-blob-snowflake-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: visible;
  pointer-events: none;
  user-select: none;
  cursor: default;
}

.c-blob-background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -9999;
  overflow: visible;
  pointer-events: none;
  user-select: none;
  cursor: default;
}
</style>
