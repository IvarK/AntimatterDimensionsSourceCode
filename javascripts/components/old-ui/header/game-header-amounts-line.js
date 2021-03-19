"use strict";

Vue.component("game-header-amounts-line", {
  data() {
    return {
      showInfinityPoints: false,
      infinityPoints: new Decimal(0),
      showEternityPoints: false,
      eternityPoints: new Decimal(0),
      isTesseractUnlocked: false,
      tesseractCost: new Decimal(0),
      tesseractText: "",
    };
  },
  methods: {
    update() {
      this.showInfinityPoints = Player.totalInfinitied.gt(0) || PlayerProgress.eternityUnlocked();
      if (this.showInfinityPoints) {
        this.infinityPoints.copyFrom(Currency.infinityPoints.value.floor());
      }
      this.showEternityPoints = PlayerProgress.eternityUnlocked();
      if (this.showEternityPoints) {
        this.eternityPoints.copyFrom(Currency.eternityPoints.value.floor());
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
  template:
    `<div class="l-game-header__amounts-line">
      <div v-if="showInfinityPoints"
        class="c-game-header__infinity-points l-game-header__infinity-points">
          You have
          <span class="c-game-header__ip-amount">{{formatPoints(infinityPoints)}}</span>
          Infinity {{ "Point" | pluralize(infinityPoints) }}.
          <span v-if="isTesseractUnlocked"
            v-html="tesseractText">
          </span>
      </div>
      <div v-if="showEternityPoints" class="c-game-header__eternity-points l-game-header__eternity-points">
        You have
        <span class="c-game-header__ep-amount">{{formatPoints(eternityPoints)}}</span>
        Eternity {{ "Point" | pluralize(eternityPoints) }}.
      </div>
    </div>`
});
