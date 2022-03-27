<script>
import BlobSnowflakes from "@/components/BlobSnowflakes";

export default {
  name: "BackgroundAnimations",
  components: {
    BlobSnowflakes,
  },
  data() {
    return {
      animateBackground: false,
      blob: false,
    };
  },
  methods: {
    update() {
      this.animateBackground = player.options.animations.background;
      this.blob = player.options.theme === "S11";
    }
  },
};
</script>

<template>
  <BlobSnowflakes v-if="blob" />
</template>