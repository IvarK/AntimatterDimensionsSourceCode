"use strict";

Vue.component("game-header-amounts-line", {
  data() {
    return {
      showInfinityPoints: false,
      infinityPoints: new Decimal(0),
      showEternityPoints: false,
      showNextEP: false,
      eternityPoints: new Decimal(0),
      nextEP: new Decimal(0),
      isTesseractUnlocked: false,
      tesseractCost: new Decimal(0),
      tesseractText: "",
    };
  },
  methods: {
    update() {
      this.showInfinityPoints = PlayerProgress.infinityUnlocked();
      if (this.showInfinityPoints) {
        this.infinityPoints.copyFrom(Currency.infinityPoints.value.floor());
      }
      this.showEternityPoints = PlayerProgress.eternityUnlocked();
      if (this.showEternityPoints) {
        this.eternityPoints.copyFrom(Currency.eternityPoints.value.floor());
        this.showNextEP = Player.canEternity && player.records.thisReality.maxEP.lt(100) &&
          gainedEternityPoints().lt(100);
        if (this.showNextEP) this.nextEP.copyFrom(requiredIPForEP(gainedEternityPoints().floor().toNumber() + 1));
      }
      this.isTesseractUnlocked = Enslaved.isCompleted;
      this.tesseractCost = Enslaved.tesseractCost;
      this.tesseractText = this.tesseractProgress();
    },
    formatPoints(points) {
      return format(points, 2, 0);
    },
    tesseractProgress() {
      const progress = this.infinityPoints.log10() / this.tesseractCost.log10();
      if (progress > 1) return `<b>(${formatPercents(1)})</b>`;
      return `(${formatPercents(progress, 2, 2)})`;
    },
  },
  template: `
    <div class="l-game-header__amounts-line">
      <div
        v-if="showInfinityPoints"
        class="c-game-header__infinity-points l-game-header__infinity-points"
      >
        You have
        <span class="c-game-header__ip-amount">{{ formatPoints(infinityPoints) }}</span>
        Infinity {{ "Point" | pluralize(infinityPoints) }}.
        <span v-if="isTesseractUnlocked"v-html="tesseractText"></span>
      </div>
      <div v-if="showEternityPoints" class="c-game-header__eternity-points l-game-header__eternity-points">
        You have
        <span class="c-game-header__ep-amount">{{ formatPoints(eternityPoints) }}</span>
        Eternity {{ "Point" | pluralize(eternityPoints) }}.
        <span v-if="showNextEP">(Next EP at {{ format(nextEP, 1) }} IP)</span>
      </div>
    </div>`
});
