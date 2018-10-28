Vue.component('dimensions-tab', {
  props: {
    model: Object,
    view: Object
  },
  data: function() {
    return {
      isIDTabUnlocked: false,
      isTDTabUnlocked: false,
      isProductionTabUnlocked: false,
      tabs: [
        {
          name: "Dimensions",
          id: "Dimensions",
          component: "dimensions-normal"
        },
        {
          name: "Infinity Dimensions",
          id: "Infinity Dimensions",
          component: "dimensions-infinity",
          condition: function() { return this.isIDTabUnlocked; }.bind(this)
        },
        {
          name: "Time Dimensions",
          id: "Time Dimensions",
          component: "dimensions-time",
          condition: function() { return this.isTDTabUnlocked; }.bind(this)
        },
        {
          name: "Production",
          id: "Production",
          component: "dimensions-production",
          condition: function() { return this.isProductionTabUnlocked; }.bind(this)
        }
      ]
    };
  },
  computed: {
    player: function() {
      return this.model.player;
    },
    progress: function() {
      return PlayerProgress.of(this.player);
    }
  },
  methods: {
    update() {
      this.isIDTabUnlocked = player.eternities > 0 || player.infDimensionsUnlocked.includes(true);
      this.isTDTabUnlocked = player.eternities > 0;
      this.isProductionTabUnlocked = player.eternities > 0 || player.infinities > 0;
    }
  },
  template:
    `<tab-container>
      <subtabbed-container
        class="tab-content"
        :tabs="tabs"
        :model="model"
        :view="view"
        v-model="view.tabs.dimensions.subtab">
      </subtabbed-container>
    </tab-container>`
});