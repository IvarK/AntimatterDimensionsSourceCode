Vue.component("game-header-new-dim-button", {
  data() {
    return {
      isVisible: false,
      requirement: new Decimal(0),
      isAffordable: false,
      anyInfinityDimensionUnlocked: false
    };
  },
  methods: {
    update() {
      this.isVisible = player.break && !InfinityDimension(8).isUnlocked && !Player.canEternity &&
        !EternityMilestone.autoUnlockID.isReached;
      if (!this.isVisible) return;
      const requirement = InfinityDimensions.next().requirement;
      this.requirement.copyFrom(requirement);
      this.isAffordable = player.records.thisEternity.maxAM.gte(requirement);
      this.anyInfinityDimensionUnlocked = InfinityDimension(1).isUnlocked;
    }
  },
  template: `
    <primary-button
      v-if="isVisible"
      :enabled="isAffordable"
      class="o-primary-btn--new-dim l-game-header__new-dim-btn"
      onclick="InfinityDimensions.unlockNext(); Tab.dimensions.infinity.show()"
    >
      Get {{ format(requirement) }} antimatter
      <br>
      to unlock a new
      <span v-if="anyInfinityDimensionUnlocked">Infinity Dimension</span>
      <span v-else>type of Dimension</span>.
    </primary-button>`
});
