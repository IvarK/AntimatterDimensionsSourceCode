"use strict";

Vue.component("eternity-points-header", {
  data() {
    return {
      eternityPoints: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.eternityPoints.copyFrom(player.eternityPoints.floor());
    }
  },
  template: `
    <div class="c-eternity-tab__header">
      You have
      <span class="c-eternity-tab__eternity-points">{{format(eternityPoints, 2, 0)}}</span>
      {{ "Eternity Point" | pluralize(eternityPoints) }}.
    </div>
  `
});
