Vue.component('challenges-tab', {
  data: function() {
    return {
      isICTabUnlocked: false,
      isECTabUnlocked: false,
      isInChallenge: false,
      tabs: [
        {
          name: "Challenges",
          id: "Challenges",
          component: "normal-challenges-tab"
        },
        {
          name: "Infinity Challenges",
          id: "Infinity Challenges",
          component: "infinity-challenges-tab",
          condition: function() { return this.isICTabUnlocked; }.bind(this)
        },
        {
          name: "Eternity Challenges",
          id: "Eternity Challenges",
          component: "eternity-challenges-tab",
          condition: function() { return this.isECTabUnlocked; }.bind(this)
        }
      ]
    };
  },
  methods: {
    update() {
      const ecTabUnlocked = player.eternityChallUnlocked !== 0 || Object.keys(player.eternityChalls).length > 0;
      this.isECTabUnlocked = ecTabUnlocked;
      this.isICTabUnlocked = ecTabUnlocked || player.money.gte(new Decimal("1e2000"));
      this.isInChallenge = player.currentChallenge !== "" || player.currentEternityChall !== "";
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.challenges.subtab"
      :tabs="tabs"
      class="l-challenges-tab"
    >
      <primary-button
        v-if="isInChallenge"
        slot="before-content"
        class="o-primary-btn--exit-challenge l-challenges-tab__exit-btn"
        onclick="exitChallenge()"
      >Exit Challenge</primary-button>
    </game-tab-with-subtabs>`
});