Vue.component('secret-achievements-tab', {
  template:
    `<div class="l-achievement-grid">
      <secret-achievement-row v-for="row in 4" :key="row" :row="row" />
    </div>`
});