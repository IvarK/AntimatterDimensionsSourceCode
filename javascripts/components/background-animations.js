import "./blob-snowflakes";

Vue.component("background-animations", {
  data() {
    return {
      animateBlobBackground: false,
    };
  },
  methods: {
    update() {
      this.animateBlobBackground = player.options.animations.background && player.options.theme === "S11";
    }
  },
  template: `
    <blob-snowflakes v-if="animateBlobBackground" />`
});