"use strict";

Vue.component("game-header-new-dim-button", {
  data: function() {
    return {
      isVisible: false,
      requirement: new Decimal(0),
      isAffordable: false
    };
  },
  methods: {
    update() {
      this.isVisible = player.break && !InfinityDimension(8).isUnlocked;
      if (!this.isVisible) return;
      const requirement = InfinityDimensions.next().requirement;
      this.requirement.copyFrom(requirement);
      this.isAffordable = player.antimatter.gte(requirement);
    }
  },
  template:
    `<primary-button
      v-if="isVisible"
      :enabled="isAffordable"
      class="o-primary-btn--new-dim l-game-header__new-dim-btn"
      onclick="InfinityDimensions.unlockNext()"
    >Get {{format(requirement, 0, 0)}} antimatter to unlock a new Dimension.</primary-button>`
});
