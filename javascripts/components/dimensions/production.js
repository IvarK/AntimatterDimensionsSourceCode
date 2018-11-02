Vue.component('dimensions-production', {
  data: function() {
    return {
      options: player.options
    };
  },
  computed: {
    chartOptions: function() {
      return this.options.chart;
    }
  },
  mounted: function() {
    const container = this.$refs.chartContainer;
    container.appendChild(dimChartEl);
  },
  methods: {
    checkOptionsWarnings: function() {
      const options = this.chartOptions;
      const updateRate = options.updateRate;
      const duration = options.duration;
      if (updateRate <= 200 && duration >= 30 && options.warning === 0) {
        alert("Warning: setting the duration and update rate too high can cause performance issues.");
        options.warning = 1;
      }
      if (duration / updateRate * 1000 >= 1000 && options.warning !== 2) {
        alert("Warning: you have set the duration and update rate quite high, make sure you know what you're doing or have a good computer");
        options.warning = 2;
      }
    },
    checkToggleWarnings: function() {
      if (this.chartOptions.on) return;
      if (this.chartOptions.warning < 1) {
        alert("Warning: the chart can cause performance issues. Please disable it if you're experiencing lag.");
      }
    }
  },
  template:
    `<div style="font-size: 12px">
      <b>seconds of history:</b>
      <number-input
        :min="1"
        :max="300"
        :default="10"
        v-model="chartOptions.duration"
        @input="checkOptionsWarnings"
      />
      <b>update rate (in ms):</b>
      <number-input
        :min="50"
        :max="10000"
        :default="1000"
        v-model="chartOptions.updateRate"
        @input="checkOptionsWarnings"
      />
      <b>enabled:</b>
      <input
        type="checkbox"
        class="checkbox"
        style="top: -4px;"
        v-model="chartOptions.on"
        @input="checkToggleWarnings"
      />
      <b>dips:</b>
      <input
        type="checkbox"
        class="checkbox"
        style="top: -4px;"
        v-model="chartOptions.dips"
        @input="checkToggleWarnings"
      />
      <div ref="chartContainer" />
      <b>Exponents of antimatter per second</b>
    </div>`,
  components: {
    "number-input": {
      props: {
        value: Number,
        min: Number,
        max: Number,
        default: Number
      },
      data: function() {
        return {
          inputValue: this.clamp(this.value)
        };
      },
      methods: {
        clamp: function(value) {
          return Math.clamp(value, this.min, this.max);
        },
        handleInput: function(event) {
          const input = parseInt(event.target.value);
          const finalValue = isNaN(input) ? this.min : this.clamp(input);
          this.inputValue = finalValue;
          this.emitInput(finalValue);
        }
      },
      template:
        `<input type="number" :value="inputValue" @input="handleInput" />`
    }
  }
});