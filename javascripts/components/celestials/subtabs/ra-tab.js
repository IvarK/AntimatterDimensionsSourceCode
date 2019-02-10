Vue.component('ra-tab', {
  data: function() {
    return {
      fillPercentage: "",
      exp: 0,
      expRequired: 0,
      level: 0
    };
  },
  methods: {
    update() {
      this.fillPercentage = Ra.percentageToNextLevel*100 + "%"
      this.exp = player.celestials.ra.exp
      this.expRequired = Ra.requiredExp
      this.level = player.celestials.ra.level
    },
  },
  template:
    `<div class="l-ra-celestial-tab">
      <div class="l-ra-teresa-container">
        <h2>Teresa</h2>
        <p>Level {{ level }}</p>
        <div class="c-ra-teresa-experience">
          <div class="c-ra-teresa-experience-inner" :style="{ 'width': fillPercentage }">
            <b class="o-ra-exp-display">{{ shorten(exp, 2) }}/{{ shorten(expRequired, 2) }}</b>
          </div>
        </div>
      </div>
    </div>`
});