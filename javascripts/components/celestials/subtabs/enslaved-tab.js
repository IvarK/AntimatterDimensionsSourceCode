Vue.component('enslaved-tab', {
  data: function() {
    return {
      store: false,
      stored: 0
    };
  },
  methods: {
    update() {
      this.store = player.celestials.enslaved.store
      this.stored = player.celestials.enslaved.stored
    },
    toggleStore() {
      Enslaved.toggleStore()
    },
    useStored() {
      Enslaved.useStoredTime()
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms)
    }
  },
  template:
    `<div class="l-enslaved-celestial-tab">
      <div class="l-enslaved-top-container">
        <div class="o-enslaved-stored-time"> You have {{ timeDisplayShort(stored) }} stored</div>
        <button class="o-enslaved-shop-button" :class="{storeing: store}" @click="toggleStore()">{{ store ? "Storing wormhole time": "Store wormhole time" }}</button>
        <button class="o-enslaved-shop-button" @click="useStored()">Use all stored time in a single tick</button>
      </div>
    </div>`
});