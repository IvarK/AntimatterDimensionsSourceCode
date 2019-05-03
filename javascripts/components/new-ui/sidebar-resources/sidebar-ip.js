Vue.component('sidebar-ip', {
  data() {
    return {
      ip: new Decimal(0),
      gained: new Decimal(0)
    }
  },
  methods: {
    update() {
      this.ip = player.infinityPoints
    }
  },
  template:`
  <div class="resource">
    <h2 id="ip">{{ shorten(ip, 2, 0) }}</h2>
    <div class="resource-information">
      <span class="resource-name">Infinity Points</span>
      <span class="resource-per-second"> +{{ shorten(gained) }}</span>
    </div>
  </div>`
})