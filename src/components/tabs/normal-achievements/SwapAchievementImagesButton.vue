<script>
export default {
  name: "SwapAchievementImagesButton",
  data() {
    return {
      canSwapImages: false,
      isCancerImages: false,
    };
  },
  computed: {
    swapImagesButton() {
      return this.isCancerImages ? "😂" : ":";
    },
    imageSwapperStyleObject() {
      return this.canSwapImages ? { "cursor": "pointer" } : {};
    }
  },
  methods: {
    update() {
      const isCancerTheme = Theme.current().name === "S4";
      this.canSwapImages = !isCancerTheme && Themes.find("S4").isAvailable();
      this.isCancerImages = isCancerTheme || player.secretUnlocks.cancerAchievements;
    },
    swapImages() {
      if (this.canSwapImages) {
        player.secretUnlocks.cancerAchievements = !player.secretUnlocks.cancerAchievements;
      }
    }
  }
};
</script>

<template>
  <span
    :style="imageSwapperStyleObject"
    @click="swapImages"
  >{{ swapImagesButton }}</span>
</template>
