import "./blob-snowflakes";

Vue.component("background-animations", {
  data() {
    return {
      animateBackground: false,
      blob: false,
    };
  },
  methods: {
    update() {
      this.animateBackground = player.options.animations.background;
      this.blob = player.options.theme === "S11";
    }
  },
  template: `
    <blob-snowflakes v-if="blob" />`
});