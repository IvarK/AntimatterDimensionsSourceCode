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
      this.count = player.dilation.tachyonParticles.gte(1)
        ? Math.clampMin(Math.floor(20 * Math.log10(player.dilation.tachyonParticles.exponent)), 1)
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
  data() {
    return {
      x: 0,
      y: 0
    };
  },
  created() {
    this.tween = null;
    if (GameUI.initialized) {
      this.fly();
    } else {
      Vue.nextTick(() => this.fly());
    }
  },
  destroyed() {
    if (this.tween !== null) {
      TWEEN.remove(this.tween);
    }
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

      this.x = start.x;
      this.y = start.y;
      this.tween = new TWEEN.Tween(this.$data)
        .to(intersection, duration)
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
    `<circle :cx="x" :cy="y" r="2" class="o-tachyon-particle" />`
});