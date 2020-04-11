"use strict";

Vue.component("infinity-points-header", {
  data() {
    return {
      infinityPoints: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.infinityPoints.copyFrom(player.infinityPoints);
    }
  },
  template: `
    <div class="c-infinity-tab__header">
      You have
      <span class="c-infinity-tab__infinity-points">{{format(infinityPoints, 2, 0)}}</span>
      {{ "Infinity Point" | pluralize(infinityPoints) }}.
    </div>
  `
});
