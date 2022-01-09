Vue.component("blob-particle", {
  data() {
    return {
      randomLetter: 0,
      randomSize: 4,
    };
  },
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
      const bounds = this.bounds;
      const start = {
        x: Math.random() * bounds.x,
        y: Math.random() * bounds.y
      };
      const direction = randomUnitVector();
      const MIN_SPEED = 0.02;
      const MAX_SPEED = 0.08;
      const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      const intersectionLength =
        intersect(start, direction, { x: -150, y: -150 }, { x: bounds.x + 150, y: bounds.y + 150 });
      const intersection = {
        x: start.x + direction.x * intersectionLength,
        y: start.y + direction.y * intersectionLength
      };
      const duration = intersectionLength / speed;

      const position = start;

      this.randomLetter = Math.random();
      this.randomSize = (3 + Math.random() * 5);

      fadeIn(this.$el, 3000);
      this.tween = new TWEEN.Tween(position)
        .to(intersection, duration)
        .onUpdate(() => {
          this.$el.setAttribute("x", position.x);
          this.$el.setAttribute("y", position.y);
          this.$el.setAttribute("font-size", `${this.randomSize}em`);
        })
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(this.fly.bind(this))
        .start(tweenTime);

      function randomUnitVector() {
        const azimuth = Math.random() * 2 * Math.PI;
        return {
          x: Math.cos(azimuth),
          y: Math.sin(azimuth)
        };
      }
      // eslint-disable-next-line max-params
      function intersect(rayStart, rayUnit, rectAA, rectBB) {
        const dirfrac = {
          x: 1 / rayUnit.x,
          y: 1 / rayUnit.y
        };
        const t1 = (rectAA.x - rayStart.x) * dirfrac.x;
        const t2 = (rectBB.x - rayStart.x) * dirfrac.x;
        const t3 = (rectAA.y - rayStart.y) * dirfrac.y;
        const t4 = (rectBB.y - rayStart.y) * dirfrac.y;
        return Math.min(Math.max(t1, t2), Math.max(t3, t4));
      }

      function fadeIn(node, durationTime) {
        node.style.opacity = 0;
        const startTime = performance.now();
        requestAnimationFrame(function tick(timestamp) {
          const easing = (timestamp - startTime) / durationTime;
          node.style.opacity = Math.min(easing, 0.7);
          if (easing < 0.7) {
            requestAnimationFrame(tick);
          } else {
            node.style.opacity = "";
          }
        });
      }
    },
  },
  computed: {
    text() {
      LEN = 23;
      START = "\uE010";
      START_HEX = START.codePointAt(0) || 65;
      const BLOBS = [];
      for (i = 0; i < LEN; i++) {
        char = String.fromCharCode(START_HEX + i);
        BLOBS.push(char);
      }
      return `${BLOBS[Math.floor(this.randomLetter * BLOBS.length)]}`;
    }
  },
  template:
        `<text class="o-blob-particle">{{ text }}</text>`
});
