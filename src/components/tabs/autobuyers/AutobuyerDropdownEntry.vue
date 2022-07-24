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
      class="c-autobuyer-box__mode-select"
      :value="optionMode"
      @click="changeMode(optionMode)"
    >
      {{ modeNameFn(optionMode) }}
    </div>
  </div>
</template>

<style scoped>

</style>
