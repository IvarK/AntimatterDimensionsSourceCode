import "./tachyon-particle.js";

Vue.component("tachyon-particles", {
  data() {
    return {
      count: 0,
      initialized: false,
      bounds: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    this.updateSize();
    window.addEventListener("resize", this.updateSize);
    this.initialized = true;
  },
  destroyed() {
    window.removeEventListener("resize", this.updateSize);
  },
  methods: {
    update() {
      this.count = Currency.tachyonParticles.gte(1)
        ? Math.clampMin(Math.floor(20 * Math.log10(Currency.tachyonParticles.exponent)), 1)
        : 0;
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  },
  template:
    `<svg class="c-tachyon-particle-container">
      <tachyon-particle
        v-for="i in count"
        v-if="initialized"
        :key="i"
        :bounds="bounds"
      />
    </svg>`
});
