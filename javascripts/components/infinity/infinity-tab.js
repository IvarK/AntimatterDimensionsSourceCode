Vue.component('infinity-tab', {
  data: function() {
    return {
      infinityPoints: new Decimal(0),
      tabs: [
        {
          name: "Upgrades",
          id: "Upgrades",
          component: "infinity-upgrades-tab"
        },
        {
          name: "Autobuyers",
          id: "Autobuyers",
          component: "autobuyers-tab"
        },
        {
          name: "Break Infinity",
          id: "Break Infinity",
          component: "break-infinity-tab"
        },
        {
          name: "Replicanti",
          id: "Replicanti",
          component: "replicanti-tab"
        }
      ]
    };
  },
  computed: {
    ipNoun: function() {
      return this.infinityPoints.equals(1) ? "Infinity Point" : "Infinity Points";
    }
  },
  methods: {
    update() {
      this.infinityPoints.copyFrom(player.infinityPoints);
    }
  },
  template:
    `<game-tab-with-subtabs
        v-model="$viewModel.tabs.infinity.subtab"
        :tabs="tabs"
        class="l-infinity-tab"
    >
      <div
        slot="before-subtabs"
        class="c-infinity-tab__header"
      >You have <span class="c-infinity-tab__infinity-points">{{shortenDimensions(infinityPoints)}}</span> {{ipNoun}}.</div>
    </game-tab-with-subtabs>`
});