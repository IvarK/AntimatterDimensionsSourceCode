<script>
import BlobSnowflakes from "@/components/BlobSnowflakes";
import TachyonParticles from "@/components/tabs/time-dilation/TachyonParticles";

export default {
  name: "BackgroundAnimations",
  components: {
    BlobSnowflakes,
    TachyonParticles
  },
  data() {
    return {
      blob: false,
      animateTachyons: false
    };
  },
  methods: {
    update() {
      this.blob = Theme.currentName() === "S11";
      this.animateTachyons = player.options.animations.tachyonParticles &&
        Tabs.current[this.$viewModel.subtab].name === "Time Dilation";
    }
  },
};
</script>

<template>
  <div
    id="ui-background-animations"
    class="l-background-animations"
  >
    <BlobSnowflakes v-if="blob" />
    <TachyonParticles v-if="animateTachyons" />
  </div>
</template>

<style scoped>

</style>