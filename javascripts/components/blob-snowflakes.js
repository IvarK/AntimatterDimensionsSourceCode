import "./blob-snowflake";
import "./blob-background";

Vue.component("blob-snowflakes", {
  data() {
    return {
      animateBackground: false,
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
      this.animateBackground = player.options.animations.background;
      this.count = player.options.animations.blobSnowflakes;
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  },
  template: `
    <svg v-if="animateBackground" class="c-blob-snowflake-container">
      <blob-snowflake
        v-for="i in count"
        v-if="initialized"
        :key="i"
        :bounds="bounds"
      />
    </svg>
    <svg v-else class="c-blob-background-container">
      <blob-background
        v-for="i in count"
        v-if="initialized"
        :key="i"
        :bounds="bounds"
      />
    </svg>`
});

