Vue.component("effarig-unlock-button", {
  props: {
    unlock: String
  },
  data: function() {
    return {
      isBought: false
    };
  },
  methods: {
    update() {
      this.isBought = Effarig.has(this.id)
    },
    purchase() {
      Effarig.buyUnlock(this.id, this.cost)
    }
  },
  computed: {
    id() {
      return EFFARIG_UNLOCKS[this.unlock]
    },
    cost() {
      return EFFARIG_COSTS[this.unlock]
    },
    description() {
      return EFFARIG_UNLOCK_DESCRIPTIONS[this.unlock]
    },
  },
  template: `
    <button
      class="o-effarig-shop-button"
      :class="{ 'effarig-unlock-bought': isBought }"
      @click="purchase"
    >
      {{description}}
      <br>
      Cost: {{ shorten(cost) }} Relic Shards
    </button>`
});