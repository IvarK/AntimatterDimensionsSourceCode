<script>
export default {
  name: "AutobuyerToggleLabel",
  props: {
    autobuyer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isActive: false,
      globalToggle: false,
    };
  },
  computed: {
    name() {
      return this.autobuyer.name;
    },
    autobuyerToggleClass() {
      if (!this.globalToggle) {
        return this.isActive ? "fas fa-pause" : "fas fa-times";
      }
      return this.isActive ? "fas fa-check" : "fas fa-times";
    },
    autobuyerStateClass() {
      if (!this.globalToggle) {
        return {
          "o-autobuyer-toggle-checkbox__label": true,
          "o-autobuyer-toggle-checkbox__label--active-paused": this.isActive,
          "o-autobuyer-toggle-checkbox__label--deactive-paused": !this.isActive,
          "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
        };
      }
      return {
        "o-autobuyer-toggle-checkbox__label": true,
        "o-autobuyer-toggle-checkbox__label--active": this.isActive,
        "o-autobuyer-toggle-checkbox__label--disabled": !this.globalToggle
      };
    },
  },
  methods: {
    update() {
      this.isActive = this.autobuyer.isActive;
      this.globalToggle = player.auto.autobuyersOn;
    },
    toggle() {
      this.autobuyer.toggle();
    },
  }
};
</script>

<template>
  <div
    class="l-autobuyer-box__footer"
    @click="toggle"
  >
    <label :class="autobuyerStateClass">
      <span :class="autobuyerToggleClass" />
    </label>
    <input
      :checked="isActive && globalToggle"
      :disabled="!globalToggle"
      :name="name"
      type="checkbox"
    >
  </div>
</template>

<style scoped>

</style>
