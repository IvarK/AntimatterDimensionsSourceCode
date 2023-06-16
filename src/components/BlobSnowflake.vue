<script>
import TWEEN from "tween.js";

export default {
  name: "BlobSnowflake",
  props: {
    bounds: {
      type: Object,
      required: true,
    }
  },
  mounted() {
    this.fly();
  },
  beforeDestroy() {
    for (const tween of this.tweens) {
      TWEEN.remove(tween);
    }
  },
  methods: {
    fly() {
      const windowSideOffset = 120;
      const snowMoveX = 50 + Math.random() * 50;
      const snowMoveY = 160 + Math.random() * 60;
      const snowDelay = 1000 + Math.random() * 10000;
      const snowSpeed = 3000 + Math.random() * 1000;
      const snowSize = 2 + Math.random() * 3;

      const bounds = this.bounds;
      const snowPos = { x: -300, y: -150 };
      const snowPosTop = -150;
      const snowPosBottom = bounds.y + 150;
      const snowMoveDir = Math.random() - 0.5;

      const tweenZig = new TWEEN.Tween(snowPos)
        .to({ x: `${snowMoveDir < 0 ? "-" : "+"}${snowMoveX}` }, snowSpeed)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

      const tweenZag = new TWEEN.Tween(snowPos)
        .to({ x: `${snowMoveDir < 0 ? "+" : "-"}${snowMoveX}` }, snowSpeed)
        .easing(TWEEN.Easing.Sinusoidal.InOut);

      const tweenDrop = new TWEEN.Tween(snowPos)
        .to({ y: `+${snowMoveY}` }, snowSpeed)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
          this.$el.setAttribute("x", snowPos.x);
          this.$el.setAttribute("y", snowPos.y);
          if (snowPos.y > snowPosBottom) {
            tweenZig.chain(tweenZigZagReset);
            tweenZag.chain(tweenZigZagReset);
            tweenDrop.chain(tweenDropReset);
          }
        });

      const tweenZigZagReset = new TWEEN.Tween(snowPos)
        .to({ x: windowSideOffset + Math.random() * (bounds.x - windowSideOffset * 2) }, 0)
        .chain(tweenZig)
        .easing(TWEEN.Easing.Linear.None);

      const tweenDropReset = new TWEEN.Tween(snowPos)
        .to({ y: snowPosTop }, 0)
        .easing(TWEEN.Easing.Linear.None)
        .chain(tweenDrop)
        .onUpdate(() => {
          this.$el.textContent = snowText();
          this.$el.setAttribute("x", snowPos.x);
          this.$el.setAttribute("y", snowPos.y);
          this.$el.setAttribute("font-size", `${snowSize}em`);
          tweenZig.chain(tweenZag);
          tweenZag.chain(tweenZig);
          tweenDrop.chain(tweenDrop);
        });

      tweenZigZagReset.start(snowDelay);
      tweenDropReset.start(snowDelay);
      this.tweens = [tweenZig, tweenZag, tweenDrop, tweenZigZagReset, tweenDropReset];

      function snowText() {
        const LEN = 23;
        const START = "\uE010";
        const START_HEX = START.codePointAt(0) || 65;
        const SNOW = [];
        for (let i = 0; i < LEN; i++) {
          SNOW.push(String.fromCharCode(START_HEX + i));
        }
        // \uE024 is :blobdead: and gets transitioned into as the game is ending, reaching
        // 100% at the same time the final achievement and speedrun milestone is given
        return Math.random() < GameEnd.endState ** 2
          ? "\uE024"
          : SNOW[Math.floor(Math.random() * SNOW.length)];
      }
    },
  }
};
</script>

<template>
  <text class="o-blob-snowflake" />
</template>

<style scoped>
.o-blob-snowflake {
  overflow: visible;
  fill: #fbc21b;
  opacity: 0.9;
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
