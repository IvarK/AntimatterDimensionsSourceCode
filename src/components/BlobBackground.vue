<script>
export default {
  name: "BlobBackground",
  props: {
    bounds: {
      type: Object,
      required: true,
    }
  },
  mounted() {
    this.drop();
  },
  methods: {
    drop() {
      const windowBorderOffset = 60;
      const snowSize = 5 + Math.random() * 8;
      const bounds = this.bounds;
      const snowPos = {
        x: Math.random() * (bounds.x - windowBorderOffset),
        y: windowBorderOffset + Math.random() * (bounds.y - windowBorderOffset)
      };
      this.$el.textContent = snowText();
      this.$el.setAttribute("x", snowPos.x);
      this.$el.setAttribute("y", snowPos.y);
      this.$el.setAttribute("font-size", `${snowSize}em`);

      function snowText() {
        const LEN = 23;
        const START = "\uE010";
        const START_HEX = START.codePointAt(0) || 65;
        const SNOW = [];
        for (let i = 0; i < LEN; i++) {
          SNOW.push(String.fromCharCode(START_HEX + i));
        }
        return SNOW[Math.floor(Math.random() * SNOW.length)];
      }
    },
  },
};
</script>

<template>
  <text class="o-blob-background" />
</template>

<style scoped>
.o-blob-background {
  overflow: visible;
  fill: #fbc21b;
  opacity: 0.3;
  text-shadow:
    0 0 5px #000000,
    0 0 5px #000000,
    0 0 5px #000000;
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}
</style>
