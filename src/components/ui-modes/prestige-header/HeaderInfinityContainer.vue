<script>
import BigCrunchButton from "./BigCrunchButton";
import PlanetButton from "./PlanetButton";

export default {
  name: "HeaderInfinityContainer",
  components: {
    BigCrunchButton,
    PlanetButton
  },
  data() {
    return {
      showContainer: false,
      infinityPoints: new Decimal(0),
      planetPoints: new Decimal(0),
      isTesseractUnlocked: false,
      tesseractCost: new Decimal(0),
      tesseractText: "",
    };
  },
  methods: {
    update() {
      this.showContainer = player.break || PlayerProgress.infinityUnlocked();
      this.infinityPoints.copyFrom(Currency.infinityPoints.value.floor());
      this.planetPoints.copyFrom(Currency.planetPoints.value.floor());
      this.isTesseractUnlocked = Enslaved.isCompleted;
      this.tesseractCost = Tesseracts.nextCost;
      this.tesseractText = this.tesseractProgress();
    },
    tesseractProgress() {
      const progress = this.infinityPoints.add(1).log10() / this.tesseractCost.log10();
      if (progress > 1) return `<b>(${formatPercents(1)})</b>`;
      return `(${formatPercents(progress, 2, 2)})`;
    },
  },
};
</script>

<template>
  <div
    v-if="showContainer"
    class="c-prestige-button-container"
  >
    <div class="c-infinity-points">
      You have
      <span class="c-game-header__ip-amount">{{ format(infinityPoints, 2) }}</span>
      {{ pluralize("Infinity Point", infinityPoints) }}.
      <span
        v-if="isTesseractUnlocked"
        v-html="tesseractText"
      />
    </div>
    <BigCrunchButton />
    <div class="c-planet-points">
      You have
      <span class="c-game-header__pp-amount">{{ format(planetPoints, 2) }}</span>
      {{ pluralize("Planet Point", planetPoints) }}.
    </div>
    <PlanetButton />
  </div>
</template>

<style scoped>
.c-infinity-points {
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
}

.c-planet-points {
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
}
</style>
