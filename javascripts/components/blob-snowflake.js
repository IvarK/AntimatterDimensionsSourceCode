Vue.component("blob-snowflake", {
  props: {
    bounds: Object
  },
  mounted() {
    this.fly();
  },
  beforeDestroy() {
    TWEEN.remove(this.tween);
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
  template:
        `<text class="o-blob-snowflake"></text>`
});
