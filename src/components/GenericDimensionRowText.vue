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
  data() {
    return {
      width: 0,
    };
  },
  computed: {
    rateText() {
      return this.tier < 8
        ? ` (+${format(this.rate, 2, 2)}%/s)`
        : "";
    },
  },
  methods: {
    update() {
      // Needs to be reactive or else rows that don't have changing values (eg. the highest dimension and any higher
      // locked ones) won't change layout when the window size changes
      this.width = window.innerWidth;
    },
    adjustableTextStyle() {
      const isSmall = this.width < 1450;
      return {
        display: "flex",
        "text-align": "left",
        width: "100%",
        "flex-direction": isSmall ? "column" : "row",
        "justify-content": "flex-start",
        "align-items": isSmall ? "flex-start" : "center",
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
  text-align: left;
  margin-right: 1rem;
}

.c-dim-row__small {
  font-size: 1.2rem;
}
</style>
