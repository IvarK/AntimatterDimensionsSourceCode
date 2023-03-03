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
      isSmall: 0,
    };
  },
  computed: {
    rateText() {
      return this.rate.neq(0)
        ? ` (+${format(this.rate, 2, 2)}%/s)`
        : "";
    },
    showPercentage() {
      return player.options.showHintText.showPercentage || ui.view.shiftDown;
    },

  },
  methods: {
    update() {
      // Needs to be reactive or else rows that don't have changing values (eg. the highest dimension and any higher
      // locked ones) won't change layout when the window size changes
      this.isSmall = window.innerWidth < 1573;
    },
    adjustableTextClass() {
      return {
        "l-narrow-box": this.isSmall,
        "l-wide-box": !this.isSmall,
      };
    }
  }
};
</script>

<template>
  <div class="l-dimension-text-container">
    <div :class="adjustableTextClass()">
      <span class="c-dim-row__large">
        {{ name }}
      </span>
      <span class="c-dim-row__small">
        {{ multiplierText }}
      </span>
    </div>
    <div :class="adjustableTextClass()">
      <span class="c-dim-row__large">
        {{ amountText }}
      </span>
      <span
        v-if="rate.neq(0) && showPercentage"
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
  grid-column: 1 / 5;
}

.l-narrow-box {
  display: flex;
  text-align: left;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.l-wide-box {
  display: flex;
  text-align: left;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.c-dim-row__large {
  text-align: left;
  margin-right: 1rem;
}

.c-dim-row__small {
  font-size: 1.2rem;
  margin-right: 1rem;
}
</style>
