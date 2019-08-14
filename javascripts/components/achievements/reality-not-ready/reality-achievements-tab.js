Vue.component('reality-achievements-tab', {
  template:
    `<div class="l-achievement-grid">
      <reality-achievement-row v-for="row in 4" :key="row" :row="row" />
      <br><br>
      <reality-achievement-row v-for="row in 4" :key="row" :row="row" />
    </div>`
});