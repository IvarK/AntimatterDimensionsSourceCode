Vue.component('effarig-tab', {
  data: function() {
    return {
      pour: false,
      time: new Date().getTime(),
      rmStore: 0
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
    },
  },
  template:
    `<div class="l-effarig-celestial-tab">
      <div class="l-effarig-unlocks">
      </div>

      <div class="c-rm-container">
        <button class="storebtn" 
          @mousedown="pour = true"
          @mouseup="pour = false"
        >Pour RM</button>
        {{shorten(rmStore)}} RM poured
      </div>

      <div class="c-unlock-descriptions">
      </div>
    </div>`
});