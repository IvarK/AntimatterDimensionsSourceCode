Vue.component('challenges-tab', {
  data: function() {
    return {
      isICTabUnlocked: false,
      isECTabUnlocked: false,
      isInChallenge: false,
      isRealityUnlocked: false,
      options: player.options,
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
      this.isRealityUnlocked = PlayerProgress.realityUnlocked;
    }
  },
  template:
    `<game-tab-with-subtabs
      v-model="$viewModel.tabs.challenges.subtab"
      :tabs="tabs"
      class="l-challenges-tab"
    >
      <div v-if="isInChallenge || isRealityUnlocked" slot="before-content" class="l-challenges-tab__header">
        <primary-button
          v-if="isInChallenge"
          class="o-primary-btn--exit-challenge l-challenges-tab__exit-btn"
          onclick="exitChallenge()"
        >Exit Challenge</primary-button>
        <template v-if="isRealityUnlocked">
          <input
            v-model="options.showAllChallenges"
            type="checkbox"
            class="o-big-checkbox"
          />
          <b>Show all</b>
        </template>
      </div>
    </game-tab-with-subtabs>`
});