<script>
export default {
  name: "MultipleAutobuyersToggleLabel",
  props: {
    autobuyers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      globalToggle: false,
      allAutobuyersOn: false,
      allAutobuyersOff: false
    };
  },
  computed: {
    autobuyerToggleClass() {
      if (!this.globalToggle) {
        return this.allAutobuyersOff ? "fas fa-times" : "fas fa-pause";
      }
      if (this.allAutobuyersOn) return "fas fa-check";
      return this.allAutobuyersOff ? "fas fa-times" : "fas fa-minus";
    },
    autobuyerStateClass() {
      if (!this.globalToggle) {
        return {
          "o-autobuyer-toggle-checkbox__label": true,
          "o-autobuyer-toggle-checkbox__label--active-paused": this.allAutobuyersOn,
          "o-autobuyer-toggle-checkbox__label--deactive-paused": this.allAutobuyersOff,
          "o-autobuyer-toggle-checkbox__label--disabled": true
        };
      }
      return {
        "o-autobuyer-toggle-checkbox__label": true,
        "o-autobuyer-toggle-checkbox__label--active": this.allAutobuyersOn,
        "o-autobuyer-toggle-checkbox__label--ambigious": !this.allAutobuyersOn && !this.allAutobuyersOff,
        "o-autobuyer-toggle-checkbox__label--disabled": false
      };
    },
  },
  methods: {
    update() {
      this.globalToggle = player.auto.autobuyersOn;
      this.allAutobuyersOn = this.autobuyers.every(x => x.isActive);
      this.allAutobuyersOff = this.autobuyers.every(x => !x.isActive);
    },
    toggle() {
      for (const autobuyer of this.autobuyers) {
        autobuyer.isActive = this.allAutobuyersOff;
      }
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
.o-autobuyer-toggle-checkbox__label--ambigious {
  background-color: #4582d3;
}
</style>
