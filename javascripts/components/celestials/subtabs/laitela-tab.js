Vue.component('laitela-tab', {
  data: function() {
    return {
      matter: 0
    };
  },
  methods: {
    update() {
      this.matter = player.celestials.laitela.matter
    },
  },
  computed: {
    dimensions() {
      return Array.range(1, 4).map( tier => MatterDimension(tier) )
    }
  },
  template:
    `<div class="l-laitela-celestial-tab">
      <matter-dimension-row
        v-for="(dimension, i) in dimensions"
        :key="i"
        :dimension="dimension"
      />
    </div>`
});

Vue.component('matter-dimension-row', {
  props: {
    dimension: Object
  },
  template:
  `<div> {{ dimension.amount }}</div>
    <button> {{ dimension.chance }}% <br>Cost: {{ dimension.chanceCost }}</button>
  
  `
})