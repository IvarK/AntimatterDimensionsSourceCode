"use strict";

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

Vue.component("tachyon-particle", {
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
      const MIN_SPEED = 1;
      const MAX_SPEED = 1.5;
      const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      const intersectionLength = intersect(start, direction, { x: 0, y: 0 }, bounds);
      const intersection = {
        x: start.x + direction.x * intersectionLength,
        y: start.y + direction.y * intersectionLength
      };
      const duration = intersectionLength / speed;

      const position = start;
      this.tween = new TWEEN.Tween(position)
        .to(intersection, duration)
        .onUpdate(() => {
          this.$el.setAttribute("cx", position.x);
          this.$el.setAttribute("cy", position.y);
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
    }
  },
  template:
    `<circle r="2" class="o-tachyon-particle" />`
});
