<script>
export default {
  name: "AutobuyerToggleLabel",
  props: {
    isActive: Boolean,
    isDisabled: Boolean,
    name: {
      type: String,
      required: true
    },
  },
  computed: {
    autobuyerToggleClass() {
      if (this.isDisabled) {
        return this.isActive ? "fas fa-pause" : "fas fa-times";
      }
      return this.isActive ? "fas fa-check" : "fas fa-times";
    },
    autobuyerStateClass() {
      if (this.isDisabled) {
        return {
          "o-autobuyer-toggle-checkbox__label": true,
          "o-autobuyer-toggle-checkbox__label--active-paused": this.isActive,
          "o-autobuyer-toggle-checkbox__label--deactive-paused": !this.isActive,
          "o-autobuyer-toggle-checkbox__label--disabled": this.isDisabled
        };
      }
      return {
        "o-autobuyer-toggle-checkbox__label": true,
        "o-autobuyer-toggle-checkbox__label--active": this.isActive,
        "o-autobuyer-toggle-checkbox__label--disabled": this.isDisabled
      };
    },
  },
};
</script>

<template>
  <div
    class="l-autobuyer-box__footer"
    @click="emitClick"
  >
    <label :class="autobuyerStateClass">
      <span :class="autobuyerToggleClass" />
    </label>
    <input
      :checked="isActive && !isDisabled"
      :disabled="isDisabled"
      :name="name"
      type="checkbox"
    >
  </div>
</template>

<style scoped>

</style>
