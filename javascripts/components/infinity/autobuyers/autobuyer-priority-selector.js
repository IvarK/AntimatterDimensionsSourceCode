"use strict";

Vue.component("autobuyer-priority-selector", {
  props: {
    autobuyer: Object
  },
  data() {
    return {
      value: 1
    };
  },
  methods: {
    update() {
      this.value = this.autobuyer.priority;
    },
    handleChange(event) {
      const newValue = parseInt(event.target.value, 10);
      this.autobuyer.priority = newValue;
      this.value = newValue;
    }
  },
  template: `
    <div>
      <div>Priority:</div>
      <select @change="handleChange">
        <option v-for="i in 9" :value="i" :selected="i === value">{{ i }}</option>
      </select>
    </div>`
});
