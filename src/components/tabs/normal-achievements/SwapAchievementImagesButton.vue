<script>
export default {
  name: "SwapAchievementImagesButton",
  data() {
    return {
      canSwapImages: false,
      isCancerImages: false,
      isDoomed: false,
    };
  },
  computed: {
    swapImagesButton() {
      const symbol = this.isDoomed ? "." : ":";
      return this.isCancerImages ? "😂" : symbol;
    },
    imageSwapperStyleObject() {
      return this.canSwapImages ? { "cursor": "pointer" } : {};
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
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
