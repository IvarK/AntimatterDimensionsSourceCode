Vue.component('new-dimensions-tab', {
  methods: {
    maxAll() {
      maxAll();
    }
  },
  template:
  `<div>
  <div class="modes-container">
    <button class="storebtn" style="width: 100px; height: 30px; padding: 0;">Until 10</button>
    <button class="storebtn" @click="maxAll" style="width: 100px; height: 30px; padding: 0;">Max All (M)</button>
  </div>
  <new-tickspeed-row></new-tickspeed-row>
  <div class="dimensions-container">
    <new-dimension-row 
      v-for="tier in 8"
      :key="tier"
      :tier="tier"></new-dimension-row>
  </div>
  <div class="resets-container">
    <new-dim-shift-row></new-dim-shift-row>
    <new-galaxy-row></new-galaxy-row>
  </div>
</div>
  `
})