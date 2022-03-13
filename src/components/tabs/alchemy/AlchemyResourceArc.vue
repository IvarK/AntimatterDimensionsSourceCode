<script>
export default {
  name: "AlchemyResourceArc",
  props: {
    resource: {
      type: Object,
      required: true
    },
    classObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: 0,
      fillFraction: 0,
    };
  },
  computed: {
    spinnerTransform() {
      return {
        transform: `rotate(${this.fillFraction * 360}deg)`,
        background: this.fillFraction === 1 ? "#ff9800" : undefined
      };
    },
    fillerTransform() {
      return {
        opacity: this.fillFraction > 0.5 ? 1 : 0,
        background: this.fillFraction === 1 ? "#ff9800" : undefined
      };
    },
    maskTransform() {
      return {
        opacity: this.fillFraction > 0.5 ? 0 : 1
      };
    }
  },
  methods: {
    update() {
      this.amount = this.resource.amount;
      this.fillFraction = this.resource.fillFraction;
    }
  }
};
</script>

<template>
  <div class="o-alchemy-resource-arc-wrapper">
    <div
      class="o-alchemy-resource-arc-spinner o-alchemy-resource-arc-circle"
      :style="spinnerTransform"
    />
    <div
      class="o-alchemy-resource-arc-filler o-alchemy-resource-arc-circle"
      :style="fillerTransform"
    />
    <div
      class="o-alchemy-resource-arc-mask"
      :style="maskTransform"
    />
    <div
      class="o-alchemy-node-mask"
      :class="classObject"
    >
      {{ resource.symbol }}
    </div>
  </div>
</template>

<style scoped>

</style>
