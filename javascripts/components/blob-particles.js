import "./blob-particle";

Vue.component("blob-particles", {
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
      this.count = 8;
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  },
  template:
      `<svg class="c-blob-particle-container">
        <blob-particle
          v-for="i in count"
          v-if="initialized"
          :key="i"
          :bounds="bounds"
        />
      </svg>`
});

