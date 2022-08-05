<script>
export default {
  name: "AutobuyerDropdownEntry",
  props: {
    autobuyer: {
      type: Object,
      required: true
    },
    modes: {
      type: Array,
      required: true
    },
    modeNameFn: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      mode: 0,
    };
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
    },
    changeMode(mode) {
      // eslint-disable-next-line vue/no-mutating-props
      this.autobuyer.mode = mode;
      this.mode = mode;
      this.$parent.openRequest = false;
    }
  }
};
</script>

<template>
  <div>
    <div
      v-for="optionMode in modes"
      :key="optionMode"
      class="o-primary-btn c-autobuyer-box__mode-select l-autobuyer-choice"
      :value="optionMode"
      @click="changeMode(optionMode)"
    >
      {{ modeNameFn(optionMode) }}
    </div>
  </div>
</template>

<style scoped>
.l-autobuyer-choice {
  border-radius: 0;
  border-top: 0;
  box-shadow: none;
}

.l-autobuyer-choice:hover {
  background-color: var(--color-good);
}

.l-autobuyer-choice:first-child {
  border-radius: var(--var-border-radius, 0.5rem) var(--var-border-radius, 0.5rem) 0 0;
}

.l-autobuyer-choice:last-child {
  border-radius: 0 0 var(--var-border-radius, 0.5rem) var(--var-border-radius, 0.5rem);
}
</style>
