"use strict";

Vue.component("dim-production-tab", {
  components: {
    "number-input": {
      props: {
        value: Number,
        min: Number,
        max: Number,
        default: Number
      },
      data() {
        return {
          inputValue: this.clamp(this.value)
        };
      },
      methods: {
        clamp(value) {
          return Math.clamp(value, this.min, this.max);
        },
        handleInput(event) {
          const input = parseInt(event.target.value, 10);
          const finalValue = isNaN(input) ? this.min : this.clamp(input);
          this.inputValue = finalValue;
          this.emitInput(finalValue);
        }
      },
      template:
        `<input type="number" :value="inputValue" @input="handleInput" />`
    }
  },
  data() {
    return {
      duration: 0,
      updateRate: 0,
      enabled: false,
      dips: false
    };
  },
  computed: {
    chartOptions() {
      return this.options.chart;
    }
  },
  watch: {
    duration(newValue) {
      player.options.chart.duration = newValue;
    },
    updateRate(newValue) {
      player.options.chart.updateRate = newValue;
    },
    enabled(newValue) {
      player.options.chart.on = newValue;
    },
    dips(newValue) {
      player.options.chart.dips = newValue;
    }
  },
  mounted() {
    const container = this.$refs.chartContainer;
    container.appendChild(dimChartEl);
  },
  methods: {
    update() {
      const options = player.options.chart;
      this.duration = options.duration;
      this.updateRate = options.updateRate;
      this.enabled = options.on;
      this.dips = options.dips;
    },
    checkOptionsWarnings() {
      const options = player.options.chart;
      const updateRate = options.updateRate;
      const duration = options.duration;
      if (updateRate <= 200 && duration >= 30 && options.warning === 0) {
        alert("Warning: setting the duration and update rate too high can cause performance issues.");
        options.warning = 1;
      }
      if (duration / updateRate * 1000 >= 1000 && options.warning !== 2) {
        alert("Warning: you have set the duration and update rate quite high, " +
          "make sure you know what you're doing or have a good computer");
        options.warning = 2;
      }
    },
    checkToggleWarnings() {
      const options = player.options.chart;
      if (options.on) return;
      if (options.warning < 1) {
        alert("Warning: the chart can cause performance issues. Please disable it if you're experiencing lag.");
      }
    }
  },
  template:
    `<div>
      <div class="c-production-header">
        <b>seconds of history:</b>
        <number-input
          v-model="duration"
          :min="1"
          :max="300"
          :default="10"
          @input="checkOptionsWarnings"
        />
        <b>update rate (in ms):</b>
        <number-input
          v-model="updateRate"
          :min="50"
          :max="10000"
          :default="1000"
          @input="checkOptionsWarnings"
        />
        <b>enabled:</b>
        <input
          v-model="enabled"
          class="c-production-header__checkbox"
          type="checkbox"
          @input="checkToggleWarnings"
        />
        <b>dips:</b>
        <input
          v-model="dips"
          class="c-production-header__checkbox"
          type="checkbox"
          @input="checkToggleWarnings"
        />
      </div>
      <div ref="chartContainer" />
      <b>Exponents of antimatter per second</b>
    </div>`
});
