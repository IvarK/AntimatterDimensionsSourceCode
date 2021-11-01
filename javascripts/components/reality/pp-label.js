"use strict";

Vue.component("pp-label", {
  data() {
    return {
      pp: 0,
      fixedLoadPos: false,
      physicsEnabled: false,
    };
  },
  watch: {
    fixedLoadPos(newValue) {
      player.options.fixedPerkStartingPos = newValue;
    },
    physicsEnabled(newValue) {
      player.options.perkPhysicsEnabled = newValue;
      PerkNetwork.setPhysics(newValue);
    },
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
      this.fixedLoadPos = player.options.fixedPerkStartingPos;
      this.physicsEnabled = player.options.perkPhysicsEnabled;
    }
  },
  template: `
    <div class="c-perk-tab__header">
      You have <span class="c-perk-tab__perk-points">{{ format(pp, 2, 0) }}</span> {{ pluralize("Perk Point", pp) }}.
      <br>
      Perk choices are permanent and cannot be respecced.
      <br>
      <div>
        <primary-button-on-off-custom
          v-model="fixedLoadPos"
          class="o-primary-btn"
          on="Starting tree layout: Untangled"
          off="Starting tree layout: Random Positions"
        />
        <primary-button-on-off-custom
          v-model="physicsEnabled"
          class="o-primary-btn"
          on="Physics: Enabled"
          off="Physics: Disabled"
        />
      </div>
    </div>`
});
