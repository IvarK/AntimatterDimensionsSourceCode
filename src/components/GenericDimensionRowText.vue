<script>
export default {
  name: "GenericDimensionRowText",
  props: {
    tier: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    multiplierText: {
      type: String,
      required: true
    },
    amountText: {
      type: String,
      required: true
    },
    rate: {
      type: Object,
      required: true
    },
  },
  computed: {
    rateText() {
      return this.tier < 8
        ? ` (+${format(this.rate, 2, 2)}%/s)`
        : "";
    },
  },
  methods: {
    adjustableTextStyle() {
      return {
        display: "flex",
        "text-align": "left",
        width: "100%",
        "flex-direction": window.innerWidth < 1450 ? "column" : "row",
        "justify-content": "space-between",
        "align-items": "center",
      };
    }
  }
};
</script>

<template>
  <div class="l-dimension-text-container">
    <div :style="adjustableTextStyle()">
      <span class="c-dim-row__large">
        {{ name }}
      </span>
      <span class="c-dim-row__small">
        {{ multiplierText }}
      </span>
    </div>
    <div :style="adjustableTextStyle()">
      <span class="c-dim-row__large">
        {{ amountText }}
      </span>
      <span
        v-if="rate.neq(0)"
        class="c-dim-row__small"
      >
        {{ rateText }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.l-dimension-text-container {
  display: flex;
  height: 3.5rem;
  align-content: center;
  grid-column: 1 / 7;
}

.c-dim-row__large {
  width: 100%;
  text-align: left;
}

.c-dim-row__small {
  width: 100%;
  font-size: 1.2rem;
}
</style>
