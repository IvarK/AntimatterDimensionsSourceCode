<script>
import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer";

export default {
  name: "HeaderPrestigeGroup",
  components: {
    HeaderCenterContainer,
    HeaderEternityContainer,
    HeaderInfinityContainer,
  },
};
</script>

<template>
  <div class="c-prestige-info-blocks">
    <HeaderEternityContainer class="l-game-header__eternity" />
    <HeaderCenterContainer class="l-game-header__center" />
    <HeaderInfinityContainer class="l-game-header__infinity" />
  </div>
</template>

<style scoped>
.c-prestige-info-blocks {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 14rem;
  color: var(--color-text);
}

.l-game-header__eternity {
  width: 22rem;
  position: absolute;
  left: calc(25% - 22rem);
}

.l-game-header__center {
  width: 50rem;
  position: absolute;
  right: calc(50% - 25rem);
}

.l-game-header__infinity {
  width: 22rem;
  position: absolute;
  right: calc(25% - 22rem);
}
</style>
