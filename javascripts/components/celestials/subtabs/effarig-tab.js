Vue.component('effarig-tab', {
  data: function() {
    return {
      pour: false,
      time: new Date().getTime(),
      rmStore: 0,
      percentage: "",
      rmMult: 0,
    };
  },
  methods: {
    update() {
      let now = new Date().getTime()
      if (this.pour) {
        let diff = (now - this.time)/1000
        Effarig.pourRM(diff)
      }
      this.time = now
      this.rmStore = player.celestials.effarig.rmStore
      this.percentage = Effarig.getPercentage()
      this.rmMult = Effarig.getRmMultiplier()
    },
  },
  template:
    `<div class="l-effarig-celestial-tab">
      <div class="l-effarig-unlocks">
      </div>

      <div class="l-rm-container">
        <button class="storebtn effarigPour" 
          @mousedown="pour = true"
          @mouseup="pour = false"
        >Pour RM</button>
        <div class="c-rm-store">
          <div class="c-rm-store-inner" :style="{ height: percentage}">
            <div class="c-rm-store-label"> {{ shorten(rmMult) }}x RM gain<br>{{ shorten(rmStore) }}/{{ shorten(1e15) }}</div>
          </div>
        </div>
      </div>

      <div class="c-unlock-descriptions">
      </div>
    </div>`
});