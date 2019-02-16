Vue.component("effarig-unlock-button", {
  props: {
    unlock: String
  },
  data: function() {
    return {
      id: -1,
      cost: -1,
      description: "",
      isBought: false
    };
  },
  methods: {
    update() {
      this.id = EFFARIG_UNLOCKS[this.unlock]
      this.cost = EFFARIG_COSTS[this.unlock]
      this.description = EFFARIG_UNLOCK_DESCRIPTIONS[this.unlock]
      this.isBought = Effarig.has(this.id)
    },
    purchase() {
      Effarig.buyUnlock(this.id, this.cost)
    }
  },
  template: `
    <button
      class="o-effarig-shop-button"
      :class="{ 'effarig-unlock-bought': isBought}"
      @click="purchase"
    >
      {{description}}
      <br>
      Cost: {{ shorten(cost) }} Relic Shards
    </button>`
});