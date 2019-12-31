"use strict";

Vue.component("game-header-amounts-line", {
  data: function() {
    return {
      showInfinityPoints: false,
      infinityPoints: new Decimal(0),
      showEternityPoints: false,
      eternityPoints: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.showInfinityPoints = Player.totalInfinitied.gt(0) || PlayerProgress.eternityUnlocked();
      if (this.showInfinityPoints) {
        this.infinityPoints.copyFrom(player.infinityPoints);
      }
      this.showEternityPoints = PlayerProgress.eternityUnlocked();
      if (this.showEternityPoints) {
        this.eternityPoints.copyFrom(player.eternityPoints);
      }
    },
    shortenPoints(points) {
      return this.shortenDimensions(points);
    }
  },
  template:
    `<div class="l-game-header__amounts-line">
      <div v-if="showInfinityPoints" class="c-game-header__infinity-points l-game-header__infinity-points">
        You have 
        <span class="c-game-header__ip-amount">{{shortenPoints(infinityPoints)}}</span>
        Infinity {{ "point" | pluralize(infinityPoints) }}.
      </div>
      <div v-if="showEternityPoints" class="c-game-header__eternity-points l-game-header__eternity-points">
        You have 
        <span class="c-game-header__ep-amount">{{shortenPoints(eternityPoints)}}</span>
        Eternity {{ "point" | pluralize(eternityPoints) }}.
      </div>
    </div>`
});