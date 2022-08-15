<script>
import { svgRingPath } from "./svg-ring-path";

export default {
  name: "NodeOverlay",
  props: {
    complete: {
      type: Number,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    legend: {
      type: Object,
      required: false,
      default: undefined
    },
    ring: {
      type: Object,
      required: true
    },
    fill: {
      type: String,
      required: false,
      default: undefined
    },
    alwaysShowLegend: {
      type: Boolean,
      required: false,
      default: false
    },
    forceLegend: {
      type: Function,
      required: false,
      default: undefined
    },
    clickAction: {
      type: Function,
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      legendLines: [],
      hoverOverride: false,
    };
  },
  computed: {
    LEGEND_FONT_SIZE: () => 16,
    baseTransform() {
      return this.position.asTranslate();
    },
    pathData() {
      return svgRingPath(this.ring);
    },
    hasLegend() {
      return Boolean(this.legend) && (!this.legend.hideWhenCompleted || this.complete < 1);
    },
    legendArrowPoints() {
      const dir = Vector.unitFromDegrees(this.legend.angle);
      const pts = [dir.times(this.ring.rMajor + 2)];
      pts.push(pts[0].plus(dir.times(this.legend.diagonal)));
      pts.push(pts[1].plus(Vector.horiz(this.legend.horizontal * Math.sign(dir.x))));
      return pts;
    },
    legendArrowPointString() {
      return this.legendArrowPoints.join(" ");
    },
    legendTransform() {
      const pts = this.legendArrowPoints;
      const xDir = Math.sign(pts[2].x - pts[0].x);
      return pts[2].plus(Vector.horiz(xDir * 4)).asTranslate();
    },
    legendTextAnchor() {
      const angle = (this.legend.angle + 360) % 360;
      return angle > 90 && angle < 270 ? "end" : "start";
    },
    nodeClass() {
      return {
        "o-celestial-nav__force-hover": this.hoverOverride,
        "o-celestial-nav__clickable": this.clickAction !== undefined
      };
    },
  },
  methods: {
    update() {
      this.legendLines = this.getLines();
      this.hoverOverride = this.alwaysShowLegend || (this.forceLegend && this.forceLegend());
    },
    legendLineY(idx) {
      const spacing = Math.round(this.LEGEND_FONT_SIZE * 1.25 / 2);
      const num = this.legendLines.length;
      return (2 * idx - (num - 1)) * spacing;
    },
    getLines() {
      if (!this.legend) return null;
      const data = typeof (this.legend.text) === "function"
        ? this.legend.text(this.complete) : this.legend.text;
      return typeof (data) === "string" ? [data] : data;
    },
  }
};
</script>

<template>
  <g
    class="o-celestial-nav__hoverable"
    :class="nodeClass"
    :transform="baseTransform"
    v-on="clickAction ? { click: clickAction } : {}"
  >
    <path
      :d="pathData"
      class="o-celestial-nav__node-overlay"
    />
    <g
      v-if="hasLegend"
      class="tooltiptext"
    >
      <polyline
        :points="legendArrowPointString"
        class="o-celestial-nav__legend-arrow"
      />
      <!-- The ring radii are adjusted slightly to offset the stroke outside the node -->
      <path
        :d="pathData"
        class="o-celestial-nav__legend-outline"
      />
      <g :transform="legendTransform">
        <text
          class="o-celestial-nav__legend-text"
          :text-anchor="legendTextAnchor"
          dominant-baseline="middle"
          :font-size="LEGEND_FONT_SIZE"
        >
          <tspan
            v-for="(line, idx) in legendLines"
            :key="idx"
            x="0"
            :y="legendLineY(idx)"
          >
            {{ line }}
          </tspan>
        </text>
      </g>
    </g>
  </g>
</template>

<style scoped>
.o-celestial-nav__clickable {
  cursor: pointer;
}
</style>
