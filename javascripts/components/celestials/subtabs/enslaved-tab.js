Vue.component('enslaved-tab', {
  data: function() {
    return {
      isStoring: false,
      stored: 0,
      enslavedInfinities: 0,
      unlocks: []
    };
  },
  methods: {
    update() {
      this.isStoring = player.celestials.enslaved.isStoring
      this.stored = player.celestials.enslaved.stored
      this.enslavedInfinities = Enslaved.totalInfinities
      this.unlocks = player.celestials.enslaved.unlocks
    },
    toggleStore() {
      Enslaved.toggleStore()
    },
    useStored() {
      Enslaved.useStoredTime()
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms)
    },
    buyUnlock(info) {
      Enslaved.buyUnlock(info)
    },
    startRun() {
      Enslaved.startRun()
    },
    hasUnlock(info) {
      return Enslaved.has(info)
    }
  },
  computed: {
    unlocksInfo() {
      return ENSLAVED_UNLOCKS
    }
  },
  template:
    `<div class="l-enslaved-celestial-tab">
      <div class="l-enslaved-top-container">
        <div class="o-enslaved-stored-time"> You have {{ timeDisplayShort(stored) }} stored</div>
        <button class="o-enslaved-shop-button" :class="{'o-enslaved-storing': isStoring}" @click="toggleStore">{{ isStoring ? "Storing wormhole time": "Store wormhole time" }}</button>
        <button class="o-enslaved-shop-button" @click="useStored">Use all stored time in a single tick</button>
      </div>
      <div class="l-enslaved-shop-container">
        <button 
          v-for="unlock in unlocksInfo" 
          :key="unlock.id" 
          class="o-enslaved-shop-button" 
          @click="buyUnlock(unlock)"> {{ unlock.description }} <br> Costs: {{ timeDisplayShort(unlock.price) }}</button>
      </div>
      <div class="l-enslaved-unlocks-container" v-if="hasUnlock(unlocksInfo.RUN)">
        <button class="o-enslaved-shop-button" @click="startRun">
          Start Enslaved One's Reality<br>IDs and TDs are disabled, but you gain a 3rd wormhole. You also gain some bonus based on
          infinities gained in the last 10 seconds (real time). (I haven't decided what yet lol xd lmao)
        </button>
        <div>You have gained {{ shorten(enslavedInfinities) }} infinities in the last 10 seconds.</div>
      </div>
    </div>`
});