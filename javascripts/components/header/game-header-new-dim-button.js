Vue.component("game-header-new-dim-button", {
  data: function() {
    return {
      isVisible: false,
      requirement: new Decimal(0),
      isAffordable: false
    };
  },
  computed: {
    classObject: function() {
      return {
        newdim: this.isAffordable,
        newdimlocked: !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      this.isVisible = player.break && !InfinityDimension(8).isUnlocked;
      if (!this.isVisible) return;
      const requirement = InfinityDimension.nextRequirement();
      this.requirement.copyFrom(requirement);
      this.isAffordable = player.money.gte(requirement);
    }
  },
  template:
    `<button
      v-if="isVisible"
      :class="classObject"
      onclick="newDimension()"
    >Get {{shortenCosts(requirement)}} antimatter to unlock a new Dimension.</button>`
});