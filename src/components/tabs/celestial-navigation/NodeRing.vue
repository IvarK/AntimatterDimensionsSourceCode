<script>
import { svgRingPath } from "./svg-ring-path";

export default {
  name: "NodeRing",
  props: {
    complete: {
      type: Number,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    ring: {
      type: Object,
      required: true
    },
    symbol: {
      type: String,
      required: false,
      default: "",
    },
    symbolScale: {
      type: Number,
      required: false,
      default: 1.4
    },
    symbolOffset: {
      type: String,
      required: false,
      default: "0"
    },
    completeClass: {
      type: String,
      required: false,
      default: undefined
    },
    incompleteClass: {
      type: String,
      required: false,
      default: undefined
    },
    fill: {
      type: String,
      required: false,
      default: undefined
    },
    isStacked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    baseTransform() {
      return this.position.asTranslate();
    },
    pathData() {
      return svgRingPath(this.ring);
    },
    ringClass() {
      return this.complete >= 1 ? this.completeClass : this.incompleteClass;
    },
    symbolFontSize() {
      return this.ring.rMajor * this.symbolScale;
    },
    ringFilter() {
      return this.complete >= 1 && !this.isStacked ? "url(#completeGlow)" : "";
    },
  }
};
</script>

<template>
  <g :transform="baseTransform">
    <path
      :class="ringClass"
      :d="pathData"
      stroke="none"
      :fill="fill"
      :filter="ringFilter"
    />
    <text
      v-if="symbol"
      class="o-celestial-nav__symbol o-no-mouse"
      fill="#000"
      dominant-baseline="middle"
      :font-size="symbolFontSize"
      :dy="symbolOffset"
    >
      {{ symbol }}
    </text>
  </g>
</template>

<style scoped>

</style>
