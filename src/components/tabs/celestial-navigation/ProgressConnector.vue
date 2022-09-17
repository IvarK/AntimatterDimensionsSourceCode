<script>
export default {
  name: "ProgressConnector",
  props: {
    complete: {
      type: Number,
      required: true
    },
    completeWidth: {
      type: Number,
      required: false,
      default: 8
    },
    incompleteWidth: {
      type: Number,
      required: false,
      default: 6,
    },
    noBG: {
      type: Boolean,
      required: false,
      default: false,
    },
    opacity: {
      type: Number,
      required: false,
      default: 1,
    },
    fill: {
      type: String,
      required: false,
      default: "#5151ec",
    },
    filterName: {
      type: String,
      required: false,
      default: "completeGlow",
    },
    path: {
      type: Object,
      required: true
    },
    pathStart: {
      type: Number,
      required: true
    },
    pathEnd: {
      type: Number,
      required: true
    },
    pathPadStart: {
      type: Number,
      required: false,
      default: 0,
    },
    pathPadEnd: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    unpaddedSpan() {
      return (this.pathEnd - this.pathPadEnd) - (this.pathStart + this.pathPadStart);
    },
    incompleteStart() {
      return this.complete >= 1
        ? this.pathEnd
        : this.pathStart + this.pathPadStart + this.unpaddedSpan * this.complete;
    },
    incompleteStartShape() {
      return this.shapeAt(this.incompleteStart);
    },
    completeStartShape() {
      return this.shapeAt(this.pathStart);
    },
    incompleteTransform() {
      const shape = this.incompleteStartShape;
      return `${shape.position.asTranslate()} ${shape.direction.asRotate()}`;
    },
    pathEndShape() {
      return this.shapeAt(this.pathEnd);
    },
    // In order to support gradients that fill along a completed path,
    // we render in a coordinate system that's scaled to be 0..1 from start to end
    totalPathOffsetPx() {
      return this.pathEndShape.position.minus(this.completeStartShape.position);
    },
    completeTransform() {
      const shape = this.completeStartShape;
      const scale = this.totalPathOffsetPx.length;
      return `${shape.position.asTranslate()} ${shape.direction.asRotate()} scale(${scale})`;
    },
    incompleteFadeEnd() {
      const shape = this.incompleteStartShape;
      const fadeLength = 12 / shape.derivative.length;
      return this.pathEnd > this.pathStart
        ? Math.min(this.incompleteStart + fadeLength, this.pathEnd)
        : Math.max(this.incompleteStart - fadeLength, this.pathEnd);
    },
    incompleteFadePath() {
      return this.generateIncompletePath(this.incompleteStart, this.incompleteFadeEnd);
    },
    incompleteSolidPath() {
      return this.generateIncompletePath(
        this.incompleteFadeEnd - 1e-3 * (this.pathEnd - this.incompleteFadeEnd), this.pathEnd);
    },
    completePath() {
      const startShape = this.completeStartShape;
      const scale = 1 / this.totalPathOffsetPx.length;
      const tform = AffineTransform
        .translation(startShape.position.negative)
        .rotated(-startShape.direction.angle)
        .scaled(scale);
      const tStart = this.pathStart, tEnd = this.incompleteStart;
      const w = this.completeWidth;
      const insetPath = this.getOffsetPath(-w / 2, tStart, tEnd).transformedBy(tform);
      const outsetPath = this.getOffsetPath(w / 2, tEnd, tStart).transformedBy(tform);
      const endVector = this.incompleteStartShape.direction.transformedBy(tform.withoutTranslation);
      const inEnd = insetPath.path[insetPath.path.length - 1];
      const outStart = outsetPath.path[0];
      const capCP0 = inEnd.position(1).plus(endVector.times(w / 2));
      const capCP1 = outStart.position(0).plus(endVector.times(w / 2));
      const cap = `C ${capCP0.x} ${capCP0.y} ${capCP1.x} ${capCP1.y} ${outStart.p0.x} ${outStart.p0.y}\n`;
      return insetPath.toSVG("M") + cap + outsetPath.toSVG("L");
    },
    hasIncompleteSolidPath() {
      return this.incompleteFadeEnd !== this.pathEnd;
    },
    filter() {
      return `url(#${this.filterName})`;
    },
  },
  methods: {
    generateIncompletePath(tStart, tEnd) {
      const inset = this.getOffsetPath(-this.incompleteWidth / 2, tStart, tEnd);
      const outset = this.getOffsetPath(this.incompleteWidth / 2, tEnd, tStart);
      const s0 = this.incompleteStartShape;
      const tform = AffineTransform.translation(s0.position.negative).rotated(-s0.direction.angle);
      return inset.transformedBy(tform).toSVG("M") + outset.transformedBy(tform).toSVG("L");
    },
    getOffsetPath(offset, tStart, tEnd) {
      if (this.path instanceof LinearPath) {
        return new PiecewisePath([this.path.createOffsetLine(offset, tStart, tEnd)]);
      }
      const offsetPath = new OffsetCurve(this.path, offset);
      return PiecewisePath.cubicBezierFitToCurveSection(offsetPath, tStart, tEnd);
    },
    shapeAt(t) {
      const shape = this.path.shapeAt(t);
      if (this.pathStart > this.pathEnd) {
        shape.direction = shape.direction.negative;
        shape.derivative = shape.derivative.negative;
      }
      return shape;
    }
  }
};
</script>

<template>
  <g>
    <g
      v-if="!noBG"
      :transform="incompleteTransform"
    >
      <path
        :d="incompleteFadePath"
        fill="url(#incompleteFade)"
      />
      <path
        v-if="hasIncompleteSolidPath"
        :d="incompleteSolidPath"
        fill="#888"
      />
    </g>
    <g :filter="filter">
      <path
        :transform="completeTransform"
        :fill="fill"
        stroke="none"
        :d="completePath"
        :style="{ 'opacity': opacity }"
      />
    </g>
  </g>
</template>

<style scoped>

</style>
