import "./blob-snowflake";

Vue.component("blob-snowflakes", {
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
      this.count = player.options.animations.blobSnowFlakes;
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  },
  template:
      `<svg class="c-blob-snowflake-container">
        <blob-snowflake
          v-for="i in count"
          v-if="initialized"
          :key="i"
          :bounds="bounds"
        />
      </svg>`
});

