Vue.component('sidebar-rm', {
  data() {
    return {
      rm: new Decimal(0),
      gained: new Decimal(0)
    }
  },
  methods: {
    update() {
      this.rm = player.reality.realityMachines
    }
  },
  template:`
  <div class="resource">
    <h2 id="rm">{{ shorten(rm, 2, 0) }}</h2>
    <div class="resource-information">
      <span class="resource-name">Reality Machines</span>
      <span class="resource-per-second"> +{{ shorten(gained) }}</span>
    </div>
  </div>`
})